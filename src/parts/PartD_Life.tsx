import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  CinematicTexture,
  MissionReadout,
} from '../components/Cinematic';
import {
  CHAPTER_END_FRAME,
  FPS,
  SUBTITLE_AREA_HEIGHT,
  VISUAL_SCENES,
} from './timeline';

const COLORS = {
  gold: '#f5c451',
  cream: '#fff7e6',
  ink: '#07111b',
  red: '#d93b35',
  slate: '#a9bac9',
};

const asset = (file: string) => staticFile(`assets/${file}`);

const fade = (frame: number, duration: number) =>
  interpolate(frame, [0, 18, duration - 18, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const CoverImage: React.FC<{
  file: string;
  duration: number;
  startScale?: number;
  endScale?: number;
  position?: string;
}> = ({
  file,
  duration,
  startScale = 1.03,
  endScale = 1.1,
  position = 'center',
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [startScale, endScale], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={asset(file)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: position,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

const DocumentaryOverlay: React.FC<{opacity?: number}> = ({opacity = 0.48}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(90deg, rgba(3,10,18,${opacity + 0.15}) 0%, rgba(3,10,18,${opacity}) 50%, rgba(3,10,18,${opacity + 0.08}) 100%)`,
    }}
  />
);

const Eyebrow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      color: COLORS.gold,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 5,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const ChapterTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 18, stiffness: 85}});
  const opacity = fade(frame, 360);

  return (
    <AbsoluteFill style={{opacity}}>
      <CoverImage
        file="city-02-shanghai-skyline-night.jpg"
        duration={360}
        startScale={1.02}
        endScale={1.13}
      />
      <DocumentaryOverlay opacity={0.5} />
      <div
        style={{
          margin: 'auto 110px',
          transform: `translateY(${interpolate(entrance, [0, 1], [42, 0])}px)`,
          opacity: entrance,
        }}
      >
        <Eyebrow>China Through Data · Part IV</Eyebrow>
        <h1
          style={{
            color: COLORS.cream,
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 112,
            lineHeight: 1.02,
            margin: '18px 0 16px',
            maxWidth: 1100,
          }}
        >
          Life & Culture
        </h1>
        <div
          style={{
            width: 230,
            height: 6,
            borderRadius: 4,
            background: COLORS.gold,
          }}
        />
        <p
          style={{
            color: '#d8e1e8',
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 34,
            letterSpacing: 1,
            marginTop: 24,
          }}
        >
          Everyday moments, connected by change
        </p>
      </div>
    </AbsoluteFill>
  );
};

const DigitalLifeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 270);
  const cardOffset = interpolate(frame, [0, 45], [80, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity}}>
      <AbsoluteFill style={{width: '58%', right: 'auto', overflow: 'hidden'}}>
        <CoverImage
          file="digital-01-wuhan-metro-qr-code.jpg"
          duration={270}
          startScale={1.02}
          endScale={1.15}
          position="center"
        />
      </AbsoluteFill>
      <AbsoluteFill style={{left: '52%', overflow: 'hidden'}}>
        <CoverImage
          file="digital-02-mobile-payment.jpg"
          duration={270}
          startScale={1.08}
          endScale={1.01}
          position="center"
        />
      </AbsoluteFill>
      <DocumentaryOverlay opacity={0.36} />
      <div
        style={{
          position: 'absolute',
          left: 104,
          top: 98,
          transform: `translateX(${cardOffset}px)`,
        }}
      >
        <Eyebrow>Digital Life</Eyebrow>
        <div
          style={{
            marginTop: 18,
            maxWidth: 610,
            color: COLORS.cream,
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.12,
          }}
        >
          A journey, a gate,
          <br />
          a payment.
        </div>
        <div
          style={{
            marginTop: 22,
            display: 'inline-block',
            border: `2px solid ${COLORS.gold}`,
            borderRadius: 999,
            color: COLORS.gold,
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 27,
            fontWeight: 700,
            padding: '12px 24px',
          }}
        >
          Connected in seconds
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LogisticsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 300);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity}}>
      <Sequence durationInFrames={180}>
        <AbsoluteFill>
          <OffthreadVideo
            muted
            src={asset('logistics-01-warehouse-loading-docks.mp4')}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={180} durationInFrames={120}>
        <AbsoluteFill>
          <OffthreadVideo
            muted
            src={asset('logistics-02-warehouse-loading-docks.mp4')}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </AbsoluteFill>
      </Sequence>
      <DocumentaryOverlay opacity={0.56} />
      <div
        style={{
          position: 'absolute',
          left: 104,
          top: 104,
          width: 920,
        }}
      >
        <Eyebrow>Efficient Connections</Eyebrow>
        <div
          style={{
            marginTop: 20,
            color: COLORS.cream,
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          From warehouses
          <br />
          to doorsteps
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 84,
          top: 112,
          width: 370,
          borderLeft: `5px solid ${COLORS.gold}`,
          background: 'rgba(5, 17, 27, 0.68)',
          color: '#e8eef2',
          fontFamily: 'Inter, Microsoft YaHei, sans-serif',
          fontSize: 27,
          lineHeight: 1.45,
          padding: '24px 28px',
          transform: `translateY(${interpolate(frame, [0, 48], [38, 0], {extrapolateRight: 'clamp'})}px)`,
        }}
      >
        Warehouses
        <br />
        Transport hubs
        <br />
        Communities
        <br />
        Families
      </div>
    </AbsoluteFill>
  );
};

const ParcelCountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 330);
  const count = interpolate(frame, [0, 230], [0, 199], {
    extrapolateRight: 'clamp',
  });
  const progress = interpolate(frame, [0, 250], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity}}>
      <CoverImage
        file="logistics-02-zhengzhou-container-terminal.jpg"
        duration={330}
        startScale={1.02}
        endScale={1.12}
      />
      <DocumentaryOverlay opacity={0.63} />
      <div style={{position: 'absolute', left: 104, top: 92}}>
        <Eyebrow>Daily Life At Scale</Eyebrow>
        <div
          style={{
            color: COLORS.cream,
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 172,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: 20,
            textShadow: '0 5px 20px rgba(0,0,0,0.32)',
          }}
        >
          {count.toFixed(0)}
          <span style={{color: COLORS.gold, fontSize: 70}}> BILLION</span>
        </div>
        <div
          style={{
            color: '#e0e7ec',
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 37,
            fontWeight: 600,
            letterSpacing: 1,
            marginTop: 16,
          }}
        >
          express-delivery parcels in 2025
        </div>
        <div
          style={{
            width: 900,
            height: 12,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.2)',
            marginTop: 34,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.gold})`,
            }}
          />
        </div>
        <div
          style={{
            color: COLORS.slate,
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 24,
            marginTop: 16,
          }}
        >
          Source: State Post Bureau of China, 2025
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 240);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity}}>
      <CoverImage
        file="lab-03-technology-classroom.jpg"
        duration={240}
        startScale={1.03}
        endScale={1.13}
      />
      <DocumentaryOverlay opacity={0.62} />
      <div
        style={{
          position: 'absolute',
          left: 104,
          top: 102,
          width: 990,
        }}
      >
        <Eyebrow>More Than Scale</Eyebrow>
        <div
          style={{
            color: COLORS.cream,
            fontFamily: 'Inter, Microsoft YaHei, sans-serif',
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.12,
            marginTop: 22,
          }}
        >
          The changing rhythm
          <br />
          of life in modern China
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CreditsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 600], [1060, -970]);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 8%, #183249 0%, #08141f 46%, #04090e 100%)',
        color: COLORS.cream,
        overflow: 'hidden',
        fontFamily: 'Inter, Microsoft YaHei, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 200,
          right: 200,
          top: 0,
          textAlign: 'center',
          transform: `translateY(${y}px)`,
        }}
      >
        <div style={{color: COLORS.gold, fontSize: 36, letterSpacing: 7}}>
          CHINA THROUGH DATA
        </div>
        <div style={{fontSize: 82, fontWeight: 700, marginTop: 20}}>
          Thank You for Watching
        </div>
        <div style={{fontSize: 36, color: '#bed0dc', marginTop: 16}}>
          感谢观看
        </div>

        <div style={{height: 130}} />
        <CreditBlock
          title="Produced By"
          lines={[
            'Jiayi Chen · Yuezhe Zhang · Chen Jiang · Shengzhang Chen',
            'China Through Data Team',
            'Cross-Cultural Communication · June 2026',
          ]}
        />
        <CreditBlock
          title="Data Sources"
          lines={[
            'State Post Bureau of China · 2025 express-delivery statistics',
            'National Bureau of Statistics of China',
          ]}
        />
        <CreditBlock
          title="AI Tools & Production Technologies"
          lines={[
            'Video editing and data visualization: Remotion',
            'AI voice synthesis: Xiaomi MiMo-V2.5-TTS · Mia voice',
            'Coding assistance: OpenAI Codex',
          ]}
        />
        <CreditBlock
          title="Open Media Sources"
          lines={[
            'Wikimedia Commons contributors',
            'Detailed authors, licenses, and links are retained in media-bank/manifest.csv',
          ]}
        />
        <div style={{fontSize: 44, color: COLORS.gold, marginTop: 105}}>
          China Through Data
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CreditBlock: React.FC<{title: string; lines: string[]}> = ({
  title,
  lines,
}) => (
  <div style={{marginBottom: 76}}>
    <div
      style={{
        color: COLORS.gold,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 5,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </div>
    {lines.map((line) => (
      <div
        key={line}
        style={{
          color: '#e4edf3',
          fontSize: 31,
          lineHeight: 1.5,
          marginTop: 12,
        }}
      >
        {line}
      </div>
    ))}
  </div>
);

const visualComponents: Record<string, React.FC> = {
  title: ChapterTitle,
  'digital-life': DigitalLifeScene,
  logistics: LogisticsScene,
  'parcel-count': ParcelCountScene,
  closing: ClosingScene,
};

export const PartD_Life: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
    {VISUAL_SCENES.map((scene) => {
      const Scene = visualComponents[scene.id];

      return (
        <Sequence
          durationInFrames={scene.endFrame - scene.startFrame}
          from={scene.startFrame}
          key={scene.id}
        >
          <Scene />
        </Sequence>
      );
    })}
    <Sequence
      durationInFrames={2100 - CHAPTER_END_FRAME}
      from={CHAPTER_END_FRAME}
    >
      <CreditsScene />
    </Sequence>
    <CinematicTexture opacity={0.12} />
    <MissionReadout label="Everyday systems" value="Life, logistics, culture" />
  </AbsoluteFill>
);

