import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PartA_Economy } from "./PartA_Economy";
import { PartB_Tech } from "./PartB_Tech";
import { PartC_Green } from "./PartC_Green";
import { PartD_Life } from "./PartD_Life";
import { BgmLayer, NarrationLayer, SubtitleLayer } from "../components/AudioLayers";

const PART_A_FRAMES = 2100;
const PART_B_FRAMES = 1800;
const PART_C_FRAMES = 1800;
const PART_D_FRAMES = 2100;

export const FULL_VIDEO_DURATION = PART_A_FRAMES + PART_B_FRAMES + PART_C_FRAMES + PART_D_FRAMES;

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={PART_A_FRAMES} name="Part A - Economy">
        <PartA_Economy />
      </Sequence>
      <Sequence from={PART_A_FRAMES} durationInFrames={PART_B_FRAMES} name="Part B - Tech">
        <PartB_Tech />
      </Sequence>
      <Sequence from={PART_A_FRAMES + PART_B_FRAMES} durationInFrames={PART_C_FRAMES} name="Part C - Green">
        <PartC_Green />
      </Sequence>
      <Sequence from={PART_A_FRAMES + PART_B_FRAMES + PART_C_FRAMES} durationInFrames={PART_D_FRAMES} name="Part D - Life">
        <PartD_Life />
      </Sequence>
      <BgmLayer />
      <NarrationLayer />
      <SubtitleLayer />
    </AbsoluteFill>
  );
};
