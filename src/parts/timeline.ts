import narrationSource from './narration-source.json';

export const FPS = 30;
export const DURATION_IN_FRAMES = 70 * FPS;
export const CHAPTER_END_FRAME = 50 * FPS;
export const CREDITS_DURATION_FRAMES = DURATION_IN_FRAMES - CHAPTER_END_FRAME;
export const SUBTITLE_AREA_HEIGHT = 150;

export type NarrationWindow = {
  id: string;
  startFrame: number;
  endFrame: number;
  english: string;
  chinese: string;
};

export const NARRATION_WINDOWS: NarrationWindow[] = narrationSource;

export type VisualScene = {
  id: string;
  startFrame: number;
  endFrame: number;
};

export const VISUAL_SCENES: VisualScene[] = [
  {id: 'title', startFrame: 0, endFrame: 360},
  {id: 'digital-life', startFrame: 360, endFrame: 630},
  {id: 'logistics', startFrame: 630, endFrame: 930},
  {id: 'parcel-count', startFrame: 930, endFrame: 1260},
  {id: 'closing', startFrame: 1260, endFrame: CHAPTER_END_FRAME},
];
