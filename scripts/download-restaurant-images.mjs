import { createWriteStream, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { get } from "node:https";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "projects");

/** Verified Unsplash photo IDs (return HTTP 200). */
const assets = [
  { file: "project-screenshot-1.jpg", id: "1546069901-ba9599a7e63c" },
  { file: "project-screenshot-2.jpg", id: "1555939594-58d7cb561ad1" },
  { file: "project-screenshot-3.jpg", id: "1565299624946-b28f40a0ae38" },
  { file: "project-screenshot-4.jpg", id: "1553621042-f6e147245754" },
  { file: "project-screenshot-5.jpg", id: "1554118811-1e0d58224f24" },
  { file: "project-screenshot-6.jpg", id: "1555507036-ab1f4038808a" },
  { file: "project-demo-1.jpg", id: "1517248135467-4c7edcad34c4" },
  { file: "project-demo-2.jpg", id: "1414235077428-338989a2e8c0" },
  { file: "code-preview.jpg", id: "1723744894227-0d31ddbb0adb" },
  { file: "team-photo.jpg", id: "1770374957076-054154d7bad4" },
];

function download(url, destination) {
  return new Promise((resolve, reject) => {
    get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        download(response.headers.location, destination).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed ${url}: ${response.statusCode}`));
        return;
      }

      const file = createWriteStream(destination);
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
      file.on("error", reject);
    }).on("error", reject);
  });
}

mkdirSync(root, { recursive: true });

for (const asset of assets) {
  const url = `https://images.unsplash.com/photo-${asset.id}?auto=format&fit=crop&w=1400&h=1000&q=85`;
  const destination = join(root, asset.file);
  process.stdout.write(`Downloading ${asset.file}... `);
  await download(url, destination);
  process.stdout.write("done\n");
}

console.log(`\nSaved ${assets.length} images to public/images/projects/`);
