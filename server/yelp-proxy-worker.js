// Dessert Spotter live search (optional).
//
// A tiny Cloudflare Worker that forwards searches from the app to the Yelp Fusion API.
// Your Yelp API key stays here, on the server, and is never sent to people's phones.
//
// Setup (about 10 minutes, see README.md for the full steps):
//   1. Get a Yelp Fusion API key at https://www.yelp.com/developers
//   2. Create a Cloudflare Worker and paste this file in.
//   3. In the Worker's Settings > Variables, add:
//        YELP_API_KEY     your Yelp key (mark it as a secret)
//        ALLOWED_ORIGINS  the address of your site, e.g. https://amarisct.github.io
//   4. Put the Worker's URL in config.js as yelpProxy.

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0] || "null",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "accept",
      Vary: "Origin",
    };
    const json = (body, status = 200, extra = {}) =>
      new Response(typeof body === "string" ? body : JSON.stringify(body), {
        status,
        headers: { ...cors, "content-type": "application/json", ...extra },
      });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "GET") return json({ error: "Only GET is supported." }, 405);
    if (allowed.length && !allowed.includes(origin)) return json({ error: "This site isn't allowed to search." }, 403);
    if (!env.YELP_API_KEY) return json({ error: "YELP_API_KEY isn't set on the Worker." }, 500);

    const u = new URL(request.url);
    const term = (u.searchParams.get("term") || "").trim().slice(0, 80);
    const latitude = Number(u.searchParams.get("latitude"));
    const longitude = Number(u.searchParams.get("longitude"));
    const limit = Math.max(1, Math.min(10, Number(u.searchParams.get("limit")) || 8));
    if (!term || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return json({ error: "term, latitude and longitude are required." }, 400);
    }

    const yelp = new URL("https://api.yelp.com/v3/businesses/search");
    yelp.searchParams.set("term", term);
    yelp.searchParams.set("latitude", latitude.toFixed(4));
    yelp.searchParams.set("longitude", longitude.toFixed(4));
    yelp.searchParams.set("limit", String(limit));
    yelp.searchParams.set("radius", "40000"); // about 25 miles, Yelp's maximum

    const res = await fetch(yelp.toString(), {
      headers: { Authorization: `Bearer ${env.YELP_API_KEY}`, accept: "application/json" },
      cf: { cacheTtl: 900, cacheEverything: true },
    });
    const body = await res.text();
    return json(body, res.status, { "cache-control": "public, max-age=900" });
  },
};
