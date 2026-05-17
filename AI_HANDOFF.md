# RUDEDOG Landing AI Handoff

อ่านไฟล์นี้ก่อนเริ่มแก้เว็บ `rudedog.co` เพื่อไม่ให้ AI หลายตัวแก้งานซ้ำหรือย้อนงานกันเอง

## Project

- Repo: `kennyudomsak/rudedog-landing`
- Live site: `https://rudedog.co/`
- Main files:
  - `index.html`
  - `assets/css/styles.css`
  - `assets/js/main.js`

## 2026-05-17 Layout Cleanup

ผู้ใช้ให้สำรวจและแก้เฉพาะความถูกต้องของเว็บไซต์ ตัวอักษร การจัดเรียง และ responsive layout โดยยังไม่โฟกัสคุณภาพเนื้อหา

### Audit Findings

- Desktop/tablet โดยรวมผ่าน ไม่มี horizontal page overflow จริง
- Mobile ไม่มี horizontal scroll จริง แต่ header แน่นและมี safety margin น้อย
- Mobile product cards สูงเกินไป เพราะ breakpoint `max-width: 560px` เปลี่ยน `.product-media` จาก 2 คอลัมน์เป็น 1 คอลัมน์ ทำให้รูปสินค้า 2 ภาพซ้อนแนวตั้ง
- Full-page screenshot มีหลายพื้นที่เป็นภาพ blank ระหว่าง lazy loading แม้ asset ไม่เสีย
- `.hero-title` บน mobile ใช้ `flex-wrap: nowrap` ซึ่งเสี่ยงล้นถ้ามีการเปลี่ยนข้อความภายหลัง

### Changes Made

- Updated `assets/css/styles.css`
- Mobile header:
  - จัด header กลับมา `align-items: center`
  - ลด padding/gap
  - ย่อ visible text ของ `.shop-link` บน mobile เป็น `Shopee` ผ่าน CSS pseudo-element เพื่อกันแถว header แน่นเกิน
- Mobile hero:
  - เปลี่ยน `.hero-title` ให้ `flex-wrap: wrap`
  - เพิ่ม `min-width: 0` และ `overflow-wrap: anywhere`
- Mobile product/dealer cards:
  - เปลี่ยน `.product-media` และ `.dealer-media` บน `max-width: 560px` กลับมาเป็น 2 คอลัมน์แบบ responsive
  - ลด padding รูป packshot บน mobile
  - ลด padding/card text เล็กน้อย
  - ทำให้ปุ่มใน product card กว้างเต็ม card เพื่อกดง่าย
- Lazy image polish:
  - เพิ่ม shimmer placeholder background ให้ `img[loading="lazy"]`
  - เพิ่ม placeholder background ให้ media containers ก่อนภาพโหลด

### Do Not Revert Without Rechecking

- อย่าเปลี่ยน `.product-media` / `.dealer-media` ใน mobile กลับเป็น `grid-template-columns: 1fr` เพราะจะทำให้ card สูงเกินและหน้า mobile ยาวมากอีกครั้ง
- อย่าใส่ `nowrap` กลับให้ `.hero-title` ใน mobile เว้นแต่มีการทดสอบที่ 360px/390px แล้วว่าไม่ล้น
- ถ้าจะปรับ performance รูปภาพต่อ ให้เช็คด้วย browser screenshot ทั้ง desktop/tablet/mobile หลังแก้

## Suggested Verification

- Run local static server from repo root
- Check:
  - `390x844`
  - `360x740`
  - `768x1000`
  - `1440x1000`
- Confirm:
  - `document.documentElement.scrollWidth === window.innerWidth`
  - mobile product cards no longer stack both images vertically
  - header buttons do not collide
  - image placeholders look intentional while lazy images load

## 2026-05-17 Local Hero Design Draft

ยังไม่ push / deploy / live จนกว่าผู้ใช้จะสั่งว่า “เอาการแก้ไขทั้งหมด push”

### Changes Made Locally

- Updated `index.html`
  - Hero headline changed to stacked `#คนนอก` / `กรอบ`
  - `#` is separated from `คนนอก` so the fitting script can match `กรอบ` to `คนนอก` only
  - Hero CTA 1 changed to `New-in มาใหม่` linking to `https://s.shopee.co.th/1BJFIykJtW?share_channel_code=6`
  - Hero CTA 2 changed to `โปรลง แรงมากกก` linking to the RUDEDOG Shopee shop search for keyword `โปรลง`
  - In CTA 2, `แรงมากกก` and the `SALE!` badge use a bright red accent
- Updated `assets/css/styles.css`
  - Added stacked hero title sizing and tight line spacing
  - Keeps the two headline lines visually packed without overlapping
  - Restyled `.trust-proof` into a quieter proof strip with smaller numeric scale and cleaner dividers
- Updated `assets/js/main.js`
  - Added responsive fit script for `[data-fit-hero-title]`
  - Measures `.hero-title-top-word` (`คนนอก`) and scales `.hero-title-bottom` (`กรอบ`) to match that width, excluding `#`
- Trust proof copy changed from `แบรนด์ไทยจากกรุงเทพฯ` to `แบรนด์ไทย`

### Local Verification

- Checked 390px mobile and 1440px desktop with local server
- `กรอบ` width matches `คนนอก` width, not `#คนนอก`
- No horizontal overflow found in the checked viewports

## 2026-05-17 Local Proof + Instagram Preview Fix

ยังไม่ push / deploy / live หลัง commit `615e2d6` จนกว่าผู้ใช้จะสั่ง push อีกครั้ง

### Changes Made Locally

- Updated `assets/css/styles.css`
  - Enlarged `.proof-label` and `.proof-note` so the small Thai explanation lines feel fuller and closer to the visual weight of the numbers
  - Tuned mobile `.trust-proof strong` sizing to keep `1,000,000+`, `15,000,000`, and `SINCE 1981` readable without causing horizontal overflow
  - Fixed mobile Instagram preview text by adding safer wrapping, line-height, and mobile caption clamping for `.ig-spotlight strong` and `.ig-spotlight p`

### Local Verification

- Checked local `390x844`, `360x760`, and `1440x1000`
- Confirmed `document.documentElement.scrollWidth - window.innerWidth` is `0`
- Confirmed Instagram preview text no longer overlaps on mobile

## 2026-05-17 Local Instagram Mobile Row Fix

ยังไม่ push / deploy / live หลัง commit `4b7e007` จนกว่าผู้ใช้จะสั่ง push อีกครั้ง

### Changes Made Locally

- Updated `assets/css/styles.css`
  - In the mobile Instagram breakpoint, `.ig-spotlight img` now overrides the desktop `height: 100%` with `height: auto`
  - Forced the image into grid row 1 and the text panel into grid row 2
  - Added a white background and z-index to the text panel so it cannot visually overlay the image

### Local Verification Needed

- Recheck mobile screenshot around the Instagram section before pushing

## 2026-05-17 Local Aero3 Figure Redesign

ยังไม่ push / deploy / live หลัง commit `4b7e007` จนกว่าผู้ใช้จะสั่ง push อีกครั้ง

### Changes Made Locally

- Updated `assets/css/styles.css`
  - Redesigned `.aero3-figure` from a heavy black card into a lighter brand proof block
  - Replaced black background with translucent white/paper background, thin blue top rule, subtle bottom divider, and a narrow blue accent rail
  - Removed the white rectangle behind `15,000,000`; the number now sits directly on the page with brand-blue emphasis
  - Tuned mobile sizing so the number stays large but fits within the viewport

## 2026-05-17 Instagram Hashtag Feed Install

ผู้ใช้ให้ติดตั้งส่วน Instagram feed สำหรับ `#rudedog` ในประเทศไทย

### Changes Made

- Updated `index.html`
  - Homepage feed now calls `https://rudedog-instagram-feed.rudedog.workers.dev?mode=hashtag&tag=rudedog&market=TH`
  - If hashtag is blocked, homepage falls back to `https://rudedog-instagram-feed.rudedog.workers.dev?mode=official&market=TH`
  - Fallback remains `assets/data/instagram-feed.json`
- Added committed `wrangler.toml`
  - Worker route: `rudedog.co/api/instagram-feed*`
  - `IG_FEED_MODE = "hashtag"`
  - `IG_MARKET = "TH"`
  - `IG_HASHTAG = "rudedog"`
- Updated `workers/instagram-hashtag-worker.js`
  - Added OPTIONS/CORS handling for the API route
- Updated `docs/instagram-feed-setup.md`
  - Documented hashtag-first mode and fallback behavior
- Updated `.gitignore`
  - Ignore `.dev.vars` and `.wrangler/`

### Current Deploy Blockers

- Local machine is not authenticated with Cloudflare Wrangler: `npx wrangler whoami` returns not authenticated
- No local `IG_ACCESS_TOKEN` environment variable was available
- The Worker cannot be deployed from this machine until Cloudflare login and the Instagram token secret are added

### 2026-05-17 Deploy Update

- Cloudflare Wrangler login completed for `ken.udomsak@rdbox.co`
- Registered workers.dev subdomain: `rudedog.workers.dev`
- Deployed Worker:
  - `https://rudedog-instagram-feed.rudedog.workers.dev`
  - Cloudflare route also exists: `rudedog.co/api/instagram-feed*`
- Added `IG_ACCESS_TOKEN` as Cloudflare Worker secret. Do not commit or print this token.
- Important DNS note: `rudedog.co` currently resolves directly to GitHub Pages IPs, so Cloudflare route interception does not work unless DNS is moved/proxied through Cloudflare. The homepage therefore uses the workers.dev URL directly.
- Current Meta blocker: hashtag endpoint returns `403` because Meta requires App Review approval for `Instagram Public Content Access`. The site falls back to the static JSON until approval.
- Live official endpoint works and returns recent `@rudedog.co` media, so the homepage uses that as the middle fallback while hashtag review is pending.
- Meta dashboard update: `Instagram Public Content Access` was added to the app permissions/features list and now shows `พร้อมทดสอบ` (ready for testing). The App Review submission page still shows nothing submitted, so Meta has not granted live public hashtag access yet.

### 2026-05-17 Token Expiry Follow-Up

- Live Worker endpoint is reachable, but both modes currently fail with Meta `403`.
- Exact blocker from Meta: `Error validating access token: Session has expired on Sunday, 17-May-26 02:00:00 PDT`.
- Static fallback JSON still works on `https://rudedog.co/assets/data/instagram-feed.json`, so the homepage does not break.
- Added `scripts/check-instagram-feed.mjs` to fail fast when the Worker live feed stops returning image items.
- Added `scripts/exchange-meta-token.mjs` to exchange a Meta token using `META_APP_ID`, `META_APP_SECRET`, and `IG_ACCESS_TOKEN`.
- Added `scripts/check-instagram-feed.mjs`; run it from automation or CI to detect live feed failures.
- Next manual step: generate/refresh a long-lived token in Meta, then run `npx wrangler secret put IG_ACCESS_TOKEN` and `npx wrangler deploy`.

### 2026-05-17 Token Refresh Completed

- Copied a new token from Meta Graph API Explorer without printing it in chat or terminal output.
- Updated Cloudflare Worker secret with `npx wrangler secret put IG_ACCESS_TOKEN`.
- Deployed Worker version `e32ebd41-5ec3-4501-8147-62869f570040`.
- Official endpoint now works: `https://rudedog-instagram-feed.rudedog.workers.dev?mode=official&market=TH` returns 8 items from `RUDEDOG Official`.
- Hashtag endpoint no longer returns token expiry/permission error, but currently returns 0 items for both `market=TH` and `market=GLOBAL`.
- Health check script currently passes because it checks the official live feed.
- GitHub CLI auth was refreshed with the `workflow` scope.
- Added `.github/workflows/instagram-feed-health.yml` to run `node scripts/check-instagram-feed.mjs` daily and via manual `workflow_dispatch`.

### 2026-05-17 Hero Layout Adjustment

- User approved pushing this batch.
- ALPHA CAP product image now appears before the trust/social proof pack.
- Hero headline uses `Bai Jamjuree` from Google Fonts while keeping the two-line `#คนนอก` / `กรอบ` layout.
- Proof pack is now six floating white cards with rounded corners and a subtle shadow.
- Proof cards include `ผู้คนนับ 1,000,000+`, linked `TikTok Shop 4.9/5`, linked `Shopee 4.9/5`, linked `1.5M Facebook followers`, linked `180K TikTok followers`, and linked `30K Shopee followers`.

### 2026-05-17 Instagram Token Status

- During pre-push verification, `node scripts/check-instagram-feed.mjs` reported the Worker live endpoint failing again with Meta token expiry: `Session has expired on Sunday, 17-May-26 05:00:00 PDT`.
- Static fallback still works with 8 local `@rudedog.co` items, so the homepage should not visually break, but the Cloudflare Worker secret needs another long-lived token refresh.

### Deploy When Credentials Are Available

Run from repo root:

```sh
npx wrangler login
npx wrangler secret put IG_ACCESS_TOKEN
npx wrangler deploy
```

After deploy, test:

```sh
curl "https://rudedog-instagram-feed.rudedog.workers.dev?mode=hashtag&tag=rudedog&market=TH"
```

Expected JSON shape:

```json
{
  "source": "#rudedog",
  "updatedAt": "...",
  "items": []
}
```

If Meta still blocks `ig_hashtag_search`, the endpoint may return `403` with `Instagram hashtag access is not available yet.` The homepage will keep using the static fallback JSON.
