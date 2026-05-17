const endpoint = process.env.IG_FEED_HEALTH_URL || "https://rudedog-instagram-feed.rudedog.workers.dev?mode=official&market=TH";
const fallbackEndpoint = process.env.IG_FEED_FALLBACK_URL || "https://rudedog.co/assets/data/instagram-feed.json";

const response = await fetch(endpoint, { cache: "no-store" });
const payload = await readJson(response);
const items = Array.isArray(payload.items) ? payload.items : [];

if (response.ok && items.some((item) => item.image)) {
  console.log(`Instagram feed OK: ${items.length} items from ${payload.source || endpoint}`);
  process.exit(0);
}

const metaMessage = payload.metaMessage || payload.error || `${response.status} ${response.statusText}`;
console.error(`Instagram feed live endpoint failed: ${metaMessage}`);

const fallbackResponse = await fetch(fallbackEndpoint, { cache: "no-store" });
const fallbackPayload = await readJson(fallbackResponse);
const fallbackItems = Array.isArray(fallbackPayload.items) ? fallbackPayload.items : [];

if (fallbackResponse.ok && fallbackItems.some((item) => item.image)) {
  console.error(`Static fallback still OK: ${fallbackItems.length} items from ${fallbackPayload.source || fallbackEndpoint}`);
}

process.exit(1);

async function readJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return {
      error: `Could not parse JSON response from ${response.url}: ${error.message}`
    };
  }
}
