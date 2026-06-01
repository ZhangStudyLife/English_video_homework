import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const clips = JSON.parse(readFileSync(join("src", "data", "narration.json"), "utf8"));
const strict = !process.argv.includes("--allow-missing-audio");
const problems = [];

for (const clip of clips) {
  if (clip.english !== clip.ttsText) {
    problems.push(`${clip.id}: english and ttsText differ`);
  }
  if (clip.startFrame >= clip.endFrame) {
    problems.push(`${clip.id}: invalid frame window`);
  }
  if (/[�]|[?]{3,}|鍦|涓|鈫|鑴|绉/.test(`${clip.english} ${clip.chinese}`)) {
    problems.push(`${clip.id}: subtitle contains likely mojibake or placeholder text`);
  }
  const target = (clip.endFrame - clip.startFrame) / 30;
  if (clip.audioReady) {
    const file = join("public", "audio", "narration", clip.audioFile);
    if (!existsSync(file)) problems.push(`${clip.id}: missing ${file}`);
    if (Math.abs(clip.durationSeconds - target) > 0.8) {
      problems.push(`${clip.id}: duration ${clip.durationSeconds}s differs from target ${target.toFixed(3)}s`);
    }
  } else if (strict) {
    problems.push(`${clip.id}: audioReady is false`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`Validated ${clips.length} narration clips`);
