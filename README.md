# Dessert Spotter

**Crave it. Find it. Rate it.** Search the exact dessert you want and find the closest place that has it. Starting in Washington.

A project by [amaris ct](https://amarisct.github.io/Amaris/).

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | The website: the Dessert Spotter home page |
| `app/index.html` | The app: dessert search, spotting radar, ratings, reviews, ways to get it, and menu-change reports |
| `manifest.webmanifest` | Makes the app installable on phones (name, icons, colors) |
| `sw.js` | Keeps the app working on a weak or no connection |
| `config.js` | Settings: the live-search address and the Supabase keys for photos |
| `assets/` | Logo, app icons, favicons, and ZIP code locations used for distances |
| `server/yelp-proxy-worker.js` | Optional: turns on live Yelp results and photos inside the app (see below) |
| `server/supabase-photos.sql` | Sets up shared photos in Supabase (see below) |
| `.nojekyll` | Tells GitHub Pages to publish the files as they are |

There's nothing to install or build. It's plain HTML, CSS and JavaScript.

## Put it online with GitHub Pages (free)

1. Sign in to GitHub with the account or organization that hosts your amaris ct site.
2. Create a new repository named **dessertspotter** and set it to Public.
3. On the repository page, choose **Add file → Upload files**, then drag in **everything inside this folder**, including `.nojekyll`. To see hidden files on a Mac, press Cmd+Shift+. in Finder. Commit the upload.
4. Go to **Settings → Pages**. Under "Build and deployment," set **Source** to "Deploy from a branch," choose **main** and **/ (root)**, and save.
5. After a minute or two, the site is live at `https://<your-github-name>.github.io/dessertspotter/`. The app is at `/dessertspotter/app/`.

### Using dessertspotter.com

If you own the domain, enter it under **Settings → Pages → Custom domain**. Then, at your domain registrar, add the DNS records GitHub shows you. Turn on **Enforce HTTPS** once it's available, because phones only install apps from secure (https) sites.

## Install it on a phone

- **iPhone:** open the app in Safari, tap **Share**, then **Add to Home Screen**.
- **Android:** open the app in Chrome and tap **Install app**, or use the ⋮ menu.

## What works right away

- Search by dessert name, with distances from a ZIP code, a Washington neighborhood, or **Use my location**
- The spotted list: 77 starter places from 2026 Seattle and Tacoma food guides, each linked to its source
- The dessert radar, directions, and DoorDash links
- "Look further" buttons that open the same search on Yelp, Google Maps, and DoorDash
- Adding spots, ratings, reviews, ways to get it, and menu-change reports
- City, neighborhood, and ZIP code suggestions in the **Near** box

**For now, ratings, reviews, and added spots are saved on each person's own phone or browser.** Photos are shared once Supabase is set up (below).

## Turn on photos people add (Supabase, free, about 15 minutes)

People can add a photo after they try something, from **Rate or update** or **Add photo** on any spot. Photos show on that spot's card, in a full-screen viewer, and in a "Fresh from the community" section on the home page. People sign in with a one-time email link (no password) before sharing, and they can delete their own photos.

1. Create a free account at <https://supabase.com> and click **New project**. Name it `dessert-spotter`, choose a region near Washington (US West), and save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste everything in `server/supabase-photos.sql`, and click **Run**. This creates the photo list and the photo storage, with rules so people can only add or delete their own photos.
3. Open **Authentication → URL Configuration**:
   - **Site URL:** `https://amarisct.github.io/dessertspotter/app/`
   - **Redirect URLs:** add `https://amarisct.github.io/dessertspotter/app/` (and your dessertspotter.com address later)
4. Open **Project Settings → API Keys** (or **API**). Copy the **Project URL** and the **Publishable key** (older projects call it the "anon public" key). Both are safe to put on a public site.
5. Paste them into `config.js` and upload it to the repository:
   ```js
   supabaseUrl: "https://abcdefghijkl.supabase.co",
   supabaseKey: "sb_publishable_..."
   ```

**Before a real launch:**
- Supabase's built-in email is only meant for testing and sends a handful of sign-in emails per hour. Under **Authentication → Emails → SMTP Settings**, connect a sending service, such as Resend's free plan, so sign-in links arrive reliably.
- **Removing photos:** you can delete any photo in **Table Editor → photos** (delete the row) and **Storage → photos** (delete the file).
- **Inactivity:** free Supabase projects pause after a week with no activity. If photos stop loading, open the Supabase dashboard and click **Restore**.
- **Privacy page:** sign-in stores people's email addresses, so add a short privacy page before you promote the site widely.

## Turn on live Yelp results and Yelp photos (optional)

With this on, the app shows live Yelp results (name, photo, rating, distance) for any dessert search, anywhere in the US.

1. Create a Yelp Fusion API key at <https://www.yelp.com/developers>. Yelp charges per call, so check the current plan and pricing on their site.
2. Create a free Cloudflare account, then go to **Workers & Pages → Create → Worker**. Replace the starter code with `server/yelp-proxy-worker.js` and deploy.
3. In the Worker's **Settings → Variables and Secrets**, add:
   - `YELP_API_KEY`: your Yelp key, saved as a **secret**
   - `ALLOWED_ORIGINS`: `https://amarisct.github.io` (separate several addresses with commas)
4. Copy the Worker's address (it ends in `.workers.dev`) into `config.js` as `yelpProxy` and upload it.

Never put the Yelp key in `config.js` or anywhere else in this repository. Everything here is public.

## Later: shared ratings and reviews

Ratings, reviews, ways to get it, and menu-change reports are still saved on each person's device. Once Supabase is set up for photos, the same project and sign-in can store these too, so everyone sees them. In the code they live in `writeDoc` and `initCommunity` in `app/index.html`.

## Updating the starter list

The starter places are the `STARTER` list near the top of the script in `app/index.html`. Each row is:

```
["id", "Name", "Neighborhood or city", "Street address", "ZIP", ["Dessert|search tags", ...], "source"]
```

Sources are listed in `SRC` just above it.
