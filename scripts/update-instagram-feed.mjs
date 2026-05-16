import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import https from "node:https";

const username = process.env.IG_PUBLIC_USERNAME || "rudedog.co";
const outputPath = process.env.IG_FEED_OUTPUT || "assets/data/instagram-feed.json";
const imageDir = process.env.IG_FEED_IMAGE_DIR || "assets/images/instagram";
const imagePublicPath = process.env.IG_FEED_IMAGE_PUBLIC_PATH || "assets/images/instagram";
const limit = Number(process.env.IG_FEED_LIMIT || 8);

const profile = await fetchInstagramProfile(username);
const edges = profile?.data?.user?.edge_owner_to_timeline_media?.edges || [];

await prepareImageDir(imageDir);

const remoteItems = edges
  .map(({ node }) => toFeedItem(node, username))
  .filter((item) => item.remoteImage)
  .slice(0, limit);

const items = [];

for (const item of remoteItems) {
  const filename = `${item.shortcode || item.timestamp || items.length}.jpg`.replace(/[^a-zA-Z0-9.-]/g, "-");
  const filePath = `${imageDir}/${filename}`;
  const publicPath = `${imagePublicPath}/${filename}`;

  await downloadImage(item.remoteImage, filePath, username);
  items.push({
    tag: item.tag,
    title: item.title,
    caption: item.caption,
    image: publicPath,
    alt: item.alt,
    url: item.url,
    timestamp: item.timestamp
  });
}

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
    shortcode: node.shortcode,
    tag: "RUDEDOG OFFICIAL",
    title: "FROM @rudedog.co",
    caption: cleanCaption(caption),
    remoteImage: node.thumbnail_src || node.display_url || "",
    alt: caption ? cleanCaption(caption, 90) : "RUDEDOG official Instagram post",
    url: permalink,
    timestamp: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : undefined
  };
}

async function prepareImageDir(directory) {
  await mkdir(directory, { recursive: true });

  const files = await readdir(directory);
  await Promise.all(files
    .filter((file) => file.endsWith(".jpg"))
    .map((file) => unlink(`${directory}/${file}`)));
}

function downloadImage(imageUrl, filePath, profileUsername) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, {
      headers: {
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Referer": `https://www.instagram.com/${profileUsername}/`,
        "User-Agent": "Mozilla/5.0"
      }
    }, (response) => {
      const chunks = [];

      response.on("data", (chunk) => {
        chunks.push(chunk);
      });
      response.on("end", async () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Could not download Instagram image: ${response.statusCode}`));
          return;
        }

        const contentType = response.headers["content-type"] || "";
        if (!contentType.startsWith("image/")) {
          reject(new Error(`Instagram image response was ${contentType || "not an image"}`));
          return;
        }

        await writeFile(filePath, Buffer.concat(chunks));
        resolve();
      });
    }).on("error", reject);
  });
}

function cleanCaption(caption = "", maxLength = 140) {
  return caption
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength) || "ภาพล่าสุดจาก Instagram ทางการของ RUDEDOG";
}
