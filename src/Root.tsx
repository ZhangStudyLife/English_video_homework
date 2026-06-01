import React from "react";
import { Composition } from "remotion";
import { FullVideo, FULL_VIDEO_DURATION } from "./parts/FullVideo";
import { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "./constants";

export { COLORS, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
