import React from 'react';
import {
  AbsoluteFill,
  Img,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  ink: '#05070B',
  white: '#FFFFFF',
  soft: '#D9E0E3',
  muted: '#A9B2B8',
  green: '#00E676',
  moss: '#5EE07B',
  cyan: '#00E5FF',
  amber: '#FFD166',
  red: '#E60000',
};

const ASSET = {
  kubuqiSatellite: staticFile('assets/green/kubuqi_desert_restoration_esa.jpg'),
  kubuqiGround: staticFile('assets/green/kubuqi_desert_edge_wikimedia.jpg'),
  northForest: staticFile('assets/green/reforestation_china_north_forest_wikimedia.jpg'),
  solar: staticFile('assets/green/qingdao_solar_panels_aerial.jpg'),
  windDechang: staticFile('assets/green/dechang_wind_farm.jpg'),
  windGansu: staticFile('assets/green/wind_farm_gansu.jpg'),
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const fadeWindow = (frame: number, start: number, end: number, fadeFrames = 36) =>
  Math.min(fade(frame, start, start + fadeFrames), 1 - fade(frame, end - fadeFrames, end));

type SubtitleProps = {
  english: string;
  chinese: string;
  opacity?: number;
};

const BilingualSubtitle: React.FC<SubtitleProps> = ({
  english,
  chinese,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: COLORS.white,
        opacity,
        fontFamily: 'Inter, Arial, sans-serif',
        padding: '0 180px',
        background:
          'linear-gradient(180deg, rgba(5,7,11,0) 0%, rgba(5,7,11,0.78) 35%, rgba(5,7,11,0.97) 100%)',
        textShadow: '0 3px 18px rgba(0,0,0,0.95)',
      }}
    >
      <div style={{fontSize: 36, lineHeight: 1.12, fontWeight: 680}}>
        {english}
      </div>
      <div style={{marginTop: 10, fontSize: 26, lineHeight: 1.18, color: COLORS.soft}}>
        {chinese}
      </div>
    </div>
  );
};

type CinematicImageProps = {
  src: string;
  start: number;
  end: number;
  zoomFrom?: number;
  zoomTo?: number;
  xFrom?: number;
  xTo?: number;
  yFrom?: number;
  yTo?: number;
  blur?: number;
  brightness?: number;
  saturate?: number;
  label?: string;
  labelDetail?: string;
};

const CinematicImage: React.FC<CinematicImageProps> = ({
  src,
  start,
  end,
  zoomFrom = 1.12,
  zoomTo = 1.21,
  xFrom = 0,
  xTo = 0,
  yFrom = 0,
  yTo = 0,
  blur = 2.2,
  brightness = 0.62,
  saturate = 0.95,
  label,
  labelDetail,
}) => {
  const frame = useCurrentFrame();
  const t = clamp01((frame - start) / Math.max(1, end - start));
  const opacity = fadeWindow(frame, start, end, 42);
  const zoom = interpolate(t, [0, 1], [zoomFrom, zoomTo], {
    easing: Easing.inOut(Easing.ease),
  });
  const x = interpolate(t, [0, 1], [xFrom, xTo]);
  const y = interpolate(t, [0, 1], [yFrom, yTo]);

  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
          filter: `blur(${blur}px) brightness(${brightness}) saturate(${saturate}) contrast(1.08)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(5,7,11,0.92) 0%, rgba(5,7,11,0.48) 38%, rgba(5,7,11,0.78) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 55% 35%, rgba(255,255,255,0.10), transparent 22%), radial-gradient(circle at 30% 58%, rgba(0,230,118,0.17), transparent 30%)',
          mixBlendMode: 'screen',
        }}
      />
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: 84,
            top: 72,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: COLORS.soft,
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: 22,
            letterSpacing: 0,
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: 52,
              height: 2,
              background: COLORS.green,
              boxShadow: '0 0 18px rgba(0,230,118,0.8)',
            }}
          />
          <span>{label}</span>
          {labelDetail ? <span style={{color: COLORS.muted}}>{labelDetail}</span> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const FilmTexture: React.FC = () => {
  const frame = useCurrentFrame();
  const grain = Array.from({length: 85}, (_, i) => {
    const x = (i * 53 + frame * 7) % 100;
    const y = (i * 29 + frame * 3) % 100;
    const opacity = 0.035 + ((i * 17 + frame) % 19) / 1000;
    return (
      <span
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: 1 + (i % 3),
          height: 1 + (i % 2),
          background: 'rgba(255,255,255,0.7)',
          opacity,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {grain}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 170px rgba(0,0,0,0.92)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.28) 100%)',
          opacity: 0.65,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 78,
          background: 'rgba(0,0,0,0.88)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 78,
          background: 'rgba(0,0,0,0.88)',
        }}
      />
    </AbsoluteFill>
  );
};

const ChapterTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeWindow(frame, 0, 210, 50);
  const y = interpolate(opacity, [0, 1], [26, 0]);
  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.white,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div style={{width: 1220, transform: `translateY(${y}px)`}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            color: COLORS.green,
            fontSize: 24,
            fontWeight: 760,
            textTransform: 'uppercase',
          }}
        >
          <span style={{width: 72, height: 2, background: COLORS.green}} />
          Chapter 03 / Green Development
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 104,
            fontWeight: 790,
            lineHeight: 1.02,
            maxWidth: 1120,
            textShadow: '0 12px 54px rgba(0,0,0,0.85)',
          }}
        >
          A quieter transformation, measured in forests and megawatts.
        </div>
        <div
          style={{
            marginTop: 34,
            width: 470,
            height: 3,
            background:
              'linear-gradient(90deg, rgba(0,230,118,0), #00E676, rgba(255,255,255,0))',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const LowerThird: React.FC<{
  start: number;
  end: number;
  eyebrow: string;
  title: string;
  note: string;
}> = ({start, end, eyebrow, title, note}) => {
  const frame = useCurrentFrame();
  const opacity = fadeWindow(frame, start, end, 28);
  const x = interpolate(opacity, [0, 1], [-28, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 92,
        bottom: 218,
        width: 740,
        opacity,
        transform: `translateX(${x}px)`,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          color: COLORS.green,
          fontSize: 24,
          fontWeight: 760,
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 12,
          color: COLORS.white,
          fontSize: 58,
          fontWeight: 790,
          lineHeight: 1.03,
          textShadow: '0 12px 46px rgba(0,0,0,0.9)',
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 18,
          color: COLORS.soft,
          fontSize: 24,
          lineHeight: 1.35,
          maxWidth: 650,
        }}
      >
        {note}
      </div>
    </div>
  );
};

const NumberCard: React.FC<{
  start: number;
  value: number;
  decimals?: number;
  suffix: string;
  title: string;
  note: string;
  accent?: string;
}> = ({start, value, decimals = 0, suffix, title, note, accent = COLORS.green}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = spring({
    frame: frame - start,
    fps,
    config: {damping: 22, stiffness: 70, mass: 0.85},
  });
  const progress = clamp01(appear);
  const display = value * progress;

  return (
    <div
      style={{
        padding: '22px 26px 24px',
        borderLeft: `3px solid ${accent}`,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.62), rgba(0,0,0,0.24))',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.38)',
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [22, 0])}px)`,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div style={{color: COLORS.soft, fontSize: 22, textTransform: 'uppercase', fontWeight: 720}}>
        {title}
      </div>
      <div
        style={{
          marginTop: 10,
          color: COLORS.white,
          fontSize: 58,
          fontWeight: 820,
          lineHeight: 1,
        }}
      >
        {display.toFixed(decimals)}
        <span style={{fontSize: 30, color: accent, marginLeft: 5}}>{suffix}</span>
      </div>
      <div style={{marginTop: 12, color: COLORS.muted, fontSize: 21, lineHeight: 1.3}}>
        {note}
      </div>
    </div>
  );
};

const CircularProgress: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = clamp01(
    spring({
      frame: frame - start,
      fps,
      config: {damping: 24, stiffness: 56, mass: 1},
    }),
  );
  const radius = 120;
  const stroke = 16;
  const c = 2 * Math.PI * radius;
  const forest = 24.02 / 100;

  return (
    <div
      style={{
        width: 300,
        height: 300,
        position: 'relative',
        opacity: progress,
      }}
    >
      <svg viewBox="0 0 300 300" width="300" height="300">
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="rgba(0,0,0,0.28)"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={stroke}
        />
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke={COLORS.green}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - forest * progress)}
          transform="rotate(-90 150 150)"
          style={{filter: 'drop-shadow(0 0 16px rgba(0,230,118,0.8))'}}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, Arial, sans-serif',
          color: COLORS.white,
        }}
      >
        <div style={{fontSize: 58, fontWeight: 820, lineHeight: 1}}>
          {(24.02 * progress).toFixed(2)}
          <span style={{fontSize: 30, color: COLORS.green}}>%</span>
        </div>
        <div style={{marginTop: 10, color: COLORS.soft, fontSize: 20}}>forest coverage</div>
      </div>
    </div>
  );
};

const ForestEvidence: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeWindow(frame, 330, 840, 34);
  return (
    <div
      style={{
        position: 'absolute',
        right: 94,
        top: 178,
        width: 520,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        opacity,
      }}
    >
      <CircularProgress start={360} />
      <NumberCard
        start={440}
        value={231}
        suffix=" million ha"
        title="Forest area"
        note="A national green asset at continental scale."
        accent={COLORS.moss}
      />
      <NumberCard
        start={520}
        value={25}
        suffix="%"
        title="Share of global greening"
        note="Roughly one quarter of global new greening since 2000 is linked to China."
        accent={COLORS.cyan}
      />
    </div>
  );
};

const EnergyGauge: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = clamp01(
    spring({
      frame: frame - 1020,
      fps,
      config: {damping: 28, stiffness: 62, mass: 0.9},
    }),
  );
  const renewables = 56;
  const thermal = 44;
  return (
    <div
      style={{
        position: 'absolute',
        right: 92,
        top: 260,
        width: 660,
        padding: '38px 42px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.72), rgba(8,18,24,0.38))',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
        opacity: fadeWindow(frame, 960, 1530, 40),
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div style={{color: COLORS.green, fontSize: 24, fontWeight: 760, textTransform: 'uppercase'}}>
        Power mix signal
      </div>
      <div
        style={{
          marginTop: 16,
          color: COLORS.white,
          fontSize: 48,
          fontWeight: 790,
          lineHeight: 1.08,
        }}
      >
        Renewable capacity becomes the larger system.
      </div>
      <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 24}}>
        <Bar label="Renewable energy" value={renewables} progress={progress} color={COLORS.green} />
        <Bar label="Thermal power" value={thermal} progress={progress} color={COLORS.red} />
        <Bar label="Share of new capacity added in 2024" value={86} progress={progress} color={COLORS.cyan} />
      </div>
    </div>
  );
};

const Bar: React.FC<{label: string; value: number; progress: number; color: string}> = ({
  label,
  value,
  progress,
  color,
}) => (
  <div>
    <div style={{display: 'flex', justifyContent: 'space-between', color: COLORS.soft, fontSize: 24}}>
      <span>{label}</span>
      <span style={{color: COLORS.white, fontWeight: 780}}>{Math.round(value * progress)}%</span>
    </div>
    <div
      style={{
        marginTop: 10,
        height: 12,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.12)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${value * progress}%`,
          height: '100%',
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 22px ${color}AA`,
        }}
      />
    </div>
  </div>
);

const TimelineStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeWindow(frame, 930, 1600, 38);
  const items = [
    {year: '2013', text: 'Solar and wind scale up'},
    {year: '2020', text: 'Carbon goals accelerate investment'},
    {year: '2024', text: 'Renewables reach 56% of installed capacity'},
  ];
  return (
    <div
      style={{
        position: 'absolute',
        left: 92,
        top: 224,
        display: 'flex',
        gap: 24,
        opacity,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {items.map((item, i) => {
        const p = fade(frame, 980 + i * 60, 1030 + i * 60);
        return (
          <div
            key={item.year}
            style={{
              width: 250,
              padding: '18px 20px 20px',
              background: 'rgba(0,0,0,0.54)',
              borderTop: `3px solid ${i === 2 ? COLORS.green : 'rgba(255,255,255,0.28)'}`,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
            }}
          >
            <div style={{color: i === 2 ? COLORS.green : COLORS.amber, fontSize: 30, fontWeight: 820}}>
              {item.year}
            </div>
            <div style={{marginTop: 8, color: COLORS.soft, fontSize: 18, lineHeight: 1.25}}>
              {item.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SourceNote: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fadeWindow(frame, 1510, 1800, 38);
  return (
    <div
      style={{
        position: 'absolute',
        left: 92,
        top: 170,
        width: 1050,
        opacity,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div style={{color: COLORS.green, fontSize: 24, fontWeight: 760, textTransform: 'uppercase'}}>
        Source line
      </div>
      <div
        style={{
          marginTop: 18,
          color: COLORS.white,
          fontSize: 68,
          fontWeight: 790,
          lineHeight: 1.05,
          textShadow: '0 14px 48px rgba(0,0,0,0.85)',
        }}
      >
        The green transition is no longer background policy. It is visible infrastructure.
      </div>
      <div style={{marginTop: 28, color: COLORS.soft, fontSize: 24, lineHeight: 1.4, maxWidth: 900}}>
        Data references: National Forestry and Grassland Administration, National Energy Administration,
        NASA Earth Observatory / satellite greening research, 2024 public statistics.
      </div>
    </div>
  );
};

const SubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 12, 48) * (1 - fade(frame, 1760, 1800));

  if (frame < 240) {
    return (
      <BilingualSubtitle
        english="Green development begins with landscapes changing slowly, then visibly from above."
        chinese="绿色发展，始于土地缓慢改变，也显现在俯瞰之中。"
        opacity={opacity}
      />
    );
  }
  if (frame < 560) {
    return (
      <BilingualSubtitle
        english="Forests, shelterbelts and restored deserts are becoming measurable national capacity."
        chinese="森林、生态屏障与荒漠修复，正在变成可衡量的国家能力。"
        opacity={opacity}
      />
    );
  }
  if (frame < 900) {
    return (
      <BilingualSubtitle
        english="China's forest coverage has reached 24.02 percent, around 231 million hectares."
        chinese="中国森林覆盖率达到24.02%，森林面积约2.31亿公顷。"
        opacity={opacity}
      />
    );
  }
  if (frame < 1260) {
    return (
      <BilingualSubtitle
        english="In energy, solar fields and wind corridors are becoming part of the horizon."
        chinese="在能源领域，光伏阵列与风电走廊正在进入日常地平线。"
        opacity={opacity}
      />
    );
  }
  if (frame < 1560) {
    return (
      <BilingualSubtitle
        english="By 2024, renewables accounted for about 56 percent of installed power capacity."
        chinese="到2024年，可再生能源约占中国电力总装机容量的56%。"
        opacity={opacity}
      />
    );
  }
  return (
    <BilingualSubtitle
      english="A greener China is a long exposure of policy, land, technology and time."
      chinese="更加绿色的中国，是政策、土地、技术与时间共同留下的长曝光。"
      opacity={opacity}
    />
  );
};

export const PartC_Green: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, overflow: 'hidden'}}>
      <CinematicImage
        src={ASSET.kubuqiSatellite}
        start={0}
        end={300}
        zoomFrom={1.05}
        zoomTo={1.15}
        xFrom={-18}
        xTo={26}
        blur={1.2}
        brightness={0.54}
        saturate={0.9}
        label="Kubuqi Desert Restoration"
        labelDetail="Satellite view"
      />
      <CinematicImage
        src={ASSET.kubuqiGround}
        start={210}
        end={610}
        zoomFrom={1.16}
        zoomTo={1.27}
        xFrom={22}
        xTo={-28}
        blur={2.4}
        brightness={0.56}
        saturate={0.9}
        label="Ecological Restoration"
        labelDetail="Northern China"
      />
      <CinematicImage
        src={ASSET.northForest}
        start={500}
        end={920}
        zoomFrom={1.12}
        zoomTo={1.22}
        xFrom={-12}
        xTo={18}
        yFrom={8}
        yTo={-16}
        blur={2.1}
        brightness={0.57}
        saturate={0.98}
        label="Forest Coverage"
        labelDetail="24.02%"
      />
      <CinematicImage
        src={ASSET.solar}
        start={830}
        end={1220}
        zoomFrom={1.1}
        zoomTo={1.2}
        xFrom={-24}
        xTo={30}
        blur={2}
        brightness={0.58}
        saturate={0.92}
        label="Solar Deployment"
        labelDetail="Qingdao"
      />
      <CinematicImage
        src={ASSET.windDechang}
        start={1110}
        end={1500}
        zoomFrom={1.12}
        zoomTo={1.25}
        yFrom={-10}
        yTo={18}
        blur={2.3}
        brightness={0.56}
        saturate={0.96}
        label="Wind Power Corridor"
        labelDetail="Sichuan"
      />
      <CinematicImage
        src={ASSET.windGansu}
        start={1410}
        end={1800}
        zoomFrom={1.22}
        zoomTo={1.34}
        xFrom={18}
        xTo={-30}
        blur={2.6}
        brightness={0.50}
        saturate={0.88}
        label="Clean Energy Horizon"
        labelDetail="Gansu"
      />

      <ChapterTitle />

      <LowerThird
        start={250}
        end={610}
        eyebrow="Ecological repair"
        title="Desert edges become living boundaries."
        note="In a documentary cut, the land itself becomes the first data layer: sand, shelterbelts and restored vegetation."
      />
      <LowerThird
        start={620}
        end={920}
        eyebrow="National forest coverage"
        title="The number is modest. The scale is not."
        note="24.02 percent sounds small until it is translated into hundreds of millions of hectares."
      />
      <ForestEvidence />

      <LowerThird
        start={910}
        end={1260}
        eyebrow="Energy transition"
        title="The horizon starts to look engineered."
        note="Solar fields, wind farms and grid expansion turn policy targets into physical geography."
      />
      <TimelineStrip />
      <EnergyGauge />
      <SourceNote />

      <div
        style={{
          position: 'absolute',
          right: 86,
          bottom: 92,
          color: 'rgba(255,255,255,0.48)',
          fontFamily: 'Inter, Arial, sans-serif',
          fontSize: 18,
          opacity: 1 - fade(frame, 1700, 1800),
        }}
      >
        China Through Data / Part C
      </div>

      <FilmTexture />
    </AbsoluteFill>
  );
};
