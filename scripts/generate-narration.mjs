import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const apiKey = process.env.XIAOMI_MIMO_API_KEY;
const baseUrl = process.env.XIAOMI_MIMO_BASE_URL || "https://token-plan-cn.xiaomimimo.com/v1";
const manifestPath = join("src", "data", "narration.json");
const outputDir = join("public", "audio", "narration");
const model = "mimo-v2.5-tts-voicedesign";

const voicePrompt = [
  "A young adult male English technology documentary narrator.",
  "Clear, confident, energetic, and slightly witty, with a popular online science-commentary rhythm.",
  "Medium-fast pace, crisp articulation, controlled excitement, no celebrity imitation, no heavy drama.",
].join(" ");

const wavDuration = (buffer) => {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("Expected WAV audio from TTS response");
  }
  let offset = 12;
  let sampleRate = 0;
  let channels = 0;
  let bitsPerSample = 0;
  let dataBytes = 0;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (id === "fmt ") {
      channels = buffer.readUInt16LE(offset + 10);
      sampleRate = buffer.readUInt32LE(offset + 12);
      bitsPerSample = buffer.readUInt16LE(offset + 22);
    }
    if (id === "data") dataBytes = size;
    offset += 8 + size + (size % 2);
  }
  if (!sampleRate || !channels || !bitsPerSample || !dataBytes) {
    throw new Error("Could not read WAV duration");
  }
  return dataBytes / (sampleRate * channels * (bitsPerSample / 8));
};

if (!apiKey) {
  console.error("Missing XIAOMI_MIMO_API_KEY. Set it in the environment before generating narration.");
  process.exit(1);
}

const clips = JSON.parse(readFileSync(manifestPath, "utf8"));
mkdirSync(outputDir, { recursive: true });

for (const clip of clips) {
  const targetSeconds = (clip.endFrame - clip.startFrame) / 30;
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "user", content: `${voicePrompt} Fit the line naturally into about ${targetSeconds.toFixed(1)} seconds.` },
        { role: "assistant", content: clip.ttsText },
      ],
      audio: {
        format: "wav",
        optimize_text_preview: false,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TTS failed for ${clip.id}: ${res.status} ${body}`);
  }

  const json = await res.json();
  const audioData = json?.choices?.[0]?.message?.audio?.data;
  if (!audioData) throw new Error(`No audio data returned for ${clip.id}`);

  const audio = Buffer.from(audioData, "base64");
  const outFile = join(outputDir, clip.audioFile);
  writeFileSync(outFile, audio);
  clip.durationSeconds = Number(wavDuration(audio).toFixed(3));
  clip.audioReady = true;

  const delta = clip.durationSeconds - targetSeconds;
  console.log(`${clip.id}: ${clip.durationSeconds}s target ${targetSeconds.toFixed(3)}s delta ${delta.toFixed(3)}s`);
}

for (let i = 0; i < clips.length; i++) {
  const clip = clips[i];
  if (!clip.audioReady || !clip.durationSeconds) continue;
  const nextStart = clips[i + 1]?.startFrame ?? 7800;
  const syncedEnd = clip.startFrame + Math.ceil((clip.durationSeconds + 0.22) * 30);
  clip.endFrame = Math.min(syncedEnd, nextStart - 6);
}

writeFileSync(manifestPath, `${JSON.stringify(clips, null, 2)}\n`);
console.log(`Updated ${manifestPath}`);
