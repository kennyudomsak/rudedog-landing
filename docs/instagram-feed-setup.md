# RUDEDOG Instagram Feed Setup

This landing page does not expose Meta or Instagram access tokens in the browser.

## Current Draft

- The page reads `assets/data/instagram-feed.json`.
- The first item becomes the large spotlight image.
- The spotlight rotates automatically every 5.6 seconds.
- The current JSON uses curated RUDEDOG images as a safe fallback.
- Meta app created for this flow: `RUDEDOG Website Feed`.
- Connected Facebook Page: `RUDEDOG`.
- Connected Instagram Business account: `rudedog.co`.
- Instagram Business Account ID: `17841401168141637`.

## Meta Status

Graph API Explorer can see the RUDEDOG Page and the connected Instagram Business account. The live hashtag endpoint is blocked for now because Meta requires App Review approval for `Instagram Public Content Access` before an app can call `ig_hashtag_search`.

Until that approval is complete, the live site should use the official `@rudedog.co` media feed. Do not paste the access token into code, GitHub, this document, or the browser frontend.

## Current Feed Mode

Default mode is now `hashtag` for the live Worker route.

- `official`: reads recent media from the connected Instagram Business account `rudedog.co`.
- `hashtag`: reads public media from `#rudedog`, but only after Meta approves `Instagram Public Content Access`.
- Current live fallback: `scripts/update-instagram-feed.mjs` downloads recent public `@rudedog.co` images into `assets/images/instagram/` and writes them into `assets/data/instagram-feed.json`.
- Run `node scripts/update-instagram-feed.mjs` before a push when the landing page needs a fresh official Instagram snapshot.

The homepage now calls `/api/instagram-feed?mode=hashtag&tag=rudedog&market=TH` first. If the Worker is unavailable, the JavaScript falls back to `assets/data/instagram-feed.json`.

To switch back to the official feed, change the homepage Worker URL/config from `mode=hashtag` or `IG_FEED_MODE = "hashtag"` to `mode=official` / `IG_FEED_MODE = "official"`.

## Live Hashtag Flow

1. Connect an Instagram Business or Creator account to a Facebook Page.
2. Create or use a Meta app with Instagram Graph API access.
3. Generate a long-lived access token.
4. Copy `wrangler.toml.example` to `wrangler.toml`, then uncomment the `routes` block when the Cloudflare zone is ready.
5. Add Worker secrets:
   - `IG_ACCESS_TOKEN`
   - `IG_HASHTAG=rudedog`
6. Submit the Meta app for `Instagram Public Content Access` review.
7. Point the website feed source to the Worker endpoint or run a scheduled job that writes a reviewed JSON file.

The site is wired to try `/api/instagram-feed?mode=hashtag&tag=rudedog&market=TH` first and fall back to `assets/data/instagram-feed.json` when the Worker is not available or returns no usable items.

## Thailand-Only Filtering

Instagram Hashtag Search does not provide a reliable country filter. The Worker therefore supports a Thailand market filter by checking Thai-language captions and configured Thailand keywords.

Recommended campaign rule: ask customers and dealers to post with both `#rudedog` and `#rudedogthailand` or `#rudedogthai`. This makes the Thailand filter much more accurate.

Config in `wrangler.toml`:

- `IG_MARKET = "TH"`
- `IG_THAILAND_KEYWORDS = "ไทย,ประเทศไทย,กรุงเทพ,bangkok,thailand,นนทบุรี,rudedogthailand,rudedogthai"`

## Brand Safety

Do not publish every hashtag result automatically. Keep a review step or a filter list so off-brand images, competitor posts, repost spam, or unrelated hashtag use do not appear on `rudedog.co`.
