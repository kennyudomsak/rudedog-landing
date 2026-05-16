export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hashtag = url.searchParams.get("tag") || env.IG_HASHTAG || "rudedog";
    const mode = (url.searchParams.get("mode") || env.IG_FEED_MODE || "official").toLowerCase();
    const market = (url.searchParams.get("market") || env.IG_MARKET || "TH").toUpperCase();
    const userId = env.IG_BUSINESS_ACCOUNT_ID;
    const token = env.IG_ACCESS_TOKEN;
    const graphVersion = env.META_GRAPH_VERSION || "v25.0";

    if (!userId || !token) {
      return jsonResponse({ error: "Missing Instagram Graph API credentials" }, 500);
    }

    if (mode !== "hashtag") {
      return fetchOfficialFeed({ graphVersion, userId, token, market, env });
    }

    return fetchHashtagFeed({ graphVersion, hashtag, userId, token, market, env });
  }
};

async function fetchOfficialFeed({ graphVersion, userId, token, market, env }) {
    const officialMedia = new URL(`https://graph.facebook.com/${graphVersion}/${userId}/media`);
    officialMedia.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}");
    officialMedia.searchParams.set("limit", "12");
    officialMedia.searchParams.set("access_token", token);

    const mediaResult = await fetch(officialMedia).then((response) => response.json());
    if (mediaResult.error) {
      return jsonResponse({
        source: "RUDEDOG Official",
        updatedAt: new Date().toISOString(),
        items: [],
        error: "Instagram official media access is not available yet.",
        metaMessage: mediaResult.error.message
      }, 403);
    }

    const items = (mediaResult.data || [])
      .filter((item) => ["IMAGE", "CAROUSEL_ALBUM", "VIDEO", "REELS"].includes(item.media_type))
      .filter((item) => isAllowedMarket(item, market, env))
      .map((item) => ({
        tag: "RUDEDOG OFFICIAL",
        title: "FROM @rudedog.co",
        caption: cleanCaption(item.caption),
        image: getMediaImage(item),
        alt: item.caption || "RUDEDOG official Instagram post",
        url: item.permalink,
        timestamp: item.timestamp
      }))
      .filter((item) => item.image)
      .slice(0, 8);

    return jsonResponse({
      source: "RUDEDOG Official",
      updatedAt: new Date().toISOString(),
      items
    });
}

async function fetchHashtagFeed({ graphVersion, hashtag, userId, token, market, env }) {
    const hashtagSearch = new URL(`https://graph.facebook.com/${graphVersion}/ig_hashtag_search`);
    hashtagSearch.searchParams.set("user_id", userId);
    hashtagSearch.searchParams.set("q", hashtag.replace(/^#/, ""));
    hashtagSearch.searchParams.set("access_token", token);

    const hashtagResult = await fetch(hashtagSearch).then((response) => response.json());
    if (hashtagResult.error) {
      return jsonResponse({
        source: `#${hashtag}`,
        updatedAt: new Date().toISOString(),
        items: [],
        error: "Instagram hashtag access is not available yet.",
        metaMessage: hashtagResult.error.message
      }, 403);
    }
    const hashtagId = hashtagResult?.data?.[0]?.id;

    if (!hashtagId) {
      return jsonResponse({ source: `#${hashtag}`, updatedAt: new Date().toISOString(), items: [] });
    }

    const recentMedia = new URL(`https://graph.facebook.com/${graphVersion}/${hashtagId}/recent_media`);
    recentMedia.searchParams.set("user_id", userId);
    recentMedia.searchParams.set("fields", "id,caption,media_type,media_url,permalink,timestamp");
    recentMedia.searchParams.set("limit", "12");
    recentMedia.searchParams.set("access_token", token);

    const mediaResult = await fetch(recentMedia).then((response) => response.json());
    if (mediaResult.error) {
      return jsonResponse({
        source: `#${hashtag}`,
        updatedAt: new Date().toISOString(),
        items: [],
        error: "Instagram recent media access is not available yet.",
        metaMessage: mediaResult.error.message
      }, 403);
    }
    const items = (mediaResult.data || [])
      .filter((item) => item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM")
      .filter((item) => isAllowedMarket(item, market, env))
      .slice(0, 8)
      .map((item) => ({
        tag: `#${hashtag}`,
        title: "RUDEDOG LIVE",
        caption: cleanCaption(item.caption),
        image: item.media_url,
        alt: item.caption || `Instagram post tagged #${hashtag}`,
        url: item.permalink,
        timestamp: item.timestamp
      }));

    return jsonResponse({
      source: `#${hashtag}`,
      updatedAt: new Date().toISOString(),
      items
    });
}

function getMediaImage(item) {
  if (item.media_url) return item.media_url;
  if (item.thumbnail_url) return item.thumbnail_url;

  const child = item.children?.data?.find((entry) => entry.media_url || entry.thumbnail_url);
  return child?.media_url || child?.thumbnail_url || "";
}

function cleanCaption(caption = "") {
  return caption.replace(/\s+/g, " ").trim().slice(0, 140) || "ภาพล่าสุดจากคนในแพ็ก";
}

function isAllowedMarket(item, market, env) {
  if (market !== "TH") return true;

  const caption = (item.caption || "").toLowerCase();
  const configuredKeywords = (env.IG_THAILAND_KEYWORDS || "")
    .split(",")
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);
  const thailandSignals = configuredKeywords.length
    ? configuredKeywords
    : ["ไทย", "ประเทศไทย", "กรุงเทพ", "bangkok", "thailand", "นนทบุรี", "rudedogthailand", "rudedogthai"];

  return thailandSignals.some((keyword) => caption.includes(keyword)) || /[\u0E00-\u0E7F]/.test(caption);
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=900",
      "access-control-allow-origin": "https://rudedog.co"
    }
  });
}
