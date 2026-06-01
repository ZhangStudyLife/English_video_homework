import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import {
  CinematicBackdrop,
  CinematicTexture,
  MissionReadout,
} from "../components/Cinematic";
import { COLORS } from "../constants";

const BilingualSubtitle: React.FC<{ english: string; chinese: string }> = () => null;
const LocalSubtitle = BilingualSubtitle;

// ════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════
const GDP_DATA = [
  { year: 2013, value: 59.3 },
  { year: 2014, value: 64.4 },
  { year: 2015, value: 68.9 },
  { year: 2016, value: 74.4 },
  { year: 2017, value: 83.2 },
  { year: 2018, value: 91.9 },
  { year: 2019, value: 98.7 },
  { year: 2020, value: 101.6 },
  { year: 2021, value: 114.9 },
  { year: 2022, value: 121.0 },
  { year: 2023, value: 126.1 },
];

const RANKING_DATA = [
  { country: "USA", gdp2013: 16.8, gdp2023: 27.4 },
  { country: "China", gdp2013: 9.6, gdp2023: 17.8 },
  { country: "Japan", gdp2013: 5.2, gdp2023: 4.2 },
  { country: "Germany", gdp2013: 3.7, gdp2023: 4.5 },
  { country: "India", gdp2013: 1.9, gdp2023: 3.7 },
];

const TRADE_DATA = [
  { country: "China", value: 5.94, color: COLORS.primary },
  { country: "USA", value: 3.17, color: "rgba(100,149,237,0.8)" },
  { country: "Germany", value: 1.73, color: "rgba(255,255,255,0.35)" },
  { country: "Japan", value: 0.75, color: "rgba(255,255,255,0.35)" },
  { country: "India", value: 0.47, color: "rgba(255,255,255,0.35)" },
];

// ════════════════════════════════════════════
// SHARED COMPONENTS & HELPERS
// ════════════════════════════════════════════
const fmt = (v: number) =>
  v >= 1000 ? Math.round(v).toLocaleString() : v.toFixed(1);

const AnimatedNumber: React.FC<{
  frame: number; start: number; end: number;
  startFrame: number; endFrame: number;
  prefix?: string; suffix?: string;
  fontSize?: number; color?: string; fontWeight?: number;
}> = ({ frame, start, end, startFrame, endFrame, prefix = "", suffix = "", fontSize = 72, color = COLORS.primary, fontWeight = 900 }) => {
  const p = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const v = start + p * (end - start);
  return (
    <div style={{ fontFamily: "Inter, sans-serif", fontSize, fontWeight, color, lineHeight: 1 }}>
      {prefix}{fmt(v)}{suffix}
    </div>
  );
};

const SectionTitle: React.FC<{ title: string; cn?: string; color?: string }> = ({ title, cn, color = COLORS.titleText }) => (
  <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: 48, fontWeight: 700, color, margin: 0, letterSpacing: 3 }}>{title}</h2>
    {cn && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 22, color: COLORS.bodyText, marginTop: 6, letterSpacing: 6 }}>{cn}</span>}
  </div>
);

const CodeRain: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<number[]>([]);
  const speedsRef = useRef<number[]>([]);
  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=%中国经济发展数据";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 1920, H = 1080, fontSize = 16;
    canvas.width = W; canvas.height = H;
    const cols = Math.floor(W / fontSize);
    if (dropsRef.current.length === 0) {
      for (let i = 0; i < cols; i++) { dropsRef.current[i] = Math.random() * -100; speedsRef.current[i] = 0.3 + Math.random() * 0.7; }
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, W, H);
    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < cols; i++) {
      const ci = Math.floor(((i * 7 + frame * 3 + Math.floor(dropsRef.current[i]) * 13) & 0x7fffffff) % CHARS.length);
      const char = CHARS[ci];
      const x = i * fontSize, y = dropsRef.current[i] * fontSize;
      const isChinese = /[一-鿿]/.test(char);
      if (isChinese) { ctx.fillStyle = COLORS.primary; ctx.globalAlpha = 0.9; }
      else {
        const intensity = Math.floor(((i * 31 + frame * 7) & 0x7fffffff) % 100);
        if (intensity < 5) { ctx.fillStyle = COLORS.primary; ctx.globalAlpha = 0.95; }
        else if (intensity < 15) { ctx.fillStyle = COLORS.gold; ctx.globalAlpha = 0.8; }
        else { ctx.fillStyle = COLORS.techBlue; ctx.globalAlpha = 0.2 + (intensity / 100) * 0.6; }
      }
      ctx.fillText(char, x, y);
      ctx.globalAlpha = 1.0;
      dropsRef.current[i] += speedsRef.current[i];
      if (dropsRef.current[i] * fontSize > H && Math.random() > 0.98) { dropsRef.current[i] = 0; speedsRef.current[i] = 0.3 + Math.random() * 0.7; }
    }
  }, [frame]);

  return <canvas ref={canvasRef} width={1920} height={1080} style={{ position: "absolute", top: 0, left: 0, opacity }} />;
};

// ════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════
export const PartA_Economy: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <CinematicBackdrop
        image="assets/economy-01-shanghai-yangshan-port.jpg"
        focus="center 58%"
        tint="rgba(7,10,18,0.42)"
        brightness={0.82}
        saturate={1.12}
        contrast={1.12}
      />
      <EconomicLightField />
      <Sequence from={0} durationInFrames={180}><OpeningScene /></Sequence>
      <Sequence from={180} durationInFrames={200}><GDPChartScene /></Sequence>
      <Sequence from={380} durationInFrames={120}><GDPCapitaScene /></Sequence>
      <Sequence from={500} durationInFrames={140}><GlobalCompareScene /></Sequence>
      <Sequence from={640} durationInFrames={110}><TradeScene /></Sequence>
      <Sequence from={750} durationInFrames={100}><HighSpeedRailScene /></Sequence>
      <Sequence from={850} durationInFrames={110}><FiveGScene /></Sequence>
      <Sequence from={960} durationInFrames={140}><DigitalEconomyScene /></Sequence>
      <Sequence from={1100} durationInFrames={110}><UrbanizationScene /></Sequence>
      <Sequence from={1210} durationInFrames={100}><PatentsScene /></Sequence>
      <Sequence from={1310} durationInFrames={100}><RDScene /></Sequence>
      <Sequence from={1410} durationInFrames={120}><PovertyScene /></Sequence>
      <Sequence from={1530} durationInFrames={120}><IndicatorsScene /></Sequence>
      <Sequence from={1650} durationInFrames={250}><GlobalRankingScene /></Sequence>
      <Sequence from={1900} durationInFrames={200}><SummaryScene /></Sequence>
      <CinematicTexture opacity={0.12} />
      <MissionReadout label="Economic archive" value="Scale, trade, mobility" y={850} />
    </AbsoluteFill>
  );
};

const SceneShade: React.FC<{ opacity?: number }> = ({ opacity = 0.56 }) => (
  <AbsoluteFill style={{ background: `rgba(7,10,18,${opacity})` }} />
);

const EconomicLightField: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 78% 28%, rgba(246,198,91,0.20), transparent 30%),
            radial-gradient(circle at 18% 78%, rgba(228,61,48,0.18), transparent 34%),
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 18%, rgba(0,0,0,0.22))
          `,
        }}
      />
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: 0.28 }}>
        <defs>
          <linearGradient id="econLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.primary} stopOpacity="0" />
            <stop offset="45%" stopColor={COLORS.gold} stopOpacity="0.76" />
            <stop offset="100%" stopColor={COLORS.techBlue} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${120 + i * 70} ${820 - i * 38} C ${500 + i * 40} ${620 - i * 32}, ${840 + i * 48} ${720 - i * 14}, ${1540 + i * 10} ${330 + i * 40}`}
            fill="none"
            stroke="url(#econLine)"
            strokeWidth={2.4 - i * 0.25}
            strokeDasharray="1500"
            strokeDashoffset={(1500 - frame * 7 - i * 140) % 1500}
            opacity={0.36 - i * 0.05}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 1: Opening (0-180 / 0-6s)
// ════════════════════════════════════════════
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const rainOp = interpolate(frame, [0, 15, 150, 180], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleText = "China Through Data";
  const chars = Math.min(titleText.length, Math.max(0, Math.floor((frame - 8) / 4)));
  const tOp = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" });
  const glow = interpolate(frame, [8, 130], [0, 15], { extrapolateRight: "clamp" });
  const cnOp = interpolate(frame, [60, 75, 145, 160], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sceneOp = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: sceneOp }}>
      <CodeRain frame={frame} opacity={rainOp} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to top, rgba(11,15,25,1) 0%, rgba(11,15,25,0.3) 40%, transparent 70%)", zIndex: 1 }} />
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2, opacity: tOp }}>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: 80, fontWeight: 800, color: COLORS.titleText, letterSpacing: 6, textShadow: `0 0 ${glow}px ${COLORS.primary}, 0 4px 20px rgba(0,0,0,0.8)`, margin: 0 }}>
          {titleText.slice(0, chars)}
          {chars < titleText.length && <span style={{ display: "inline-block", width: 3, height: 68, backgroundColor: COLORS.primary, marginLeft: 4, opacity: frame % 16 < 8 ? 1 : 0 }} />}
        </h1>
      </div>
      <div style={{ position: "absolute", top: 310, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2, opacity: cnOp }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 36, color: COLORS.bodyText, letterSpacing: 8 }}>数说中国</span>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 2: GDP Line Chart (180-380 / 6-12.7s)
// ════════════════════════════════════════════
const GDPChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [170, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const CL = 100, CR = 1050, CT = 150, CB = 800;
  const Y_MIN = 50, Y_MAX = 130;
  const xs = (i: number) => CL + (i / (GDP_DATA.length - 1)) * (CR - CL);
  const ys = (v: number) => CB - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (CB - CT);
  const pathD = "M " + GDP_DATA.map((d, i) => `${xs(i)},${ys(d.value)}`).join(" L ");
  // Cumulative segment lengths for path-length-based interpolation
  const segLens: number[] = [0];
  for (let i = 1; i < GDP_DATA.length; i++) {
    const dx = xs(i) - xs(i - 1), dy = ys(GDP_DATA[i].value) - ys(GDP_DATA[i - 1].value);
    segLens.push(segLens[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  const totalPathLen = segLens[segLens.length - 1];
  const pathLen = totalPathLen; // same length for line and fill
  const lp = interpolate(frame, [20, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Area fill: find exact position along the path using cumulative lengths
  const areaD = lp <= 0 ? "" : (() => {
    const distTraveled = lp * totalPathLen;
    let seg = 0;
    for (let i = 1; i < segLens.length; i++) { if (segLens[i] >= distTraveled) { seg = i - 1; break; } seg = i - 1; }
    const segLen = segLens[seg + 1] - segLens[seg];
    const frac = segLen > 0 ? Math.min((distTraveled - segLens[seg]) / segLen, 1) : 0;
    const xMid = xs(seg) + frac * (xs(seg + 1) - xs(seg));
    const yMid = ys(GDP_DATA[seg].value) + frac * (ys(GDP_DATA[seg + 1].value) - ys(GDP_DATA[seg].value));
    const pts = GDP_DATA.slice(0, seg + 1).map((_, i) => `L ${xs(i)},${ys(GDP_DATA[i].value)}`).join(" ");
    return `M ${xs(0)},${CB} ${pts} L ${xMid},${yMid} L ${xMid},${CB} Z`;
  })();
  const cp = interpolate(frame, [20, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const curVal = 59.3 + cp * (126.1 - 59.3);
  const cOp = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cSc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subOp = interpolate(frame, [30, 50, 130, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <SectionTitle title="ECONOMIC VITALITY" cn="经济活力" color={COLORS.primary} />
      <div style={{ position: "absolute", left: 40, top: 110, width: 1010, height: 860 }}>
        <svg viewBox="0 0 1010 860" width="1010" height="860">
          <defs>
            <filter id="lg" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <linearGradient id="ag" x1="0" y1={CT} x2="0" y2={CB} gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor={COLORS.primary} stopOpacity="0.35" /><stop offset="100%" stopColor={COLORS.primary} stopOpacity="0.02" /></linearGradient>
          </defs>
          {[50, 70, 90, 110, 130].map(v => <g key={v}><line x1={CL} y1={ys(v)} x2={CR} y2={ys(v)} stroke="rgba(255,255,255,0.06)" /><text x={CL - 10} y={ys(v) + 5} fill={COLORS.bodyText} fontSize={13} fontFamily="Inter, sans-serif" textAnchor="end">{v}</text></g>)}
          <line x1={CL} y1={CT} x2={CL} y2={CB} stroke="rgba(255,255,255,0.15)" />
          <line x1={CL} y1={CB} x2={CR} y2={CB} stroke="rgba(255,255,255,0.15)" />
          <text x={CL} y={CT - 12} fill={COLORS.bodyText} fontSize={12} fontFamily="Inter, sans-serif">(Trillion CNY)</text>
          {areaD && <path d={areaD} fill="url(#ag)" />}
          <path d={pathD} fill="none" stroke={COLORS.primary} strokeWidth={4} strokeLinecap="round" filter="url(#lg)" strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - lp)} />
          {GDP_DATA.map((d, i) => { const op = interpolate(frame, [20 + i * 11, 30 + i * 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return <text key={d.year} x={xs(i)} y={CB + 25} fill={COLORS.bodyText} fontSize={13} fontFamily="Inter, sans-serif" textAnchor="middle" opacity={op}>{d.year}</text>; })}
        </svg>
      </div>
      <div style={{ position: "absolute", right: 80, top: 260, width: 400, textAlign: "center", opacity: cOp, transform: `scale(${cSc})` }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 24, color: COLORS.bodyText, marginBottom: 8, letterSpacing: 2 }}>CHINA GDP</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 100, fontWeight: 900, color: COLORS.primary, lineHeight: 1, textShadow: `0 0 30px rgba(230,0,0,0.5)` }}>{curVal.toFixed(1)}</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 24, color: COLORS.gold, marginTop: 8, fontWeight: 600 }}>Trillion CNY</div>
        <div style={{ marginTop: 24, padding: "8px 20px", border: "1px solid rgba(230,0,0,0.4)", borderRadius: 8, display: "inline-block" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: COLORS.ecoGreen, fontWeight: 600 }}>+112.6%</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: COLORS.bodyText, marginLeft: 8 }}>2013→2023</span>
        </div>
      </div>
      <div style={{ opacity: subOp }}><LocalSubtitle english="Over the past decade, China's GDP has more than doubled." chinese="过去十年，中国GDP实现翻番增长。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 3: GDP Per Capita (380-500 / 12.7-16.7s)
// ════════════════════════════════════════════
const GDPCapitaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subOp = interpolate(frame, [20, 40, 80, 100], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <SectionTitle title="GDP PER CAPITA" cn="人均国内生产总值" color={COLORS.gold} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: `scale(${sc})` }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 26, color: COLORS.bodyText, marginBottom: 16, letterSpacing: 4 }}>GROWTH OVER 10 YEARS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>2013</div>
            <AnimatedNumber frame={frame} start={30000} end={30000} startFrame={0} endFrame={1} prefix="RMB " fontSize={64} color={COLORS.bodyText} />
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 48, color: COLORS.primary, fontWeight: 300 }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>2023</div>
            <AnimatedNumber frame={frame} start={30000} end={89000} startFrame={10} endFrame={90} prefix="RMB " fontSize={80} color={COLORS.gold} />
          </div>
        </div>
        <div style={{ marginTop: 30, padding: "10px 30px", backgroundColor: "rgba(0,230,118,0.12)", borderRadius: 10 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 28, fontWeight: 700, color: COLORS.ecoGreen }}>+197%</span>
        </div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="Per capita income nearly tripled in a single decade." chinese="人均收入在十年间增长近两倍。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 4: Global GDP Compare (500-640 / 16.7-21.3s)
// ════════════════════════════════════════════
const GlobalCompareScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [120, 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maxGdp = 30;
  const barW = 500;
  const subOp = interpolate(frame, [30, 50, 100, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.6} />
      <SectionTitle title="CHINA vs THE WORLD" cn="中国与世界" />
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20 }}>
        {RANKING_DATA.sort((a, b) => b.gdp2023 - a.gdp2023).map((d, i) => {
          const barStart = 20 + i * 15;
          const bp = interpolate(frame, [barStart, barStart + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const w = (d.gdp2023 / maxGdp) * barW * bp;
          const isCN = d.country === "China";
          return (
            <div key={d.country} style={{ display: "flex", alignItems: "center", gap: 20, width: 720 }}>
              <div style={{ width: 100, fontFamily: "Inter, sans-serif", fontSize: 22, color: isCN ? COLORS.primary : COLORS.bodyText, fontWeight: isCN ? 700 : 400, textAlign: "right" }}>{d.country}</div>
              <div style={{ width: w, height: 44, backgroundColor: isCN ? COLORS.primary : "rgba(255,255,255,0.2)", borderRadius: 6, boxShadow: isCN ? "0 0 20px rgba(230,0,0,0.4)" : "none" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: COLORS.bodyText, opacity: bp }}>${d.gdp2023}T</span>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China: the world's second-largest economy by GDP." chinese="按GDP计算，中国是世界第二大经济体。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 5: Global Trade (640-750 / 21.3-25s)
// ════════════════════════════════════════════
const TradeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const maxV = 7;
  const barW = 600;
  const subOp = interpolate(frame, [30, 50, 80, 100], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <SectionTitle title="GLOBAL TRADE LEADER" cn="全球贸易领先" color={COLORS.techBlue} />
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 22 }}>
        {TRADE_DATA.map((d, i) => {
          const barStart = 20 + i * 12;
          const bp = interpolate(frame, [barStart, barStart + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const w = (d.value / maxV) * barW * bp;
          const isCN = d.country === "China";
          return (
            <div key={d.country} style={{ display: "flex", alignItems: "center", gap: 20, width: 780 }}>
              <div style={{ width: 100, fontFamily: "Inter, sans-serif", fontSize: 22, color: isCN ? COLORS.primary : COLORS.bodyText, fontWeight: isCN ? 700 : 400, textAlign: "right" }}>{d.country}</div>
              <div style={{ width: w, height: 44, backgroundColor: d.color, borderRadius: 6, boxShadow: isCN ? "0 0 20px rgba(230,0,0,0.4)" : "none" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: COLORS.bodyText, opacity: bp }}>${d.value}T</span>
            </div>
          );
        })}
        <div style={{ marginTop: 20, padding: "10px 28px", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 10 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 22, color: COLORS.techBlue, fontWeight: 600 }}>World's Largest Exporter</span>
        </div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China is the world's largest trading nation." chinese="中国是全球最大的贸易国家。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 6: High-Speed Rail (750-850 / 25-28.3s)
// ════════════════════════════════════════════
const HighSpeedRailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [80, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const progressW = interpolate(frame, [15, 70], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [15, 30, 65, 80], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.6} />
      <SectionTitle title="HIGH-SPEED RAIL" cn="高速铁路" color={COLORS.techBlue} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: `scale(${sc})` }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22, color: COLORS.bodyText, marginBottom: 12, letterSpacing: 3 }}>TOTAL NETWORK LENGTH</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 120, fontWeight: 900, color: COLORS.techBlue, lineHeight: 1, textShadow: `0 0 40px rgba(0,229,255,0.4)` }}>45,000</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 36, color: COLORS.gold, marginTop: 8, fontWeight: 600, letterSpacing: 4 }}>KILOMETERS</div>
        <div style={{ width: 600, height: 10, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 5, marginTop: 30, overflow: "hidden" }}>
          <div style={{ width: `${progressW}%`, height: "100%", backgroundColor: COLORS.techBlue, borderRadius: 5, boxShadow: `0 0 15px ${COLORS.techBlue}` }} />
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: COLORS.bodyText, marginTop: 14 }}>Over 70% of the world's HSR network</div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China built 45,000 km of high-speed rail — over 70% of the world's total." chinese="中国建成约4.5万公里高铁，超过全球总量的70%。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 7: 5G (850-960 / 28.3-32s)
// ════════════════════════════════════════════
const FiveGScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subOp = interpolate(frame, [15, 30, 75, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cards = [
    { value: "3.38M+", label: "5G Base Stations", cn: "5G基站", color: COLORS.techBlue },
    { value: "800M+", label: "5G Subscribers", cn: "5G用户", color: COLORS.gold },
  ];

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <SectionTitle title="5G COVERAGE" cn="5G??" color={COLORS.techBlue} />
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 80, transform: `scale(${sc})` }}>
        {cards.map((c, i) => {
          const cardOp = interpolate(frame, [15 + i * 25, 30 + i * 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={c.label} style={{ width: 500, padding: "50px 40px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", opacity: cardOp }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 80, fontWeight: 900, color: c.color, lineHeight: 1, textShadow: `0 0 30px ${c.color}40` }}>{c.value}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 26, color: COLORS.titleText, marginTop: 16 }}>{c.label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{c.cn}</div>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China leads the world in 5G infrastructure." chinese="中国5G基础设施规模位居全球前列。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 8: Digital Economy (960-1100 / 32-36.7s)
// ════════════════════════════════════════════
const DigitalEconomyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [120, 140], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Donut chart for e-commerce penetration
  const R = 100, C = 126;
  const circ = 2 * Math.PI * R;
  const pctProg = interpolate(frame, [25, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const curPct = 10.6 + pctProg * (27.6 - 10.6);
  const dashLen = circ * (curPct / 100);

  // Online retail
  const retailProg = interpolate(frame, [30, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const curRetail = 1.85 + retailProg * (15.4 - 1.85);

  const subOp = interpolate(frame, [30, 50, 110, 130], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.6} />
      <SectionTitle title="DIGITAL ECONOMY" cn="数字经济" color={COLORS.gold} />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 100 }}>
        {/* Donut */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: COLORS.bodyText, marginBottom: 16, letterSpacing: 2 }}>E-COMMERCE PENETRATION</div>
          <svg width={252} height={252} viewBox="0 0 252 252">
            <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={20} />
            <circle cx={C} cy={C} r={R} fill="none" stroke={COLORS.gold} strokeWidth={20} strokeLinecap="round" strokeDasharray={`${dashLen} ${circ - dashLen}`} transform={`rotate(-90 ${C} ${C})`} style={{ filter: `drop-shadow(0 0 10px ${COLORS.gold}40)` }} />
          </svg>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 52, fontWeight: 900, color: COLORS.gold, marginTop: 16 }}>{curPct.toFixed(1)}%</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "rgba(255,255,255,0.4)" }}>of total retail (2023)</div>
        </div>
        {/* Online retail */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: COLORS.bodyText, marginBottom: 16, letterSpacing: 2 }}>ONLINE RETAIL SALES</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 100, fontWeight: 900, color: COLORS.primary, lineHeight: 1, textShadow: `0 0 30px rgba(230,0,0,0.4)` }}>¥{curRetail.toFixed(1)}T</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: COLORS.ecoGreen, marginTop: 14 }}>+730% growth</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>2013→2023</div>
        </div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="E-commerce and the digital economy have transformed consumption." chinese="电子商务和数字经济改变了消费方式。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 9: Urbanization (1100-1210 / 36.7-40.3s)
// ════════════════════════════════════════════
const UrbanizationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const progW = interpolate(frame, [15, 70], [53.7, 66.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [15, 30, 75, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <SectionTitle title="URBANIZATION" cn="城镇化率" color={COLORS.ecoGreen} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: `scale(${sc})` }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 130, fontWeight: 900, color: COLORS.ecoGreen, lineHeight: 1, textShadow: `0 0 40px rgba(0,230,118,0.4)` }}>{progW.toFixed(1)}%</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 26, color: COLORS.bodyText, marginTop: 12, letterSpacing: 4 }}>URBAN POPULATION RATIO</div>
        <div style={{ width: 700, height: 14, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 7, marginTop: 30, overflow: "hidden" }}>
          <div style={{ width: `${((progW - 50) / 20) * 100}%`, height: "100%", backgroundColor: COLORS.ecoGreen, borderRadius: 7, boxShadow: `0 0 15px ${COLORS.ecoGreen}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: 700, marginTop: 10 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "rgba(255,255,255,0.4)" }}>2013: 53.7%</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: COLORS.ecoGreen }}>2023: 66.2%</span>
        </div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="Urbanization rate rose from 53.7% to 66.2%." chinese="城镇化率从53.7%上升到66.2%。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 10: Patents (1210-1310 / 40.3-43.7s)
// ════════════════════════════════════════════
const PatentsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [80, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subOp = interpolate(frame, [15, 30, 65, 80], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.6} />
      <SectionTitle title="GLOBAL #1 IN PATENTS" cn="专利申请全球领先" color={COLORS.gold} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: `scale(${sc})` }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 24, color: COLORS.bodyText, marginBottom: 16, letterSpacing: 3 }}>PATENT APPLICATIONS FILED (2023)</div>
        <AnimatedNumber frame={frame} start={0} end={1640000} startFrame={10} endFrame={70} fontSize={120} color={COLORS.gold} />
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 28, color: COLORS.ecoGreen, marginTop: 20, fontWeight: 600 }}>#1 Worldwide for 4 consecutive years</div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China leads the world in patent applications." chinese="中国专利申请量位居世界前列。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 11: R&D Spending (1310-1410 / 43.7-47s)
// ════════════════════════════════════════════
const RDScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [80, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subOp = interpolate(frame, [15, 30, 65, 80], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <SectionTitle title="R&D INVESTMENT" cn="研发投入" color={COLORS.techBlue} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: `scale(${sc})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>2013</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 72, fontWeight: 900, color: COLORS.bodyText }}>¥1.18T</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>2.0% of GDP</div>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 48, color: COLORS.techBlue, fontWeight: 300 }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>2023</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 80, fontWeight: 900, color: COLORS.techBlue, textShadow: `0 0 25px rgba(0,229,255,0.4)` }}>¥3.33T</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: COLORS.techBlue, marginTop: 4 }}>2.6% of GDP</div>
          </div>
        </div>
        <div style={{ marginTop: 30, padding: "10px 28px", backgroundColor: "rgba(0,229,255,0.12)", borderRadius: 10 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 26, fontWeight: 700, color: COLORS.techBlue }}>+182% Increase</span>
        </div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="R&D spending nearly tripled, reaching 2.6% of GDP." chinese="研发投入增长近两倍，占GDP比重达2.6%。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 12: Poverty Reduction (1410-1530 / 47-51s)
// ════════════════════════════════════════════
const PovertyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const subOp = interpolate(frame, [20, 40, 80, 100], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.6} />
      <SectionTitle title="POVERTY ALLEVIATION" cn="脱贫攻坚" color={COLORS.ecoGreen} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", transform: `scale(${sc})` }}>
        <div style={{ display: "flex", gap: 80, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.3)" }}>98.99M</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>Rural poor in 2012</div>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 64, color: COLORS.primary }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 80, fontWeight: 900, color: COLORS.ecoGreen, textShadow: `0 0 30px rgba(0,230,118,0.4)` }}>ZERO</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22, color: COLORS.ecoGreen, marginTop: 8 }}>Absolute poverty (2020)</div>
          </div>
        </div>
        <div style={{ marginTop: 40, fontFamily: "Inter, sans-serif", fontSize: 24, color: COLORS.bodyText, textAlign: "center", maxWidth: 700, lineHeight: 1.5 }}>
          Nearly <span style={{ color: COLORS.primary, fontWeight: 700 }}>100 million</span> people lifted out of poverty
        </div>
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China eliminated absolute poverty ? nearly 100 million people lifted out." chinese="中国消除了绝对贫困，近1亿人实现脱贫。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 13: Key Indicators (1530-1650 / 51-55s)
// ════════════════════════════════════════════
const INDICATORS = [
  { label: "GDP Per Capita", cn: "Per person", start: 30000, end: 89000, prefix: "RMB ", suffix: "", change: "+197%", color: COLORS.gold },
  { label: "Total Trade", cn: "Goods trade", start: 25.8, end: 41.8, prefix: "RMB ", suffix: "T", change: "+62%", color: COLORS.techBlue },
  { label: "FDI Inflow", cn: "Foreign investment", start: 118, end: 163, prefix: "USD ", suffix: "B", change: "Top 2", color: COLORS.ecoGreen },
  { label: "Consumer Spending", cn: "Retail sales", start: 24, end: 47, prefix: "RMB ", suffix: "T", change: "+96%", color: COLORS.primary },
];

const IndicatorsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [20, 40, 85, 100], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <SectionTitle title="KEY INDICATORS" cn="关键经济指标" />
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, bottom: 150, display: "flex", flexWrap: "wrap", justifyContent: "center", alignContent: "center", gap: 24, padding: "0 80px" }}>
        {INDICATORS.map((ind, i) => {
          const cd = 15 + i * 20;
          const cOp = interpolate(frame, [cd, cd + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const cp = interpolate(frame, [cd + 10, cd + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const cv = ind.start + cp * (ind.end - ind.start);
          const bOp = interpolate(frame, [cd + 20, cd + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const dv = ind.end >= 1000 ? `${ind.prefix}${Math.round(cv).toLocaleString()}${ind.suffix}` : `${ind.prefix}${cv.toFixed(1)}${ind.suffix}`;
          return (
            <div key={ind.label} style={{ width: 720, height: 250, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", opacity: cOp, overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: ind.color }} />
              <div style={{ padding: "24px 36px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20, color: COLORS.bodyText }}>{ind.label}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{ind.cn}</div>
                  </div>
                  <div style={{ opacity: bOp, backgroundColor: "rgba(0,230,118,0.15)", borderRadius: 6, padding: "4px 12px" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.ecoGreen }}>{ind.change}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 64, fontWeight: 900, color: ind.color, marginTop: 12, lineHeight: 1 }}>{dv}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>2013→2023</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="Key indicators show broad-based, sustainable growth." chinese="关键指标显示，多领域保持持续增长。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 14: Global GDP Ranking (1650-1850 / 55-61.7s)
// ════════════════════════════════════════════
const GlobalRankingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [220, 250], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tOp = interpolate(frame, [8, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const BL = 180, BM = 650, ROW = 90, SY = 200;
  const gc = (c: string) => c === "China" ? COLORS.primary : "rgba(255,255,255,0.22)";
  const gg = (c: string) => c === "China" ? "0 0 20px rgba(230,0,0,0.4)" : "none";
  const subOp = interpolate(frame, [170, 190, 215, 235], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vsOp = interpolate(frame, [115, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <SceneShade opacity={0.54} />
      <div style={{ position: "absolute", top: 35, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: tOp }}>
        <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: 48, fontWeight: 700, color: COLORS.titleText, margin: 0, letterSpacing: 3 }}>GLOBAL GDP RANKING</h2>
      </div>
      {/* 2013 */}
      <div style={{ position: "absolute", left: 50, top: 120, width: 830 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 34, fontWeight: 700, color: COLORS.gold, textAlign: "center", marginBottom: 14 }}>2013</div>
        {RANKING_DATA.map((d, i) => {
          const bs = 30 + i * 15;
          const bp = interpolate(frame, [bs, bs + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const lop = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={d.country} style={{ display: "flex", alignItems: "center", height: ROW, marginBottom: 8 }}>
              <div style={{ width: 110, fontFamily: "Inter, sans-serif", fontSize: 19, color: d.country === "China" ? COLORS.primary : COLORS.bodyText, fontWeight: d.country === "China" ? 700 : 400, textAlign: "right", paddingRight: 14, opacity: lop }}>{d.country}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{ width: (d.gdp2013 / 30) * BM * bp, height: 46, backgroundColor: gc(d.country), borderRadius: 5, boxShadow: gg(d.country) }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: COLORS.bodyText, marginLeft: 10, opacity: bp }}>${d.gdp2013}T</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* VS */}
      <div style={{ position: "absolute", left: "50%", top: 350, transform: "translateX(-50%)", opacity: vsOp }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 44, fontWeight: 900, color: "rgba(255,255,255,0.15)", letterSpacing: 8 }}>VS</span>
      </div>
      {/* 2023 */}
      <div style={{ position: "absolute", right: 50, top: 120, width: 830 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 34, fontWeight: 700, color: COLORS.techBlue, textAlign: "center", marginBottom: 14 }}>2023</div>
        {RANKING_DATA.map((d, i) => {
          const bs = 140 + i * 10;
          const bp = interpolate(frame, [bs, bs + 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const lop = interpolate(frame, [130, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={d.country} style={{ display: "flex", alignItems: "center", height: ROW, marginBottom: 8 }}>
              <div style={{ width: 110, fontFamily: "Inter, sans-serif", fontSize: 19, color: d.country === "China" ? COLORS.primary : COLORS.bodyText, fontWeight: d.country === "China" ? 700 : 400, textAlign: "right", paddingRight: 14, opacity: lop }}>{d.country}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <div style={{ width: (d.gdp2023 / 30) * BM * bp, height: 46, backgroundColor: gc(d.country), borderRadius: 5, boxShadow: gg(d.country) }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 17, color: COLORS.bodyText, marginLeft: 10, opacity: bp }}>${d.gdp2023}T</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Badge */}
      {(() => {
        const bOp = interpolate(frame, [210, 225], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const bSc = spring({ frame: Math.max(0, frame - 210), fps, config: { damping: 10, stiffness: 120 } });
        return (
          <div style={{ position: "absolute", bottom: 180, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: bOp, transform: `scale(${bSc})` }}>
            <div style={{ backgroundColor: "rgba(230,0,0,0.15)", border: `2px solid ${COLORS.primary}`, borderRadius: 14, padding: "14px 40px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 32, fontWeight: 900, color: COLORS.primary, letterSpacing: 2 }}>WORLD #2 ECONOMY</span>
            </div>
          </div>
        );
      })()}
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China has risen to the world's second-largest economy." chinese="中国已经成长为世界第二大经济体。" /></div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 15: Summary (1850-2100 / 61.7-70s)
// ════════════════════════════════════════════
const SummaryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fi = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fo = interpolate(frame, [170, 200], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, 200], [1.0, 1.12], { extrapolateRight: "clamp" });

  const stats = [
    { text: "GDP MORE THAN DOUBLED", start: 25, fs: 68, color: COLORS.titleText },
    { text: "1.4 BILLION PEOPLE", start: 75, fs: 68, color: COLORS.titleText },
    { text: "THE WORLD'S #2 ECONOMY", start: 125, fs: 76, color: COLORS.primary },
  ];

  const subOp = interpolate(frame, [135, 155, 170, 190], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fi * fo }}>
      <img src={staticFile("01_opening_city/shanghai_skyline_day.jpg")} style={{ position: "absolute", top: 0, left: 0, width: 1920, height: 1080, objectFit: "cover", transform: `scale(${zoom})`, opacity: fi }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(11,15,25,0.45) 0%, rgba(11,15,25,0.65) 50%, rgba(11,15,25,0.88) 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 150, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 26 }}>
        {stats.map(s => {
          const op = interpolate(frame, [s.start, s.start + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const sc = interpolate(frame, [s.start, s.start + 25], [0.93, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={s.text} style={{ opacity: op, transform: `scale(${sc})`, textAlign: "center" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: s.fs, fontWeight: 800, color: s.color, letterSpacing: 4, textShadow: s.color === COLORS.primary ? `0 0 30px rgba(230,0,0,0.6), 0 4px 20px rgba(0,0,0,0.8)` : "0 4px 20px rgba(0,0,0,0.8)" }}>{s.text}</span>
            </div>
          );
        })}
      </div>
      <div style={{ opacity: subOp }}><BilingualSubtitle english="China Through Data ? A story of transformation." chinese="数说中国，一个关于变化的故事。" /></div>
    </AbsoluteFill>
  );
};


