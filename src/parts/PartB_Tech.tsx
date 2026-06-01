import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

/* ─── COLORS ─── */
const COLORS: Record<string, string> = {
  ink: "#070A12",
  panel: "rgba(7, 10, 18, 0.72)",
  cyan: "#39D9FF",
  blue: "#2F7CFF",
  red: "#E43D30",
  gold: "#F6C65B",
  parchment: "#E8DFCC",
  green: "#4FE39B",
  text: "#F7FAFF",
  muted: "#AAB4C8",
};

/* ─── UTILITIES ─── */
function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function easeOutCubic(value: number): number {
  const t = clamp01(value);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(value: number): number {
  const t = clamp01(value);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function stagger(frame: number, start: number, duration: number): number {
  return easeOutCubic((frame - start) / duration);
}

function seededDots(
  count: number,
  width: number,
  height: number,
  seed = 1
): Array<{ x: number; y: number; size: number; phase: number }> {
  return Array.from({ length: count }, (_, i) => {
    const a = Math.sin((i + seed) * 12.9898) * 43758.5453;
    const b = Math.sin((i + seed) * 78.233) * 24634.6345;
    return {
      x: Math.abs(a % 1) * width,
      y: Math.abs(b % 1) * height,
      size: 1 + (i % 4),
      phase: (i * 37 + seed * 11) % 120,
    };
  });
}

/* ─── DATA ─── */
const HIGH_SPEED_RAIL_DATA = [
  { country: "Germany", value: 1600 },
  { country: "France", value: 2800 },
  { country: "Japan", value: 3100 },
  { country: "Spain", value: 3900 },
  { country: "China", value: 45000 },
];

const CITY_POINTS: Array<{ name: string; x: number; y: number; tier: number }> = [
  { name: "北京", x: 620, y: 220, tier: 1 },
  { name: "上海", x: 720, y: 380, tier: 1 },
  { name: "广州", x: 620, y: 560, tier: 1 },
  { name: "深圳", x: 640, y: 580, tier: 1 },
  { name: "成都", x: 420, y: 420, tier: 2 },
  { name: "武汉", x: 580, y: 420, tier: 2 },
  { name: "杭州", x: 720, y: 360, tier: 2 },
  { name: "南京", x: 680, y: 340, tier: 2 },
  { name: "重庆", x: 440, y: 440, tier: 2 },
  { name: "西安", x: 480, y: 340, tier: 2 },
  { name: "天津", x: 640, y: 230, tier: 2 },
  { name: "长沙", x: 580, y: 480, tier: 3 },
  { name: "郑州", x: 560, y: 340, tier: 3 },
  { name: "济南", x: 620, y: 300, tier: 3 },
  { name: "哈尔滨", x: 680, y: 120, tier: 3 },
  { name: "沈阳", x: 680, y: 180, tier: 3 },
  { name: "大连", x: 680, y: 220, tier: 3 },
  { name: "昆明", x: 380, y: 540, tier: 3 },
  { name: "贵阳", x: 440, y: 500, tier: 3 },
  { name: "乌鲁木齐", x: 200, y: 200, tier: 3 },
];

/* ─── PRIMITIVES ─── */
function CinematicBackdrop({
  image,
  frame,
  focus = "center",
  tint = "rgba(7, 10, 18, 0.58)",
}: {
  image?: string;
  frame: number;
  focus?: string;
  tint?: string;
}) {
  const drift = 1.04 + Math.sin(frame / 180) * 0.01;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: COLORS.ink }}>
      {image && (
        <div
          style={{
            position: "absolute",
            inset: -24,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: focus,
            transform: `scale(${drift}) translate3d(${Math.sin(frame / 95) * 10}px, ${Math.cos(frame / 120) * 8}px, 0)`,
            filter: "saturate(1.05) contrast(1.05) brightness(0.72)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(90deg, rgba(7,10,18,0.90) 0%, ${tint} 44%, rgba(7,10,18,0.86) 100%),
            radial-gradient(circle at 70% 36%, rgba(57,217,255,0.18), transparent 36%),
            radial-gradient(circle at 18% 72%, rgba(228,61,48,0.14), transparent 30%)
          `,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 13%, transparent 78%, rgba(0,0,0,0.50))",
          mixBlendMode: "screen",
          opacity: 0.35,
        }}
      />
    </div>
  );
}

function FilmGrain({ frame, opacity = 0.16 }: { frame: number; opacity?: number }) {
  const dots = Array.from({ length: 140 }, (_, i) => {
    const x = Math.abs(Math.sin((i + frame * 0.11) * 41.23) % 1) * 1920;
    const y = Math.abs(Math.sin((i + frame * 0.17) * 87.91) % 1) * 1080;
    return { x, y, opacity: 0.16 + (i % 5) * 0.04 };
  });
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(232,223,204,0.045), transparent 22%, transparent 76%, rgba(232,223,204,0.035))",
        }}
      />
    </div>
  );
}

function MissionReadout({
  frame,
  label,
  value,
  x = 118,
  y = 902,
  color = COLORS.parchment,
}: {
  frame: number;
  label: string;
  value: string;
  x?: number;
  y?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        gap: 18,
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        letterSpacing: 2.5,
        color,
        opacity: 0.68,
        textTransform: "uppercase" as const,
      }}
    >
      <span>{label}</span>
      <span style={{ width: 58, height: 1, background: `${color}88` }} />
      <span>{value}</span>
      <span>T+{String(Math.max(0, Math.round(frame / 30))).padStart(3, "0")} SEC</span>
    </div>
  );
}

function EarthHorizon({
  frame,
  opacity = 0.32,
  color = COLORS.cyan,
}: {
  frame: number;
  opacity?: number;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      <defs>
        <radialGradient id="earthGlowB" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.14" />
          <stop offset="72%" stopColor={color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="960" cy="1280" r="780" fill="url(#earthGlowB)" />
      <circle
        cx="960"
        cy="1280"
        r="780"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="12 18"
        strokeDashoffset={-frame * 0.9}
        opacity="0.58"
      />
    </svg>
  );
}

function ScanlineLayer({ frame, opacity = 0.28 }: { frame: number; opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(57,217,255,0.05) 1px, transparent 1px)",
        backgroundSize: "100% 6px, 84px 84px",
        backgroundPosition: `0 ${frame % 6}px, ${(frame * 0.35) % 84}px 0`,
      }}
    />
  );
}

function Kicker({ children, color = COLORS.cyan }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 3,
        color,
        textTransform: "uppercase" as const,
      }}
    >
      {children}
    </div>
  );
}

function MetricPill({
  label,
  value,
  sub,
  color = COLORS.cyan,
  progress = 1,
}: {
  label: string;
  value: string;
  sub: string;
  color?: string;
  progress?: number;
}) {
  return (
    <div
      style={{
        width: 230,
        padding: "18px 20px",
        border: `1px solid ${color}55`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025))",
        boxShadow: `0 18px 55px rgba(0,0,0,0.32), 0 0 24px ${color}22`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 22}px)`,
      }}
    >
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 38, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color, marginTop: 8 }}>{sub}</div>
    </div>
  );
}

function BilingualSubtitle({
  english,
  chinese,
  frame,
  startFrame = 0,
  endFrame = 9999,
}: {
  english: string;
  chinese: string;
  frame: number;
  startFrame?: number;
  endFrame?: number;
}) {
  return null;
  const fadeInDuration = 15;
  const fadeOutDuration = 15;
  let opacity = 0;
  if (frame >= startFrame && frame <= endFrame) {
    if (frame < startFrame + fadeInDuration) {
      opacity = (frame - startFrame) / fadeInDuration;
    } else if (frame > endFrame - fadeOutDuration) {
      opacity = (endFrame - frame) / fadeOutDuration;
    } else {
      opacity = 1;
    }
  }
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 120px",
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 36,
          color: "#FFFFFF",
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          textAlign: "center" as const,
          lineHeight: 1.3,
          maxWidth: 1680,
        }}
      >
        {english}
      </div>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 26,
          color: "#CCCCCC",
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          textAlign: "center" as const,
          marginTop: 8,
          lineHeight: 1.3,
          maxWidth: 1680,
        }}
      >
        {chinese}
      </div>
    </div>
  );
}

/* ─── TITLE TRANSITION ─── */
function TitleTransition({
  frame,
  title,
  subtitle,
  totalFrames = 150,
}: {
  frame: number;
  title: string;
  subtitle: string;
  totalFrames?: number;
}) {
  const flyInEnd = Math.round(totalFrames * 0.4);
  const stayEnd = Math.round(totalFrames * 0.75);
  let translateX: number, opacity: number;

  if (frame < flyInEnd) {
    const progress = frame / flyInEnd;
    const easedProgress = easeOutCubic(progress);
    translateX = -1920 * (1 - easedProgress);
    opacity = easedProgress;
  } else if (frame < stayEnd) {
    translateX = 0;
    opacity = 1;
  } else {
    const fadeProgress = (frame - stayEnd) / (totalFrames - stayEnd);
    translateX = 0;
    opacity = 1 - fadeProgress;
  }

  if (opacity <= 0) return null;

  const dots = seededDots(46, 1920, 1080, 7);
  const lineProgress = easeOutCubic(frame / 34);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 220,
        transform: `translateX(${translateX}px)`,
        opacity,
        pointerEvents: "none",
        background: `
          radial-gradient(circle at 74% 34%, rgba(246,198,91,0.18), transparent 28%),
          radial-gradient(circle at 22% 72%, rgba(228,61,48,0.14), transparent 25%),
          linear-gradient(135deg, #02030A 0%, #0D1322 52%, #010208 100%)
        `,
      }}
    >
      <EarthHorizon frame={frame} opacity={0.28} color={COLORS.parchment} />
      <ScanlineLayer frame={frame} opacity={0.22} />
      <FilmGrain frame={frame} opacity={0.22} />

      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: i % 5 === 0 ? COLORS.red : COLORS.cyan,
            opacity: 0.12 + Math.sin((frame + dot.phase) / 22) * 0.06,
            boxShadow: `0 0 16px ${i % 5 === 0 ? COLORS.red : COLORS.cyan}`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: 220,
          top: 255,
          width: 1040 * lineProgress,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.gold}, ${COLORS.parchment}, transparent)`,
          boxShadow: `0 0 24px ${COLORS.gold}77`,
        }}
      />

      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 6,
          color: COLORS.parchment,
          marginBottom: 24,
          textTransform: "uppercase" as const,
        }}
      >
        Mission Record / China Through Data / 02
      </div>

      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 104,
          fontWeight: 900,
          color: COLORS.text,
          textShadow: "0 12px 42px rgba(0,0,0,0.68), 0 0 34px rgba(246,198,91,0.20)",
          letterSpacing: 0,
          textAlign: "left" as const,
          lineHeight: 0.98,
        }}
      >
        A Civilization in Motion
      </div>

      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 38,
          fontWeight: 500,
          color: COLORS.parchment,
          marginTop: 22,
          letterSpacing: 0,
          textAlign: "left" as const,
        }}
      >
        {title} / {subtitle}
      </div>

      <div
        style={{
          marginTop: 58,
          display: "flex",
          gap: 14,
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
          color: COLORS.parchment,
          fontSize: 18,
        }}
      >
        {["Steel Arteries", "Signal Grid", "Orbit", "New Landscape"].map((item, i) => (
          <React.Fragment key={item}>
            <span style={{ color: i === 0 ? COLORS.gold : COLORS.muted }}>{item}</span>
            {i < 3 && <span style={{ width: 44, height: 1, background: "rgba(255,255,255,0.25)" }} />}
          </React.Fragment>
        ))}
      </div>
      <MissionReadout frame={frame} label="Archive" value="Infrastructure at planetary scale" y={890} />
    </div>
  );
}

/* ─── BAR CHART SCENE ─── */
function BarChartScene({
  frame,
  data,
  backgroundImage,
  totalFrames = 200,
}: {
  frame: number;
  data: typeof HIGH_SPEED_RAIL_DATA;
  backgroundImage: string;
  totalFrames?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const railDots = seededDots(36, 1920, 1080, 13);
  const reveal = stagger(frame, 0, 42);
  const lineSweep = (frame * 22) % 2200;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <CinematicBackdrop image={backgroundImage} frame={frame} focus="center 56%" tint="rgba(7, 10, 18, 0.50)" />
      <EarthHorizon frame={frame} opacity={0.18} color={COLORS.gold} />
      <ScanlineLayer frame={frame} opacity={0.18} />
      <FilmGrain frame={frame} opacity={0.12} />

      {railDots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x - lineSweep * 0.08,
            top: dot.y,
            width: 80 + (i % 5) * 30,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${i % 7 === 0 ? COLORS.gold : COLORS.cyan}, transparent)`,
            opacity: 0.16,
            transform: "skewX(-18deg)",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: 120,
          top: 86,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 24}px)`,
        }}
      >
        <Kicker color={COLORS.parchment}>Surface Mission / Steel Network</Kicker>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 62,
            fontWeight: 850,
            color: COLORS.text,
            lineHeight: 1.04,
            marginTop: 16,
            letterSpacing: 0,
            textShadow: "0 12px 34px rgba(0,0,0,0.55)",
          }}
        >
          Steel arteries across a continent
        </div>
        <div
          style={{
            width: 720,
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            color: COLORS.muted,
            marginTop: 18,
            lineHeight: 1.45,
          }}
        >
          Forty-five thousand kilometers of high-speed rail compress geography into hours, not days.
        </div>
      </div>

      <div style={{ position: "absolute", right: 116, top: 112, display: "flex", gap: 18 }}>
        <MetricPill label="Operating speed" value="350" sub="km/h" color={COLORS.cyan} progress={stagger(frame, 58, 36)} />
        <MetricPill label="Daily riders" value="5.2M" sub="passengers" color={COLORS.gold} progress={stagger(frame, 74, 36)} />
      </div>

      <div style={{ position: "absolute", left: 154, top: 385, width: 1210, height: 390 }}>
        {data.map((item, index) => {
          const itemStart = 28 + index * 18;
          const progress = stagger(frame, itemStart, 58);
          if (progress <= 0) return null;
          const isChina = item.country === "China";
          const width = (item.value / maxValue) * 930 * progress;
          const y = index * 70;
          const glow = isChina ? COLORS.red : COLORS.cyan;
          return (
            <div
              key={item.country}
              style={{ position: "absolute", left: 0, top: y, width: 1210, height: 52, opacity: progress }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 15,
                  width: 142,
                  fontFamily: "Inter, sans-serif",
                  fontSize: isChina ? 24 : 20,
                  fontWeight: isChina ? 800 : 600,
                  color: isChina ? COLORS.text : COLORS.muted,
                  textAlign: "right" as const,
                }}
              >
                {item.country}
              </div>
              <div style={{ position: "absolute", left: 178, top: 24, width: 930, height: 2, background: "rgba(255,255,255,0.14)" }} />
              <div
                style={{
                  position: "absolute",
                  left: 178,
                  top: 10,
                  width,
                  height: 32,
                  background: isChina
                    ? `linear-gradient(90deg, ${COLORS.red}, ${COLORS.gold}, ${COLORS.parchment})`
                    : "linear-gradient(90deg, rgba(170,180,200,0.28), rgba(170,180,200,0.72))",
                  boxShadow: `0 0 ${isChina ? 38 : 12}px ${glow}55`,
                  clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 178 + Math.max(width, 18) + 24,
                  top: 7,
                  fontFamily: "Inter, sans-serif",
                  fontSize: isChina ? 30 : 22,
                  fontWeight: isChina ? 850 : 600,
                  color: isChina ? COLORS.text : COLORS.muted,
                  whiteSpace: "nowrap" as const,
                }}
              >
                {Math.round(item.value * progress).toLocaleString()}
                <span style={{ fontSize: 15, color: isChina ? COLORS.gold : COLORS.muted, marginLeft: 7 }}>km</span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 154,
          bottom: 198,
          width: 980,
          opacity: stagger(frame, 118, 44),
        }}
      >
        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(246,198,91,0.8), rgba(57,217,255,0.35), transparent)" }} />
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "180px 1fr",
            gap: 24,
            alignItems: "start",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ color: COLORS.gold, fontSize: 42, fontWeight: 850, lineHeight: 1 }}>75%+</div>
          <div style={{ color: COLORS.muted, fontSize: 20, lineHeight: 1.45 }}>
            of the world's operating high-speed rail mileage is concentrated in China, a ground-based system built at a scale once reserved for space programs.
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", right: 160, bottom: 238, width: 300, height: 300, opacity: stagger(frame, 112, 54) }}>
        {[0, 1, 2].map((i) => {
          const ring = 1 - (((frame + i * 24) % 90) / 90);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 42 + i * 28,
                border: `1px solid rgba(57,217,255,${0.16 + ring * 0.18})`,
                transform: `rotate(${frame * 0.22 + i * 18}deg)`,
              }}
            />
          );
        })}
        <div style={{ position: "absolute", inset: 112, background: COLORS.red, boxShadow: `0 0 36px ${COLORS.red}` }} />
      </div>

      <BilingualSubtitle
        english="A continental rail system turns distance into schedule, and schedule into national momentum."
        chinese="一个大陆尺度的高铁系统，把距离变成时刻表，把时刻表变成国家动能。"
        frame={frame}
        startFrame={24}
        endFrame={totalFrames}
      />
      <MissionReadout frame={frame} label="Ground network" value="45,000 km / operating length" />
    </div>
  );
}

/* ─── MAP HEATMAP SCENE ─── */
function cityProgress(city: { tier: number; x: number }, frame: number): number {
  const tierDelay: Record<number, number> = { 1: 0, 2: 74, 3: 146 };
  const start = 42 + (tierDelay[city.tier] ?? 0) + (city.x % 80) * 0.25;
  return stagger(frame, start, 48);
}

function generateMapDots(): Array<{ x: number; y: number; delay: number }> {
  const dots: Array<{ x: number; y: number; delay: number }> = [];
  const rows: [number, number, number][] = [
    [350, 225, 8], [430, 205, 12], [520, 215, 18], [600, 245, 21],
    [655, 305, 20], [640, 365, 23], [585, 430, 24], [515, 490, 21],
    [440, 525, 17], [360, 470, 13], [310, 390, 12], [290, 310, 10],
  ];
  rows.forEach(([x, y, count], row) => {
    for (let i = 0; i < count; i++) {
      dots.push({
        x: x + i * 18 + Math.sin(i + row) * 12,
        y: y + Math.sin(i * 0.75 + row) * 16,
        delay: row * 9 + i * 1.8,
      });
    }
  });
  return dots;
}

function MapHeatmapScene({
  frame,
  backgroundImage,
  totalFrames = 400,
}: {
  frame: number;
  backgroundImage: string;
  totalFrames?: number;
}) {
  const mapDots = generateMapDots();
  const particles = seededDots(42, 1920, 1080, 23);
  const numberProgress = stagger(frame, 160, 100);
  const displayNumber = (3.9 * numberProgress).toFixed(1);
  const globalShare = Math.round(60 * numberProgress);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <CinematicBackdrop image={backgroundImage} frame={frame} focus="center" tint="rgba(7,10,18,0.64)" />
      <EarthHorizon frame={frame} opacity={0.16} color={COLORS.cyan} />
      <ScanlineLayer frame={frame} opacity={0.2} />
      <FilmGrain frame={frame} opacity={0.12} />

      {particles.map((dot, i) => {
        const drift = ((frame * (1.2 + (i % 4) * 0.2) + dot.phase * 8) % 900) / 900;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: dot.x + Math.sin(drift * Math.PI * 2) * 46,
              top: dot.y,
              width: 4 + (i % 3),
              height: 4 + (i % 3),
              background: i % 6 === 0 ? COLORS.gold : COLORS.cyan,
              opacity: Math.sin(drift * Math.PI) * 0.26,
              boxShadow: `0 0 16px ${i % 6 === 0 ? COLORS.gold : COLORS.cyan}`,
            }}
          />
        );
      })}

      <div style={{ position: "absolute", left: 104, top: 72, opacity: stagger(frame, 0, 38) }}>
        <Kicker color={COLORS.parchment}>Signal Mission / 数字基础设施</Kicker>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 64,
            fontWeight: 850,
            color: COLORS.text,
            marginTop: 14,
            lineHeight: 1.03,
            letterSpacing: 0,
            textShadow: "0 12px 34px rgba(0,0,0,0.58)",
          }}
        >
          The nation lights up like Earth from orbit
        </div>
      </div>

      <svg
        viewBox="0 0 1000 700"
        style={{ position: "absolute", left: 122, top: 190, width: 1160, height: 720, overflow: "visible" }}
      >
        <defs>
          <filter id="mapGlowB" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="routeGradientB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.red} />
            <stop offset="45%" stopColor={COLORS.gold} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
        </defs>

        {mapDots.map((dot, i) => {
          const progress = stagger(frame, dot.delay, 50);
          return (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={2.2}
              fill={i % 9 === 0 ? COLORS.gold : COLORS.cyan}
              opacity={progress * 0.38}
              filter="url(#mapGlowB)"
            />
          );
        })}

        {[
          [0, 1], [1, 6], [6, 2], [2, 5], [5, 4], [4, 9], [9, 0], [2, 3], [3, 17],
        ].map(([fromIdx, toIdx], i) => {
          const from = CITY_POINTS[fromIdx];
          const to = CITY_POINTS[toIdx];
          const progress = stagger(frame, 88 + i * 12, 74);
          if (!from || !to || progress <= 0) return null;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={from.x + (to.x - from.x) * progress}
              y2={from.y + (to.y - from.y) * progress}
              stroke="url(#routeGradientB)"
              strokeWidth={i < 3 ? 2.4 : 1.4}
              opacity={0.28 + progress * 0.28}
            />
          );
        })}

        {CITY_POINTS.map((city) => {
          const progress = cityProgress(city, frame);
          if (progress <= 0) return null;
          const tier1 = city.tier === 1;
          const pulse = 1 + Math.sin(frame / 12 + city.x) * 0.12;
          return (
            <g key={city.name} opacity={progress}>
              {[0, 1].map((ring) => {
                const ringProgress = (((frame + ring * 34 + city.x) % 96) / 96) * progress;
                return (
                  <circle
                    key={ring}
                    cx={city.x}
                    cy={city.y}
                    r={(18 + ringProgress * 46) * (tier1 ? 1.16 : 0.88)}
                    fill="none"
                    stroke={tier1 ? COLORS.gold : COLORS.cyan}
                    strokeWidth="1.2"
                    opacity={(1 - ringProgress) * 0.22}
                  />
                );
              })}
              <circle
                cx={city.x}
                cy={city.y}
                r={(tier1 ? 8 : 5.5) * pulse}
                fill={tier1 ? COLORS.gold : COLORS.cyan}
                filter="url(#mapGlowB)"
              />
              <circle cx={city.x} cy={city.y} r={2.2} fill="#FFFFFF" />
              {tier1 && (
                <text
                  x={city.x + 16}
                  y={city.y - 16}
                  fill={COLORS.text}
                  fontFamily="Inter, sans-serif"
                  fontSize="15"
                  fontWeight="700"
                  opacity={0.92}
                >
                  {city.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", right: 112, top: 170, width: 410, display: "grid", gap: 18 }}>
        <div
          style={{
            padding: "28px 28px 30px",
            borderLeft: `3px solid ${COLORS.cyan}`,
            background: "linear-gradient(90deg, rgba(7,10,18,0.78), rgba(7,10,18,0.16))",
            opacity: numberProgress,
          }}
        >
          <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.muted, fontSize: 14, marginBottom: 10 }}>
            Total 5G base stations
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.cyan, fontSize: 110, fontWeight: 850, lineHeight: 0.92 }}>
            {displayNumber}
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.text, fontSize: 32, fontWeight: 700 }}>
            million+
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <MetricPill label="World share" value={`${globalShare}%`} sub="global signal" color={COLORS.gold} progress={stagger(frame, 205, 48)} />
          <MetricPill label="Coverage" value="All" sub="cities & counties" color={COLORS.cyan} progress={stagger(frame, 222, 48)} />
        </div>

        <div
          style={{
            marginTop: 10,
            opacity: stagger(frame, 246, 52),
            fontFamily: "Inter, sans-serif",
            color: COLORS.muted,
            fontSize: 20,
            lineHeight: 1.45,
          }}
        >
          The pattern begins in megacities, then spreads inland until connection looks less like a rollout and more like a new public utility.
        </div>
      </div>

      <BilingualSubtitle
        english="From orbit, civilization is visible as light. On the ground, it is visible as signal."
        chinese="从轨道上看，文明是灯光；回到地面，文明就是信号。"
        frame={frame}
        startFrame={26}
        endFrame={totalFrames}
      />
      <MissionReadout frame={frame} label="Signal grid" value="3.9 million+ base stations" />
    </div>
  );
}

/* ─── SPACE SCENE ─── */
function SpaceScene({
  frame,
  totalFrames,
  backgroundImage,
}: {
  frame: number;
  totalFrames: number;
  backgroundImage: string;
}) {
  const reveal = stagger(frame, 0, 48);
  const orbitDots = seededDots(62, 1920, 1080, 31);
  const launchProgress = stagger(frame, 78, 150);
  const rocketX = 1010 + Math.sin(launchProgress * Math.PI) * 90;
  const rocketY = 860 - launchProgress * 720;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <CinematicBackdrop image={backgroundImage} frame={frame} focus="center 58%" tint="rgba(7,10,18,0.68)" />
      <EarthHorizon frame={frame} opacity={0.44} color={COLORS.parchment} />
      <ScanlineLayer frame={frame} opacity={0.16} />
      <FilmGrain frame={frame} opacity={0.18} />

      {orbitDots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: i % 8 === 0 ? COLORS.gold : "#FFFFFF",
            opacity: 0.18 + Math.sin((frame + dot.phase) / 18) * 0.12,
            boxShadow: "0 0 14px rgba(255,255,255,0.5)",
          }}
        />
      ))}

      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="spaceArc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.red} stopOpacity="0" />
            <stop offset="38%" stopColor={COLORS.parchment} stopOpacity="0.86" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0.18" />
          </linearGradient>
          <filter id="spaceGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0, 1, 2, 3].map((i) => {
          const dash = 1500 - stagger(frame, 34 + i * 18, 90) * 1500;
          return (
            <ellipse
              key={i}
              cx="960"
              cy="730"
              rx={430 + i * 112}
              ry={92 + i * 24}
              fill="none"
              stroke="url(#spaceArc)"
              strokeWidth={i === 0 ? 3 : 1.4}
              strokeDasharray="1500"
              strokeDashoffset={dash}
              opacity={0.42 - i * 0.06}
              transform={`rotate(${-15 + i * 7} 960 730)`}
            />
          );
        })}
        <circle cx="960" cy="1160" r="520" fill="rgba(47,124,255,0.10)" stroke="rgba(57,217,255,0.24)" strokeWidth="2" />
        <path
          d={`M ${rocketX} ${rocketY + 68} C ${rocketX - 35} ${rocketY + 150}, ${rocketX - 90} ${rocketY + 230}, ${rocketX - 155} ${rocketY + 310}`}
          stroke={COLORS.gold}
          strokeWidth="4"
          fill="none"
          opacity={launchProgress * 0.55}
          filter="url(#spaceGlow)"
        />
      </svg>

      {launchProgress > 0 && (
        <div
          style={{
            position: "absolute",
            left: rocketX,
            top: rocketY,
            width: 44,
            height: 118,
            transform: `rotate(${10 - launchProgress * 22}deg)`,
            opacity: launchProgress,
          }}
        >
          <div
            style={{
              width: 34,
              height: 82,
              margin: "0 auto",
              background: "linear-gradient(180deg, #FFFFFF, #B8C3D8)",
              clipPath: "polygon(50% 0, 86% 28%, 72% 100%, 28% 100%, 14% 28%)",
              boxShadow: "0 0 28px rgba(255,255,255,0.35)",
            }}
          />
          <div
            style={{
              width: 28,
              height: 54 + Math.sin(frame / 4) * 10,
              margin: "0 auto",
              background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.red}, transparent)`,
              filter: "blur(3px)",
            }}
          />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 122,
          top: 92,
          width: 730,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 24}px)`,
        }}
      >
        <Kicker color={COLORS.parchment}>Orbital Mission / Launch Era</Kicker>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 68,
            fontWeight: 850,
            color: COLORS.text,
            lineHeight: 1.02,
            marginTop: 16,
            letterSpacing: 0,
            textShadow: "0 12px 36px rgba(0,0,0,0.60)",
          }}
        >
          The moment the map reaches orbit
        </div>
      </div>

      <div style={{ position: "absolute", right: 112, top: 154, display: "grid", gap: 18 }}>
        <MetricPill label="Rocket launches" value="600+" sub="since 1970" color={COLORS.gold} progress={stagger(frame, 70, 42)} />
        <MetricPill label="Satellites" value="50+" sub="in orbit" color={COLORS.cyan} progress={stagger(frame, 92, 42)} />
        <MetricPill label="Global rank" value="#2" sub="space capability" color={COLORS.red} progress={stagger(frame, 114, 42)} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          bottom: 210,
          width: 760,
          opacity: stagger(frame, 190, 54),
          fontFamily: "Inter, sans-serif",
          color: COLORS.muted,
          fontSize: 22,
          lineHeight: 1.45,
        }}
      >
        Every great infrastructure story eventually looks upward. Rockets leave the atmosphere; the services return to Earth.
      </div>

      <BilingualSubtitle
        english="This is the historical scale: steel on the ground, signals in the air, and machines in orbit."
        chinese="这就是历史尺度：地面有钢铁，空中有信号，轨道上有机器。"
        frame={frame}
        startFrame={28}
        endFrame={totalFrames}
      />
      <MissionReadout frame={frame} label="Lunar archive echo" value="600+ launches / orbital era" />
    </div>
  );
}

/* ─── GREEN ENERGY SCENE ─── */
function EnergyTile({
  title,
  value,
  caption,
  color,
  progress,
  index,
}: {
  title: string;
  value: string;
  caption: string;
  color: string;
  progress: number;
  index: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: 286,
        height: 168,
        padding: "22px 24px",
        borderTop: `2px solid ${color}`,
        background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025))",
        boxShadow: `0 22px 55px rgba(0,0,0,0.36), 0 0 24px ${color}22`,
        opacity: progress,
        transform: `translateY(${(1 - progress) * (24 + index * 8)}px)`,
      }}
    >
      <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.muted, fontSize: 14 }}>{title}</div>
      <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.text, fontSize: 46, fontWeight: 850, marginTop: 14, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", color, fontSize: 15, marginTop: 12 }}>{caption}</div>
    </div>
  );
}

function GreenEnergyScene({
  frame,
  totalFrames,
  backgroundImage,
  solarImage,
}: {
  frame: number;
  totalFrames: number;
  backgroundImage: string;
  solarImage: string;
}) {
  const reveal = stagger(frame, 0, 48);
  const sun = 0.5 + Math.sin(frame / 45) * 0.5;
  const gridProgress = stagger(frame, 118, 92);
  const renewableShare = Math.round(35 * gridProgress);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <CinematicBackdrop image={backgroundImage} frame={frame} focus="center" tint="rgba(7,10,18,0.46)" />
      <EarthHorizon frame={frame} opacity={0.18} color={COLORS.green} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${solarImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          opacity: 0.22,
          mixBlendMode: "screen",
          filter: "saturate(1.1) contrast(1.1)",
        }}
      />
      <ScanlineLayer frame={frame} opacity={0.12} />
      <FilmGrain frame={frame} opacity={0.12} />

      <div
        style={{
          position: "absolute",
          right: 260,
          top: 80,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(246,198,91,${0.22 + sun * 0.08}), rgba(246,198,91,0.06) 45%, transparent 70%)`,
          filter: "blur(1px)",
        }}
      />

      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="energyLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.green} stopOpacity="0" />
            <stop offset="45%" stopColor={COLORS.gold} stopOpacity="0.85" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0.42" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((i) => {
          const p = stagger(frame, 52 + i * 18, 100);
          return (
            <path
              key={i}
              d={`M ${180 + i * 90} ${860 - i * 42} C ${520 + i * 30} ${610 - i * 34}, ${830 + i * 42} ${720 - i * 18}, ${1410 + i * 20} ${360 + i * 34}`}
              fill="none"
              stroke="url(#energyLine)"
              strokeWidth={2.2 - i * 0.18}
              strokeDasharray="1600"
              strokeDashoffset={1600 * (1 - p)}
              opacity={0.42}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 118,
          top: 82,
          width: 820,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 24}px)`,
        }}
      >
        <Kicker color={COLORS.parchment}>Future Terrain / Clean Power</Kicker>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 68,
            fontWeight: 850,
            color: COLORS.text,
            lineHeight: 1.03,
            marginTop: 16,
            letterSpacing: 0,
            textShadow: "0 12px 36px rgba(0,0,0,0.55)",
          }}
        >
          A new landscape for the next century
        </div>
      </div>

      <div style={{ position: "absolute", left: 122, top: 352, display: "flex", gap: 20 }}>
        <EnergyTile title="Solar PV capacity" value="609 GW" caption="utility-scale buildout" color={COLORS.gold} progress={stagger(frame, 44, 44)} index={0} />
        <EnergyTile title="Wind power capacity" value="441 GW" caption="onshore and offshore" color={COLORS.green} progress={stagger(frame, 64, 44)} index={1} />
        <EnergyTile title="New energy vehicles" value="9.5M" caption="2023 production" color={COLORS.cyan} progress={stagger(frame, 84, 44)} index={2} />
      </div>

      <div style={{ position: "absolute", left: 122, bottom: 220, width: 920, opacity: stagger(frame, 118, 56) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 16 }}>
          <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.muted, fontSize: 20 }}>Renewable generation share</div>
          <div style={{ fontFamily: "Inter, sans-serif", color: COLORS.green, fontSize: 50, fontWeight: 850 }}>{renewableShare}%+</div>
        </div>
        <div style={{ height: 18, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${renewableShare}%`,
              minWidth: 8,
              background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.gold}, ${COLORS.cyan})`,
              boxShadow: `0 0 24px ${COLORS.green}88`,
            }}
          />
        </div>
      </div>

      <BilingualSubtitle
        english="The epic does not end at launch. It returns to Earth as power, mobility, and a changed horizon."
        chinese="史诗并不止于发射，它回到地球，成为能源、出行和被改变的地平线。"
        frame={frame}
        startFrame={28}
        endFrame={totalFrames}
      />
      <MissionReadout frame={frame} label="Century system" value="609 GW solar / 441 GW wind" />
    </div>
  );
}

/* ─── TRANSITION EFFECT ─── */
function TransitionEffect({ frame, type = "fadeIn" }: { frame: number; type?: "fadeIn" | "fadeOut" }) {
  const progress = easeInOutCubic(Math.min(1, frame / 34));
  const opacity = type === "fadeIn" ? 1 - progress : progress;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(90deg, ${COLORS.ink}, rgba(7,10,18,0.82), ${COLORS.ink})`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── SCENE BOUNDARIES (60s = 1800 frames @ 30fps) ─── */
const SCENES = {
  title:    { start: 0,    end: 240 },
  barChart: { start: 240,  end: 440 },
  map:      { start: 440,  end: 840 },
  space:    { start: 840,  end: 1290 },
  energy:   { start: 1290, end: 1800 },
};

/* ─── MAIN COMPONENT ─── */
export const PartB_Tech: React.FC = () => {
  const frame = useCurrentFrame();

  const trainBgUrl = staticFile("04_movement/cr400af_beijingnan.jpg");
  const networkBgUrl = staticFile("03_digital_life/5g_base_stations_expo.jpg");
  const cityNightUrl = staticFile("07_closing/shanghai_night_skyline.jpg");
  const windBgUrl = staticFile("06_green_innovation/wind_farm_gansu.jpg");
  const solarBgUrl = staticFile("06_green_innovation/qingdao_solar_panels_aerial.jpg");

  let currentScene: string;
  let sceneFrame: number;

  if (frame < SCENES.title.end) {
    currentScene = "title";
    sceneFrame = frame;
  } else if (frame < SCENES.barChart.end) {
    currentScene = "barChart";
    sceneFrame = frame - SCENES.barChart.start;
  } else if (frame < SCENES.map.end) {
    currentScene = "map";
    sceneFrame = frame - SCENES.map.start;
  } else if (frame < SCENES.space.end) {
    currentScene = "space";
    sceneFrame = frame - SCENES.space.start;
  } else {
    currentScene = "energy";
    sceneFrame = frame - SCENES.energy.start;
  }

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, backgroundColor: COLORS.ink, overflow: "hidden" }}>
      {currentScene === "title" && (
        <>
          <TitleTransition
            frame={sceneFrame}
            title="Tech & Infrastructure"
            subtitle="科技与超级工程"
            totalFrames={SCENES.title.end - SCENES.title.start}
          />
          <TransitionEffect frame={sceneFrame} type="fadeIn" />
        </>
      )}

      {currentScene === "barChart" && (
        <BarChartScene
          frame={sceneFrame}
          data={HIGH_SPEED_RAIL_DATA}
          backgroundImage={trainBgUrl}
          totalFrames={SCENES.barChart.end - SCENES.barChart.start}
        />
      )}

      {currentScene === "map" && (
        <MapHeatmapScene
          frame={sceneFrame}
          backgroundImage={networkBgUrl}
          totalFrames={SCENES.map.end - SCENES.map.start}
        />
      )}

      {currentScene === "space" && (
        <SpaceScene
          frame={sceneFrame}
          totalFrames={SCENES.space.end - SCENES.space.start}
          backgroundImage={cityNightUrl}
        />
      )}

      {currentScene === "energy" && (
        <GreenEnergyScene
          frame={sceneFrame}
          totalFrames={SCENES.energy.end - SCENES.energy.start}
          backgroundImage={windBgUrl}
          solarImage={solarBgUrl}
        />
      )}
    </div>
  );
};
