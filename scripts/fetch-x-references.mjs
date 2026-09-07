import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/x-reference");
const apiKey = process.env.TWITTERAPI_IO_KEY;

if (!apiKey) throw new Error("TWITTERAPI_IO_KEY is missing. Set it in your shell before running this script.");

await fs.mkdir(path.join(outDir, "avatars"), {recursive: true});

const apiGet = async (pathname) => {
  const response = await fetch(`https://api.twitterapi.io${pathname}`, {
    headers: {"x-api-key": apiKey, "Content-Type": "application/json"},
  });
  if (!response.ok) throw new Error(`twitterapi.io ${response.status}: ${await response.text()}`);
  return response.json();
};

if (process.argv.includes("--viewer-avatar")) {
  const result = await apiGet("/twitter/user/info?userName=ujjwalmathur03");
  if (result.status !== "success" || !result.data?.profilePicture) {
    throw new Error("Viewer profile lookup failed");
  }
  const avatarResponse = await fetch(result.data.profilePicture.replace("_normal", "_400x400"));
  if (!avatarResponse.ok) throw new Error("Viewer avatar download failed");
  await fs.writeFile(path.join(outDir, "avatars", "ujjwalmathur03.jpg"), Buffer.from(await avatarResponse.arrayBuffer()));
  console.log("Saved the viewer profile avatar.");
  process.exit(0);
}

const handles = ["thejustinwelsh", "SahilBloom"];
const profiles = [];

for (const handle of handles) {
  const result = await apiGet(`/twitter/user/info?userName=${encodeURIComponent(handle)}`);
  if (result.status !== "success" || !result.data) throw new Error(`Profile lookup failed: ${handle}`);
  const user = result.data;
  profiles.push({
    id: user.id,
    userName: user.userName,
    name: user.name,
    profilePicture: user.profilePicture,
    followers: user.followers,
    description: user.description,
    isBlueVerified: user.isBlueVerified,
  });

  const avatarResponse = await fetch(user.profilePicture.replace("_normal", "_400x400"));
  if (!avatarResponse.ok) throw new Error(`Avatar download failed: ${handle}`);
  await fs.writeFile(
    path.join(outDir, "avatars", `${handle}.jpg`),
    Buffer.from(await avatarResponse.arrayBuffer()),
  );
}

const justin = profiles.find((profile) => profile.userName.toLowerCase() === "thejustinwelsh");
const timeline = await apiGet(
  `/twitter/user/tweet_timeline?userId=${encodeURIComponent(justin.id)}&includeReplies=false`,
);
const tweets = timeline.data?.tweets ?? [];
const relevant = tweets
  .filter((tweet) => /repl|comment|conversation|audience|grow|attention|engag/i.test(tweet.text ?? ""))
  .slice(0, 12)
  .map((tweet) => ({
    id: tweet.id,
    text: tweet.text,
    likeCount: tweet.likeCount,
    replyCount: tweet.replyCount,
    retweetCount: tweet.retweetCount,
    viewCount: tweet.viewCount,
    bookmarkCount: tweet.bookmarkCount,
    createdAt: tweet.createdAt,
    url: tweet.url,
  }));

await fs.writeFile(
  path.join(outDir, "creators.json"),
  JSON.stringify({fetchedAt: new Date().toISOString(), profiles, relevantJustinWelshPosts: relevant}, null, 2),
);

console.log(`Saved ${profiles.length} verified creator profiles, ${relevant.length} relevant posts, and local avatars.`);
