"use client";

import { useState } from "react";

type Tone = "good" | "mid" | "bad";

type Level = {
  name: string;
  weight: number;
  tone: Tone;
  stars: number;
  color: string;
  summaries: string[];
};

// 權重越高越容易抽到
const LEVELS: Level[] = [
  {
    name: "大吉",
    weight: 10,
    tone: "good",
    stars: 5,
    color: "text-red-600",
    summaries: [
      "萬事順遂，心想事成，今天是屬於你的日子！",
      "貴人相助，好運連連，大膽去做想做的事吧。",
      "天時地利人和，所求皆如願。",
    ],
  },
  {
    name: "中吉",
    weight: 18,
    tone: "good",
    stars: 4,
    color: "text-red-500",
    summaries: [
      "運勢上揚，努力會被看見，保持節奏就好。",
      "好事正在醞釀，耐心等待會有好結果。",
      "整體順利，小心別太得意忘形。",
    ],
  },
  {
    name: "小吉",
    weight: 20,
    tone: "good",
    stars: 3,
    color: "text-orange-500",
    summaries: [
      "平穩中帶點小確幸，留意身邊的小美好。",
      "小有收穫，一步一腳印最踏實。",
      "今天適合把小事做好，會有意外的回報。",
    ],
  },
  {
    name: "吉",
    weight: 22,
    tone: "mid",
    stars: 3,
    color: "text-amber-600",
    summaries: [
      "平安順利，照著計畫走就不會出錯。",
      "不急不徐，穩穩前進便是好運。",
      "今天沒有大起大落，是充電的好時機。",
    ],
  },
  {
    name: "末吉",
    weight: 15,
    tone: "mid",
    stars: 2,
    color: "text-yellow-700",
    summaries: [
      "起步稍慢，但後勁十足，傍晚之後漸入佳境。",
      "先苦後甘，堅持下去就會轉運。",
      "運勢平平，多留一點彈性給自己。",
    ],
  },
  {
    name: "凶",
    weight: 10,
    tone: "bad",
    stars: 1,
    color: "text-slate-600",
    summaries: [
      "今天宜靜不宜動，重要決定可以緩一緩。",
      "小阻礙難免，深呼吸，別跟自己過不去。",
      "凡事多確認一次，就能避開麻煩。",
    ],
  },
  {
    name: "大凶",
    weight: 5,
    tone: "bad",
    stars: 0,
    color: "text-zinc-800",
    summaries: [
      "物極必反，今天是谷底，明天只會更好！",
      "低調行事、早點休息，把好運留到明天。",
      "抽到大凶也是一種稀有運氣，接下來只會往上走。",
    ],
  },
];

const ASPECTS: { label: string; icon: string; pool: Record<Tone, string[]> }[] = [
  {
    label: "工作",
    icon: "💼",
    pool: {
      good: ["效率爆表，適合挑戰新任務", "提案容易通過，主動爭取", "同事給力，合作順暢"],
      mid: ["按部就班即可", "適合整理文件與待辦清單", "多聽少說，觀察局勢"],
      bad: ["容易出小錯，記得再檢查", "別急著回覆重要信件", "避免與人正面衝突"],
    },
  },
  {
    label: "感情",
    icon: "💗",
    pool: {
      good: ["桃花朵朵開，主動聯絡會有驚喜", "與另一半甜蜜加分", "適合表白或約會"],
      mid: ["平淡是福，多一點關心", "聊聊天就能拉近距離", "適合和老朋友敘舊"],
      bad: ["說話留點餘地，避免誤會", "給彼此一點空間", "別翻舊帳"],
    },
  },
  {
    label: "財運",
    icon: "💰",
    pool: {
      good: ["偏財運佳，可能有意外收入", "投資眼光精準", "購物容易撿到好價"],
      mid: ["收支平衡，量入為出", "適合記帳理財", "小額消費無妨"],
      bad: ["避免衝動購物", "暫緩大筆支出", "小心看好錢包"],
    },
  },
  {
    label: "健康",
    icon: "🌿",
    pool: {
      good: ["精神飽滿，適合運動", "睡眠品質好，氣色佳", "活力滿點"],
      mid: ["多喝水、記得起身伸展", "飲食清淡為宜", "早點睡會更有精神"],
      bad: ["注意保暖，別著涼", "減少咖啡因與熬夜", "久坐記得休息眼睛"],
    },
  },
];

const LUCKY_COLORS = ["紅色", "金色", "白色", "粉紅色", "天藍色", "薄荷綠", "紫色", "橘色", "米色", "黑色"];
const LUCKY_ITEMS = ["一杯熱茶", "藍色原子筆", "耳機", "小盆栽", "巧克力", "雨傘", "筆記本", "香氛", "帆布袋", "手錶"];
const DIRECTIONS = ["東", "南", "西", "北", "東南", "東北", "西南", "西北"];

const SHAKE_MS = 1600;
const POP_MS = 700;

type Fortune = {
  number: number;
  level: Level;
  summary: string;
  aspects: { label: string; icon: string; text: string }[];
  luckyColor: string;
  luckyNumber: number;
  luckyItem: string;
  direction: string;
};

// 只在點擊事件中呼叫，不在 render 期間執行
function random() {
  return Math.random();
}

function pick<T>(list: T[]) {
  return list[Math.floor(random() * list.length)];
}

function pickLevel() {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let r = random() * total;
  for (const level of LEVELS) {
    r -= level.weight;
    if (r < 0) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

function drawFortune(): Fortune {
  const level = pickLevel();
  return {
    number: 1 + Math.floor(random() * 100),
    level,
    summary: pick(level.summaries),
    aspects: ASPECTS.map((a) => ({ label: a.label, icon: a.icon, text: pick(a.pool[level.tone]) })),
    luckyColor: pick(LUCKY_COLORS),
    luckyNumber: 1 + Math.floor(random() * 99),
    luckyItem: pick(LUCKY_ITEMS),
    direction: pick(DIRECTIONS),
  };
}

const CHINESE_DIGITS = "〇一二三四五六七八九";

function toChineseNumber(n: number) {
  if (n === 100) return "一百";
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (tens === 0) return CHINESE_DIGITS[ones];
  return `${tens === 1 ? "" : CHINESE_DIGITS[tens]}十${ones === 0 ? "" : CHINESE_DIGITS[ones]}`;
}

type Phase = "idle" | "shaking" | "popping" | "revealed";

export default function FortuneDraw() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fortune, setFortune] = useState<Fortune | null>(null);

  function draw() {
    if (phase === "shaking" || phase === "popping") return;
    setFortune(null);
    setPhase("shaking");
    const result = drawFortune();
    setTimeout(() => {
      setFortune(result);
      setPhase("popping");
      setTimeout(() => setPhase("revealed"), POP_MS);
    }, SHAKE_MS);
  }

  const busy = phase === "shaking" || phase === "popping";

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-[#7f1d1d] via-[#991b1b] to-[#450a0a] text-amber-50">
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-8 px-4 py-10">
        <header className="text-center">
          <h1 className="bg-gradient-to-b from-[#fef3c7] to-[#f59e0b] bg-clip-text text-4xl font-black tracking-[0.3em] text-transparent drop-shadow">
            好運抽籤
          </h1>
          <p className="mt-2 text-amber-100/80">誠心默念，搖一搖籤筒，看看今天的運勢</p>
        </header>

        {/* 籤筒 */}
        <div className="relative flex h-72 w-44 items-end justify-center">
          <div
            className={`relative flex h-full w-full origin-bottom items-end justify-center ${
              phase === "shaking" ? "animate-shake" : ""
            }`}
          >
            {/* 籤枝 */}
            <div className="absolute bottom-[45%] left-1/2 flex -translate-x-1/2 gap-1.5">
              {[-2, -1, 0, 1, 2].map((offset) => (
                <div
                  key={offset}
                  className="h-28 w-2.5 rounded-t-sm bg-gradient-to-b from-[#fde68a] to-[#d97706] shadow"
                  style={{ transform: `rotate(${offset * 5}deg) translateY(${Math.abs(offset) * 6}px)` }}
                />
              ))}
            </div>
            {/* 跳出來的那支籤 */}
            {(phase === "popping" || phase === "revealed") && fortune && (
              <div className="absolute bottom-[45%] left-1/2 -translate-x-1/2">
                <div className="flex h-36 w-5 animate-stick-pop flex-col items-center justify-start rounded-t-md bg-gradient-to-b from-[#fef3c7] to-[#f59e0b] pt-1 text-[10px] font-bold leading-tight text-red-800 shadow-lg">
                  {[...`第${toChineseNumber(fortune.number)}籤`].map((ch, i) => (
                    <span key={i}>{ch}</span>
                  ))}
                </div>
              </div>
            )}
            {/* 筒身 */}
            <div className="relative z-10 flex h-[58%] w-full flex-col items-center justify-center rounded-b-3xl rounded-t-lg border-4 border-[#fbbf24] bg-gradient-to-b from-[#dc2626] to-[#7f1d1d] shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-x-0 top-3 h-1.5 bg-[#fbbf24]/80" />
              <div className="absolute inset-x-0 bottom-5 h-1.5 bg-[#fbbf24]/80" />
              <span className="text-5xl font-black text-[#fde68a] drop-shadow">籤</span>
            </div>
          </div>
        </div>

        <button
          onClick={draw}
          disabled={busy}
          className="w-full max-w-[320px] rounded-full bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] py-4 text-xl font-bold tracking-[0.3em] text-red-900 shadow-[0_6px_20px_rgba(245,158,11,0.45)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {phase === "shaking" ? "搖籤中…" : phase === "popping" ? "出籤了！" : fortune ? "再抽一次" : "搖籤"}
        </button>

        {/* 籤詩卡 */}
        {phase === "revealed" && fortune && (
          <article className="w-full animate-card-in rounded-2xl border-4 border-double border-[#b45309] bg-[#fffbeb] p-6 text-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
            <p className="text-center text-sm tracking-widest text-[#b45309]">
              第 {toChineseNumber(fortune.number)} 籤
            </p>
            <h2
              className={`mt-1 text-center text-6xl font-black tracking-[0.2em] ${fortune.level.color}`}
            >
              {fortune.level.name}
            </h2>
            <p className="mt-2 text-center text-xl text-amber-500">
              {"★".repeat(fortune.level.stars)}
              <span className="text-zinc-300">{"★".repeat(5 - fortune.level.stars)}</span>
            </p>
            <p className="mt-4 text-center text-lg font-medium leading-relaxed">
              {fortune.summary}
            </p>

            <hr className="my-5 border-dashed border-[#d97706]/40" />

            <ul className="grid gap-3 sm:grid-cols-2">
              {fortune.aspects.map((a) => (
                <li key={a.label} className="rounded-xl bg-amber-100/60 px-4 py-3">
                  <p className="text-sm font-bold text-[#b45309]">
                    {a.icon} {a.label}
                  </p>
                  <p className="mt-1">{a.text}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-zinc-500">幸運色</dt>
                <dd className="font-semibold">{fortune.luckyColor}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">幸運數字</dt>
                <dd className="font-semibold">{fortune.luckyNumber}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">幸運小物</dt>
                <dd className="font-semibold">{fortune.luckyItem}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">吉利方位</dt>
                <dd className="font-semibold">{fortune.direction}方</dd>
              </div>
            </dl>
          </article>
        )}

        <p className="text-center text-xs text-amber-100/50">籤詩僅供娛樂，好運掌握在自己手中 ✨</p>
      </main>
    </div>
  );
}
