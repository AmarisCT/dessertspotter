// Dessert Spotter settings. Everything in this file is public, so never put secret keys here.
window.DS_CONFIG = {
  // Live Yelp results and Yelp photos in the app. Leave empty to show "Look further" links instead.
  // Deploy server/yelp-proxy-worker.js (see README) and paste its address here,
  // e.g. "https://dessert-spotter-yelp.yourname.workers.dev".
  yelpProxy: "",

  // Photos people add after they try something. Leave both empty until Supabase is set up (see README).
  // supabaseUrl: your Project URL, e.g. "https://abcdefghijkl.supabase.co"
  // supabaseKey: your Publishable key (or the older "anon public" key). This key is safe to share.
  supabaseUrl: "",
  supabaseKey: ""
};
