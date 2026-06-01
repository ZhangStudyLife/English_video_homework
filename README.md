# China Through Data — 数说中国

> A data-driven documentary video about China's transformation, entirely generated from code using **Remotion** (React video framework). No traditional video editing software is involved — every frame, animation, subtitle, and audio layer is defined in TypeScript/React and rendered programmatically.

---

## 项目概述

本项目通过代码生成一部约 **4 分 20 秒**（7800 帧 @ 30fps）的数据可视化纪录片视频，主题为 "China Through Data"（数说中国）。视频分为四个章节，涵盖经济、科技、绿色发展与日常生活，使用真实数据驱动的动画图表、电影级视觉效果和 AI 语音旁白。

**核心理念：视频即代码。** 所有视觉元素、动画时间轴、音频混合、字幕同步均由 React 组件和 TypeScript 逻辑定义，通过 Remotion 框架逐帧渲染为 MP4 视频。

---

## 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 视频框架 | [Remotion](https://www.remotion.dev/) v4.0 | 用 React 组件定义视频，逐帧渲染为 MP4 |
| UI 框架 | React 18 + TypeScript | 所有视觉场景、动画、图表均为 React 组件 |
| TTS 语音 | 小米 MiMo-V2.5-TTS | 通过 API 生成英文旁白 WAV 音频 |
| BGM | 程序化生成 | Node.js 脚本合成 260 秒背景音乐 WAV |
| 字体 | Google Fonts (Inter) | 全局英文字体 + 系统中文字体回退 |
| 构建工具 | tsconfig + Remotion CLI | TypeScript 编译 + 视频渲染 |

---

## 项目结构

```
English_video/
├── src/                          # 核心源代码
│   ├── index.ts                  # Remotion 入口，注册根组件
│   ├── Root.tsx                  # 注册视频 Composition（FullVideo）
│   ├── constants.ts              # 全局常量：颜色、分辨率(1920×1080)、帧率(30fps)
│   ├── parts/                    # 四个章节的视频组件
│   │   ├── FullVideo.tsx         # 总组件：按时间轴拼接四个章节 + 音频层
│   │   ├── PartA_Economy.tsx     # 第一章：经济活力（GDP、贸易、高铁、5G、脱贫等）
│   │   ├── PartB_Tech.tsx        # 第二章：科技与基础设施（高铁网络、5G信号、航天、绿色能源）
│   │   ├── PartC_Green.tsx       # 第三章：绿色发展（森林覆盖、光伏、风电）
│   │   ├── PartD_Life.tsx        # 第四章：日常生活（数字生活、物流、快递、片尾字幕）
│   │   ├── narration-source.json # 旁白文案数据源（英中双语 + 时间轴）
│   │   └── timeline.ts           # 全局时间轴定义（帧号 ↔ 场景映射）
│   ├── components/               # 可复用的视觉/音频组件
│   │   ├── AudioLayers.tsx       # 音频系统：BGM层、旁白层、字幕层
│   │   ├── BilingualSubtitle.tsx # 英中双语字幕组件
│   │   └── Cinematic.tsx         # 电影级视觉效果（背景、纹理、信息条）
│   ├── data/
│   │   └── narration.json        # 旁白元数据（由 TTS 脚本自动生成/更新）
│   ├── generated/                # 生成的中间数据
│   └── styles/
│       └── fonts.css             # 全局字体加载（Inter + 中文回退）
├── public/                       # 静态资源（图片、音频、视频素材）
│   ├── audio/
│   │   ├── bgm/                  # 背景音乐（MP3 + WAV）
│   │   │   ├── interstellar-studio-cover.mp3  # 主BGM（MP3，保留）
│   │   │   └── soft-documentary-bed.wav       # 备用BGM（程序化生成）
│   │   └── narration/            # TTS 生成的旁白音频（WAV，每段一条）
│   │       ├── a-opening.wav
│   │       ├── a-gdp.wav
│   │       └── ...（共 22 条旁白）
│   ├── assets/                   # 图片素材（JPG/PNG）和视频素材（MP4）
│   ├── 01_opening_city/          # 场景图片
│   ├── 03_digital_life/
│   ├── 04_movement/
│   ├── 06_green_innovation/
│   └── 07_closing/
├── scripts/                      # 自动化脚本
│   ├── generate-narration.mjs    # TTS 旁白生成脚本（调用小米 MiMo API）
│   ├── generate-bgm.mjs          # BGM 程序化生成脚本
│   └── validate-narration.mjs    # 旁白数据校验脚本
├── package.json                  # 项目配置与 npm scripts
├── tsconfig.json                 # TypeScript 配置
└── remotion.config.ts            # Remotion 渲染配置
```

---

## 完整工作流程

整个视频生成分为 **5 个阶段**，按顺序执行：

```
[1. 素材准备] → [2. TTS 语音生成] → [3. BGM 生成] → [4. 代码开发/调试] → [5. 最终渲染]
```

### 阶段 1：素材准备

将图片（JPG/PNG）和视频素材（MP4）放入 `public/` 目录下对应的子文件夹。这些素材用于各章节的背景画面。

**素材来源示例：**
- 上海外滩夜景、洋山港、光伏阵列航拍等真实照片
- 物流仓库视频片段（MP4）
- 所有素材通过 Remotion 的 `staticFile()` 函数引用

### 阶段 2：TTS 语音旁白生成

旁白文案定义在 `src/data/narration.json` 中，每条记录包含：

```json
{
  "id": "a-opening",
  "part": "A",
  "startFrame": 60,
  "endFrame": 204,
  "english": "China Through Data opens with a simple question...",
  "chinese": "《数说中国》从一个简单问题开始...",
  "ttsText": "China Through Data opens with a simple question...",
  "audioFile": "a-opening.wav",
  "durationSeconds": 5.44,
  "audioReady": true
}
```

**字段说明：**
| 字段 | 含义 |
|------|------|
| `id` | 唯一标识，格式为 `{part}-{主题}` |
| `part` | 所属章节（A/B/C/D） |
| `startFrame` / `endFrame` | 在视频中的起止帧号（30fps） |
| `english` / `chinese` | 英中双语字幕文本 |
| `ttsText` | 发送给 TTS API 的文本（通常与 english 相同） |
| `audioFile` | 生成的 WAV 文件名 |
| `durationSeconds` | 实际音频时长（由脚本自动写入） |
| `audioReady` | 音频是否已生成 |

**生成命令：**

```bash
# 设置环境变量
export XIAOMI_MIMO_API_KEY="your-api-key"

# 运行 TTS 生成
npm run tts:generate
```

**脚本工作原理**（`scripts/generate-narration.mjs`）：
1. 读取 `src/data/narration.json` 中的所有旁白条目
2. 对每条旁白，计算目标时长 = `(endFrame - startFrame) / 30` 秒
3. 调用小米 MiMo-V2.5-TTS API，传入语音风格提示和目标时长
4. 接收返回的 WAV 音频，保存到 `public/audio/narration/`
5. 解析 WAV 头部获取实际时长，更新 JSON 中的 `durationSeconds` 和 `audioReady`
6. **自动同步时间轴**：根据实际音频时长调整 `endFrame`，确保旁白之间不重叠

**语音风格配置：**
```
A young adult male English technology documentary narrator.
Clear, confident, energetic, and slightly witty, with a popular online science-commentary rhythm.
Medium-fast pace, crisp articulation, controlled excitement, no celebrity imitation, no heavy drama.
```

**校验命令：**
```bash
npm run tts:validate              # 严格模式：所有音频必须就绪
npm run tts:validate:allow-missing  # 宽松模式：允许部分音频缺失
```

### 阶段 3：BGM 背景音乐生成

```bash
npm run bgm:generate
```

`scripts/generate-bgm.mjs` 程序化生成一段 260 秒的环境音乐 WAV 文件：
- 采样率 24kHz，单声道，16-bit
- 96 BPM，四和弦循环（Am → Em → C → D 变体）
- 包含：和弦铺底 + 贝斯 + 鼓组（kick/snare/hi-hat）+ 微光高频
- 自动侧链压缩（sidechain）+ 渐入渐出

### 阶段 4：代码开发与实时预览

```bash
npm start
# 启动 Remotion Studio（本地开发服务器）
```

Remotion Studio 提供：
- 实时预览每一帧的画面
- 可拖动时间轴查看任意时刻
- 热重载：修改代码后自动刷新

**关键开发概念：**

#### 时间轴系统

视频总时长由 `FullVideo.tsx` 定义：
```typescript
const PART_A_FRAMES = 2100;  // 70 秒
const PART_B_FRAMES = 1800;  // 60 秒
const PART_C_FRAMES = 1800;  // 60 秒
const PART_D_FRAMES = 2100;  // 70 秒
// 总计 7800 帧 = 260 秒 ≈ 4 分 20 秒
```

每个章节内部再细分为多个场景（Scene），通过 `<Sequence>` 组件控制时间偏移：
```tsx
<Sequence from={0} durationInFrames={2100} name="Part A - Economy">
  <PartA_Economy />
</Sequence>
```

#### 音频混合系统

`AudioLayers.tsx` 实现三层音频：

1. **BGM 层**（`BgmLayer`）：
   - 循环播放 `interstellar-studio-cover.mp3`
   - 音量随旁白自动降低（ducking）：旁白播放时 BGM 从 10.5% 降至 6.5%
   - 首尾各 3 秒渐入渐出

2. **旁白层**（`NarrationLayer`）：
   - 从 `narration.json` 读取所有 `audioReady=true` 的片段
   - 每段旁白通过 `<Sequence>` 精确对齐到对应帧号
   - 使用 `<Audio>` 组件播放对应的 WAV 文件

3. **字幕层**（`SubtitleLayer`）：
   - 与旁白同步显示英中双语字幕
   - 底部 150px 区域，渐变背景

#### 视觉动画模式

每个场景组件使用 Remotion 的核心 API：
- `useCurrentFrame()` — 获取当前帧号
- `interpolate(frame, [from, to], [start, end])` — 线性插值动画
- `spring({ frame, fps, config })` — 弹簧物理动画
- `staticFile(path)` — 引用 public 目录下的静态资源

**常见动画模式：**
```typescript
// 淡入淡出窗口
const opacity = interpolate(frame, [start, start+30], [0, 1]) *
                interpolate(frame, [end-30, end], [1, 0]);

// 数字滚动
const value = interpolate(frame, [0, 60], [0, 100]);

// 弹簧入场
const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
```

### 阶段 5：最终渲染

```bash
npm run build
# 等价于: remotion render FullVideo Video.mp4
```

渲染过程：
1. Remotion 启动 Chromium 浏览器
2. 逐帧渲染 React 组件为 JPEG 图像
3. 合并所有帧 + 音频轨道为 MP4 文件
4. 输出到项目根目录的 `Video.mp4`

**渲染配置**（`remotion.config.ts`）：
```typescript
Config.setVideoImageFormat("jpeg");   // 帧格式
Config.setOverwriteOutput(true);       // 覆盖已有输出
```

---

## 四个章节详解

### Part A — 经济活力（Economy）| 70 秒

**视觉风格：** 深色背景 + 红色/金色数据可视化 + 代码雨开场

| 场景 | 时间 | 内容 |
|------|------|------|
| 开场 | 0-6s | "China Through Data" 代码雨打字机效果 |
| GDP 折线图 | 6-12.7s | 2013-2023 GDP 增长曲线动画 |
| 人均 GDP | 12.7-16.7s | 30000→89000 元数字滚动 |
| 全球对比 | 16.7-21.3s | 中美日德印 GDP 横向柱状图 |
| 贸易领先 | 21.3-25s | 全球贸易排名柱状图 |
| 高铁 | 25-28.3s | 45,000 公里进度条动画 |
| 5G | 28.3-32s | 338 万基站 + 8 亿用户卡片 |
| 数字经济 | 32-36.7s | 电商渗透率环形图 + 零售额 |
| 城镇化 | 36.7-40.3s | 53.7%→66.2% 进度条 |
| 专利 | 40.3-43.7s | 164 万件专利数字动画 |
| 研发投入 | 43.7-47s | 1.18→3.33 万亿对比 |
| 脱贫攻坚 | 47-51s | 9899 万→0 对比动画 |
| 关键指标 | 51-55s | 四宫格指标卡片 |
| 全球排名 | 55-61.7s | 2013 vs 2023 排名对比 |
| 总结 | 61.7-70s | 上海天际线 + 核心数据回顾 |

### Part B — 科技与基础设施（Tech）| 60 秒

**视觉风格：** 电影级质感 + 胶片颗粒 + 扫描线纹理 + 航天主题

| 场景 | 时间 | 内容 |
|------|------|------|
| 标题转场 | 0-8s | "A Civilization in Motion" 飞入动画 |
| 高铁网络 | 8-20s | 全球高铁里程柱状图（中国 45,000km vs 其他） |
| 5G 信号图 | 20-40s | 中国地图热力图 + 城市点亮动画 |
| 航天时代 | 40-63s | 火箭发射动画 + 轨道弧线 |
| 绿色能源 | 63-80s | 光伏/风电/新能源车数据卡片 |

### Part C — 绿色发展（Green）| 60 秒

**视觉风格：** 自然色调 + 纪录片质感 + 胶片纹理

| 场景 | 时间 | 内容 |
|------|------|------|
| 章节标题 | 0-7s | "A quieter transformation" |
| 库布齐沙漠修复 | 7-20s | 卫星图 + 地面实拍对比 |
| 森林覆盖 | 20-41s | 24.02% 环形进度条 + 2.31 亿公顷数据 |
| 光伏部署 | 41-55s | 青岛光伏阵列航拍 |
| 风电走廊 | 55-60s | 四川/甘肃风电场 + 时间线 |

### Part D — 日常生活（Life）| 70 秒

**视觉风格：** 纪录片分屏 + 暖色调 + 片尾滚动字幕

| 场景 | 时间 | 内容 |
|------|------|------|
| 章节标题 | 0-12s | "Life & Culture" 双图分屏 |
| 数字生活 | 12-21s | 武汉地铁二维码 + 移动支付双屏 |
| 物流网络 | 21-31s | 仓库视频素材 + 流程图 |
| 快递数据 | 31-42s | 1990 亿件数字滚动 + 进度条 |
| 结语 | 42-50s | "The changing rhythm of life" |
| 片尾字幕 | 50-70s | 滚动字幕（制作者、数据源、AI 工具致谢） |

---

## 环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `XIAOMI_MIMO_API_KEY` | TTS 生成时必需 | 小米 MiMo TTS API 密钥 |
| `XIAOMI_MIMO_BASE_URL` | 可选 | API 基础 URL（默认 `https://token-plan-cn.xiaomimimo.com/v1`） |

---

## npm scripts 命令速查

| 命令 | 作用 |
|------|------|
| `npm start` | 启动 Remotion Studio 实时预览 |
| `npm run build` | 渲染最终 MP4 视频（输出到 `Video.mp4`） |
| `npm run tts:generate` | 调用 TTS API 生成所有旁白音频 |
| `npm run tts:validate` | 校验旁白数据完整性 |
| `npm run tts:validate:allow-missing` | 宽松校验（允许部分音频缺失） |
| `npm run bgm:generate` | 程序化生成背景音乐 |
| `npm run upgrade` | 升级 Remotion 版本 |

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. （可选）生成 BGM
npm run bgm:generate

# 3. （可选）生成 TTS 旁白（需要 API Key）
export XIAOMI_MIMO_API_KEY="your-key"
npm run tts:generate

# 4. 启动实时预览
npm start

# 5. 渲染最终视频
npm run build
```

---

## 设计系统

```typescript
COLORS = {
  background: "#0B0F19",   // 深色背景
  primary:    "#E60000",   // 中国红（GDP、重要数据）
  gold:       "#FFD700",   // 金色（标题、高亮）
  techBlue:   "#00E5FF",   // 科技蓝（5G、高铁）
  ecoGreen:   "#00E676",   // 生态绿（绿色能源）
  titleText:  "#FFFFFF",   // 标题白
  bodyText:   "#CCCCCC",   // 正文灰
}
```

全局字体：`Inter`（英文）+ `Microsoft YaHei`（中文回退）

---

## 音频层技术细节

### BGM Ducking 算法

```typescript
// 当旁白播放时，BGM 音量自动降低
bgmVolume = baseVolume(10.5%) - duckAmount × 4%

// duckAmount 在旁白区间内为 1，区间外按 4 秒窗口线性衰减
// 最终音量还叠加了首尾 3 秒的渐入渐出
```

### 旁白-字幕同步机制

1. `narration.json` 中每条旁白有精确的 `startFrame` / `endFrame`
2. TTS 生成后，脚本根据实际音频时长自动调整 `endFrame`
3. 运行时，`NarrationLayer` 和 `SubtitleLayer` 读取同一份 JSON
4. 旁白通过 `<Sequence from={clip.startFrame}>` 精确对齐帧号
5. 字幕与旁白共享相同的时间窗口，保证视觉-听觉同步

---

## 许可与致谢

- **视频框架：** Remotion
- **AI 语音：** 小米 MiMo-V2.5-TTS（Mia voice）
- **编码辅助：** OpenAI Codex / Claude
- **数据来源：** 国家统计局、国家邮政局、国家能源局等公开数据
- **图片素材：** Wikimedia Commons 等开放媒体源
