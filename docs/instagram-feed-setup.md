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

The homepage now calls `https://rudedog-instagram-feed.rudedog.workers.dev?mode=hashtag&tag=rudedog&market=TH` first. If Meta blocks hashtag access, the JavaScript falls back to `https://rudedog-instagram-feed.rudedog.workers.dev?mode=official&market=TH`, then finally to `assets/data/instagram-feed.json`.

To switch back to the official feed, change the homepage Worker URL/config from `mode=hashtag` or `IG_FEED_MODE = "hashtag"` to `mode=official` / `IG_FEED_MODE = "official"`.

## Token Rotation And Expiry Prevention

The Worker uses `IG_ACCESS_TOKEN` from Cloudflare secrets. If Meta returns `Error validating access token: Session has expired`, both the hashtag and official live endpoints will return `403`; the homepage still falls back to `assets/data/instagram-feed.json`.

Prevention:

- Use a long-lived Meta user access token for the connected Page / Instagram Business account.
- Refresh or replace the token before it expires. Long-lived tokens are still not permanent, so schedule a manual rotation cadence around every 45 days.
- Keep `META_APP_ID`, `META_APP_SECRET`, and `IG_ACCESS_TOKEN` out of git.
- Run `scripts/check-instagram-feed.mjs` daily from the GitHub Actions workflow and Codex automation. A failed check means the live Worker feed is broken, usually because Meta blocked hashtag access or the token expired.

Health check:

```sh
node scripts/check-instagram-feed.mjs
```

Exchange a newly generated short-lived token for a long-lived token:

```sh
META_APP_ID="..." \
META_APP_SECRET="..." \
IG_ACCESS_TOKEN="short-lived-or-existing-token" \
node scripts/exchange-meta-token.mjs
```

Update the Cloudflare Worker secret:

```sh
npx wrangler secret put IG_ACCESS_TOKEN
npx wrangler deploy
```

Then test:

```sh
curl "https://rudedog-instagram-feed.rudedog.workers.dev?mode=official&market=TH"
curl "https://rudedog-instagram-feed.rudedog.workers.dev?mode=hashtag&tag=rudedog&market=TH"
```

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

The site is wired to try `https://rudedog-instagram-feed.rudedog.workers.dev?mode=hashtag&tag=rudedog&market=TH` first, then the live official feed, then `assets/data/instagram-feed.json` when the Worker is not available or returns no usable items. `rudedog.co/api/instagram-feed*` is also configured as a Cloudflare route, but it will only intercept requests if the apex domain is proxied through Cloudflare instead of going directly to GitHub Pages.

## Thailand-Only Filtering

Instagram Hashtag Search does not provide a reliable country filter. The Worker therefore supports a Thailand market filter by checking Thai-language captions and configured Thailand keywords.

Recommended campaign rule: ask customers and dealers to post with both `#rudedog` and `#rudedogthailand` or `#rudedogthai`. This makes the Thailand filter much more accurate.

Config in `wrangler.toml`:

- `IG_MARKET = "TH"`
- `IG_THAILAND_KEYWORDS = "ไทย,ประเทศไทย,กรุงเทพ,bangkok,thailand,นนทบุรี,rudedogthailand,rudedogthai"`

## Brand Safety

Do not publish every hashtag result automatically. Keep a review step or a filter list so off-brand images, competitor posts, repost spam, or unrelated hashtag use do not appear on `rudedog.co`.
