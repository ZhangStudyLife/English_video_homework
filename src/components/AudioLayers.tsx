import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { CinematicSubtitle } from "./Cinematic";
import narration from "../data/narration.json";
import { VIDEO_FPS } from "../constants";

type NarrationClip = {
  id: string;
  startFrame: number;
  endFrame: number;
  english: string;
  chinese: string;
  audioFile: string;
  durationSeconds: number;
  audioReady: boolean;
};

const clips = narration as NarrationClip[];
const FULL_VIDEO_DURATION_FRAMES = 7800;

const narrationDuckAmount = (frame: number) => {
  const fadeFrames = VIDEO_FPS * 4;
  return Math.max(
    0,
    ...clips.map((clip) => {
      if (frame >= clip.startFrame && frame < clip.endFrame) {
        return 1;
      }

      if (frame < clip.startFrame) {
        return Math.max(0, 1 - (clip.startFrame - frame) / fadeFrames);
      }

      return Math.max(0, 1 - (frame - clip.endFrame) / fadeFrames);
    }),
  );
};

const bgmVolume = (frame: number) => {
  const fadeIn = Math.min(1, frame / (VIDEO_FPS * 3));
  const fadeOut = Math.min(1, (FULL_VIDEO_DURATION_FRAMES - frame) / (VIDEO_FPS * 3));
  const base = 0.105 - narrationDuckAmount(frame) * 0.04;
  return base * Math.max(0, Math.min(fadeIn, fadeOut));
};

export const NarrationLayer: React.FC = () => (
  <>
    {clips
      .filter((clip) => clip.audioReady && clip.durationSeconds > 0)
      .map((clip) => (
        <Sequence
          durationInFrames={clip.endFrame - clip.startFrame}
          from={clip.startFrame}
          key={clip.id}
        >
          <Audio src={staticFile(`audio/narration/${clip.audioFile}`)} />
        </Sequence>
      ))}
  </>
);

export const SubtitleLayer: React.FC = () => (
  <>
    {clips.map((clip) => (
      <Sequence
        durationInFrames={clip.endFrame - clip.startFrame}
        from={clip.startFrame}
        key={`${clip.id}-subtitle`}
      >
        <CinematicSubtitle english={clip.english} chinese={clip.chinese} />
      </Sequence>
    ))}
  </>
);

export const BgmLayer: React.FC = () => (
  <Audio
    loop
    loopVolumeCurveBehavior="extend"
    src={staticFile("audio/bgm/interstellar-studio-cover.mp3")}
    volume={bgmVolume}
  />
);
