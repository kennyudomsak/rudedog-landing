import { writeFile } from "node:fs/promises";
import https from "node:https";

const username = process.env.IG_PUBLIC_USERNAME || "rudedog.co";
const outputPath = process.env.IG_FEED_OUTPUT || "assets/data/instagram-feed.json";
const limit = Number(process.env.IG_FEED_LIMIT || 8);

const profile = await fetchInstagramProfile(username);
const edges = profile?.data?.user?.edge_owner_to_timeline_media?.edges || [];

const items = edges
  .map(({ node }) => toFeedItem(node, username))
  .filter((item) => item.image)
  .slice(0, limit);

await writeFile(outputPath, `${JSON.stringify({
  source: `@${username}`,
  updatedAt: new Date().toISOString(),
  items
}, null, 2)}\n`);

console.log(`Updated ${outputPath} with ${items.length} @${username} posts.`);

function fetchInstagramProfile(profileUsername) {
  const requestUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(profileUsername)}`;

  return new Promise((resolve, reject) => {
    https.get(requestUrl, {
      headers: {
        "Accept": "application/json",
        "Referer": `https://www.instagram.com/${profileUsername}/`,
        "User-Agent": "Mozilla/5.0",
        "X-IG-App-ID": "936619743392459"
      }
    }, (response) => {
      let body = "";

      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Instagram responded with ${response.statusCode}: ${body.slice(0, 120)}`));
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(new Error(`Could not parse Instagram response: ${error.message}`));
        }
      });
    }).on("error", reject);
  });
}

function toFeedItem(node, profileUsername) {
  const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
  const permalink = node.shortcode ? `https://www.instagram.com/p/${node.shortcode}/` : `https://www.instagram.com/${profileUsername}/`;

  return {
    tag: "RUDEDOG OFFICIAL",
    title: "FROM @rudedog.co",
    caption: cleanCaption(caption),
    image: node.thumbnail_src || node.display_url || "",
    alt: caption ? cleanCaption(caption, 90) : "RUDEDOG official Instagram post",
    url: permalink,
    timestamp: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : undefined
  };
}

function cleanCaption(caption = "", maxLength = 140) {
  return caption
    .replace(/https?:\/\/\\S+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength) || "ภาพล่าสุดจาก Instagram ทางการของ RUDEDOG";
}
