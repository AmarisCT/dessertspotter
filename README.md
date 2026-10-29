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
| `config.js` | Settings. Only one so far: the optional live-search address |
| `assets/` | Logo, app icons, favicons, and ZIP code locations used for distances |
| `server/yelp-proxy-worker.js` | Optional: turns on live Yelp results inside the app (see below) |
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

**For now, ratings, reviews, and added spots are saved on each person's own phone or browser.** Other people won't see them until a shared database is connected (next steps).

## Next steps

### 1. Live Yelp results inside the app (optional, about 10 minutes)

1. Create a Yelp Fusion API key at <https://www.yelp.com/developers>. Check the current plan and pricing on Yelp's site.
2. Create a free Cloudflare account, then go to **Workers & Pages → Create → Worker**. Replace the starter code with `server/yelp-proxy-worker.js` and deploy.
3. In the Worker's **Settings → Variables and Secrets**, add:
   - `YELP_API_KEY`: your Yelp key, saved as a **secret**
   - `ALLOWED_ORIGINS`: your site's address, for example `https://amarisct.github.io` (separate several with commas)
4. Copy the Worker's address (it ends in `.workers.dev`) into `config.js`:
   ```js
   window.DS_CONFIG = { yelpProxy: "https://dessert-spotter-yelp.yourname.workers.dev" };
   ```
5. Upload the new `config.js` to the repository. Live results appear above the spotted list, marked "Powered by Yelp," as Yelp's terms require.

Never put the Yelp key in `config.js` or anywhere else in this folder. Everything here is public.

### 2. Shared ratings and reviews

To let everyone see each other's ratings, reviews, and added spots, connect a free database such as Supabase, with sign-in so people can only edit their own entries. The app already keeps all of this in one place in the code (`writeDoc` and `initCommunity` in `app/index.html`), so switching from on-device storage to a shared database is a contained change.

## Updating the starter list

The starter places are the `STARTER` list near the top of the script in `app/index.html`. Each row is:

```
["id", "Name", "Neighborhood or city", "Street address", "ZIP", ["Dessert|search tags", ...], "source"]
```

Sources are listed in `SRC` just above it.
