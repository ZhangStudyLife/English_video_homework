import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const COLORS = {
  ink: "#070A12",
  text: "#F7FAFF",
  muted: "#AAB4C8",
  red: "#E43D30",
  gold: "#F6C65B",
  cyan: "#39D9FF",
  green: "#4FE39B",
  parchment: "#E8DFCC",
};

export const CinematicBackdrop: React.FC<{
  image?: string;
  focus?: string;
  tint?: string;
  brightness?: number;
  saturate?: number;
  contrast?: number;
}> = ({
  image,
  focus = "center",
  tint = "rgba(7,10,18,0.62)",
  brightness = 0.58,
  saturate = 0.95,
  contrast = 1.08,
}) => {
  const frame = useCurrentFrame();
  const drift = 1.04 + Math.sin(frame / 180) * 0.01;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, overflow: "hidden" }}>
      {image ? (
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: focus,
            transform: `scale(${drift}) translate3d(${Math.sin(frame / 100) * 10}px, ${Math.cos(frame / 130) * 8}px, 0)`,
            filter: `brightness(${brightness}) saturate(${saturate}) contrast(${contrast})`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background: `
            linear-gradient(90deg, rgba(7,10,18,0.92), ${tint} 48%, rgba(7,10,18,0.88)),
            radial-gradient(circle at 72% 36%, rgba(57,217,255,0.14), transparent 34%),
            radial-gradient(circle at 20% 72%, rgba(228,61,48,0.12), transparent 30%)
          `,
        }}
      />
    </AbsoluteFill>
  );
};

export const CinematicTexture: React.FC<{ opacity?: number }> = ({ opacity = 0.16 }) => {
  const frame = useCurrentFrame();
  const dots = Array.from({ length: 110 }, (_, i) => ({
    x: Math.abs(Math.sin((i + frame * 0.11) * 41.23) % 1) * 1920,
    y: Math.abs(Math.sin((i + frame * 0.17) * 87.91) % 1) * 1080,
    opacity: 0.12 + (i % 5) * 0.035,
  }));

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: 1,
            height: 1,
            background: COLORS.parchment,
            opacity: dot.opacity,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(57,217,255,0.035) 1px, transparent 1px)",
          backgroundSize: "100% 6px, 90px 90px",
          backgroundPosition: `0 ${frame % 6}px, ${(frame * 0.3) % 90}px 0`,
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 170px rgba(0,0,0,0.88)" }} />
      <div style={{ position: "absolute", inset: "0 0 auto", height: 78, background: "rgba(0,0,0,0.78)" }} />
      <div style={{ position: "absolute", inset: "auto 0 0", height: 78, background: "rgba(0,0,0,0.78)" }} />
    </AbsoluteFill>
  );
};

export const MissionReadout: React.FC<{
  label: string;
  value: string;
  color?: string;
  y?: number;
}> = ({ label, value, color = COLORS.parchment, y = 902 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 118,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: "Inter, Microsoft YaHei, sans-serif",
        fontSize: 13,
        letterSpacing: 2.5,
        color,
        opacity: 0.68,
        textTransform: "uppercase",
        pointerEvents: "none",
      }}
    >
      <span>{label}</span>
      <span style={{ width: 58, height: 1, background: `${color}88` }} />
      <span>{value}</span>
      <span>T+{String(Math.max(0, Math.round(frame / 30))).padStart(3, "0")} SEC</span>
    </div>
  );
};

export const CinematicSubtitle: React.FC<{
  english: string;
  chinese: string;
  opacity?: number;
}> = ({ english, chinese, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 150,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 140px",
      opacity,
      pointerEvents: "none",
      background: "linear-gradient(180deg, rgba(7,10,18,0), rgba(7,10,18,0.86) 46%, rgba(7,10,18,0.96))",
      textAlign: "center",
      textShadow: "0 3px 12px rgba(0,0,0,0.92)",
      fontFamily: "Inter, Microsoft YaHei, sans-serif",
    }}
  >
    <div style={{ fontSize: 36, fontWeight: 760, lineHeight: 1.2, color: COLORS.text, maxWidth: 1660 }}>
      {english}
    </div>
    <div style={{ marginTop: 8, fontSize: 26, fontWeight: 500, lineHeight: 1.2, color: COLORS.muted, maxWidth: 1660 }}>
      {chinese}
    </div>
  </div>
);

export const fadeWindow = (frame: number, start: number, end: number, fadeFrames = 30) =>
  Math.min(
    interpolate(frame, [start, start + fadeFrames], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    1 -
      interpolate(frame, [end - fadeFrames, end], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
  );
