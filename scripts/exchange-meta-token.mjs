const appId = process.env.META_APP_ID;
const appSecret = process.env.META_APP_SECRET;
const inputToken = process.env.IG_ACCESS_TOKEN;
const graphVersion = process.env.META_GRAPH_VERSION || "v25.0";

if (!appId || !appSecret || !inputToken) {
  console.error("Missing META_APP_ID, META_APP_SECRET, or IG_ACCESS_TOKEN.");
  console.error("Usage: META_APP_ID=... META_APP_SECRET=... IG_ACCESS_TOKEN=... node scripts/exchange-meta-token.mjs");
  process.exit(1);
}

const exchangeUrl = new URL(`https://graph.facebook.com/${graphVersion}/oauth/access_token`);
exchangeUrl.searchParams.set("grant_type", "fb_exchange_token");
exchangeUrl.searchParams.set("client_id", appId);
exchangeUrl.searchParams.set("client_secret", appSecret);
exchangeUrl.searchParams.set("fb_exchange_token", inputToken);

const response = await fetch(exchangeUrl);
const payload = await response.json();

if (!response.ok || payload.error) {
  console.error(payload.error?.message || `Token exchange failed with HTTP ${response.status}`);
  process.exit(1);
}

const expiresAt = payload.expires_in
  ? new Date(Date.now() + Number(payload.expires_in) * 1000).toISOString()
  : "unknown";

console.log("New long-lived token:");
console.log(payload.access_token);
console.log("");
console.log(`Expires at: ${expiresAt}`);
console.log("");
console.log("Next step:");
console.log("printf '%s' '<token above>' | npx wrangler secret put IG_ACCESS_TOKEN");
