"use client";

import { useState } from "react";

// 粉紫兩色交錯，名單為奇數時最後一格改用第三色避免相鄰同色
const SLICE_COLORS = ["#fde7ff", "#e9b5f7"];
const SLICE_COLOR_ODD_LAST = "#f5cdfb";

const SPIN_DURATION_MS = 5000;
const SIZE = 400;
const RADIUS = SIZE / 2;
const BULB_COUNT = 16;

const SPARKLES = [
  { top: "4%", left: "4%", size: "text-2xl", delay: "0s" },
  { top: "12%", left: "90%", size: "text-xl", delay: "0.6s" },
  { top: "62%", left: "-2%", size: "text-lg", delay: "1.2s" },
  { top: "70%", left: "94%", size: "text-2xl", delay: "0.3s" },
  { top: "-4%", left: "70%", size: "text-base", delay: "0.9s" },
];

// 角度以正上方為 0 度、順時針增加
function pointAt(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: RADIUS + r * Math.sin(rad), y: RADIUS - r * Math.cos(rad) };
}

function slicePath(start: number, end: number) {
  const p1 = pointAt(start, RADIUS);
  const p2 = pointAt(end, RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${RADIUS} ${RADIUS} L ${p1.x} ${p1.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
}

function sliceColor(i: number, total: number) {
  if (total % 2 === 1 && i === total - 1) return SLICE_COLOR_ODD_LAST;
  return SLICE_COLORS[i % 2];
}

// 只在點擊事件中呼叫，不在 render 期間執行
function random() {
  return Math.random();
}

function parseNames(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function LotteryWheel() {
  const [input, setInput] = useState("小明\n小華\n小美\n阿傑\n小芳\n大雄");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);

  const names = parseNames(input);
  const sliceAngle = names.length > 0 ? 360 / names.length : 360;
  const fontSize = names.length <= 8 ? 20 : names.length <= 16 ? 15 : 11;

  function spin() {
    if (spinning || names.length < 2) return;

    const index = Math.floor(random() * names.length);
    // 在該格內隨機偏移，避免每次都停在正中央
    const offset = (random() - 0.5) * sliceAngle * 0.8;
    const targetAngle = index * sliceAngle + sliceAngle / 2 + offset;
    // 讓目標角度轉到正上方的指針位置
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((360 - targetAngle - current) % 360) + 360) % 360;
    const extraTurns = 360 * (5 + Math.floor(random() * 3));

    setWinner(null);
    setSpinning(true);
    setRotation(rotation + extraTurns + delta);

    const picked = names[index];
    setTimeout(() => {
      setSpinning(false);
      setWinner(picked);
      setHistory((h) => [picked, ...h]);
      if (removeWinner) {
        const remaining = [...names];
        remaining.splice(index, 1);
        setInput(remaining.join("\n"));
      }
    }, SPIN_DURATION_MS);
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_320px]">
      <section className="flex flex-col items-center gap-8">
        <div className="relative w-full max-w-[420px] pb-[14%]">
          {/* 星星點綴 */}
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className={`pointer-events-none absolute animate-pulse text-fuchsia-200 drop-shadow-[0_0_6px_#f0abfc] ${s.size}`}
              style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            >
              ✦
            </span>
          ))}

          {/* 底座 */}
          <div
            className="absolute bottom-0 left-1/2 h-[22%] w-[46%] -translate-x-1/2 bg-gradient-to-b from-[#d946ef] to-[#7e22ce] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
            style={{ clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }}
          />
          <div className="absolute bottom-0 left-1/2 h-[4%] w-[56%] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#a21caf] via-[#f0abfc] to-[#a21caf]" />

          {/* 外框 */}
          <div className="relative aspect-square w-full rounded-full bg-gradient-to-br from-[#f472f6] via-[#d026d3] to-[#9d17c4] p-[7%] shadow-[0_0_40px_rgba(232,121,249,0.6),inset_0_0_12px_rgba(255,255,255,0.5)]">
            {/* 燈泡 */}
            {Array.from({ length: BULB_COUNT }, (_, i) => {
              const rad = ((i * 360) / BULB_COUNT) * (Math.PI / 180);
              return (
                <span
                  key={i}
                  className={`absolute h-[3.2%] w-[3.2%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.9)] ${
                    i % 2 === (spinning ? 1 : 0) ? "opacity-100" : "opacity-60"
                  } ${spinning ? "animate-pulse" : ""}`}
                  style={{
                    left: `${50 + 46.5 * Math.sin(rad)}%`,
                    top: `${50 - 46.5 * Math.cos(rad)}%`,
                  }}
                />
              );
            })}

            {/* 轉盤本體 */}
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="h-full w-full rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.15, 0.6, 0.15, 1)`
                  : "none",
              }}
            >
              {names.length < 2 && (
                <circle cx={RADIUS} cy={RADIUS} r={RADIUS} fill={SLICE_COLORS[0]} />
              )}
              {names.length > 1 &&
                names.map((_, i) => (
                  <path
                    key={i}
                    d={slicePath(i * sliceAngle, (i + 1) * sliceAngle)}
                    fill={sliceColor(i, names.length)}
                    stroke="#d8a4ee"
                    strokeWidth={1.5}
                  />
                ))}
              {names.map((name, i) => {
                const center = i * sliceAngle + sliceAngle / 2;
                return (
                  <text
                    key={i}
                    x={RADIUS}
                    y={RADIUS * 0.12}
                    transform={`rotate(${center} ${RADIUS} ${RADIUS}) rotate(90 ${RADIUS} ${RADIUS * 0.12})`}
                    textAnchor="start"
                    dominantBaseline="middle"
                    fill="#7e22ce"
                    fontSize={fontSize}
                    fontWeight={700}
                  >
                    {name.length > 6 ? `${name.slice(0, 6)}…` : name}
                  </text>
                );
              })}
            </svg>

            {/* 中心指針與圓心（不旋轉） */}
            <div className="absolute left-1/2 top-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2">
              <div
                className="absolute bottom-[78%] left-1/2 h-[42%] w-[34%] -translate-x-1/2 bg-gradient-to-b from-[#fde68a] to-[#f59e0b] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
                style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
              />
              <div className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-white bg-gradient-to-b from-[#fb7185] via-[#f472b6] to-[#c026d3] text-center shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                <span className="text-[clamp(0.7rem,3.2vw,1.1rem)] font-black leading-tight text-white drop-shadow">
                  瘋狂
                  <br />
                  大轉盤
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || names.length < 2}
          className="w-full max-w-[360px] rounded-full bg-gradient-to-r from-[#f472b6] via-[#e879f9] to-[#a855f7] py-4 text-xl font-bold tracking-widest text-white shadow-[0_6px_20px_rgba(232,121,249,0.5)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {spinning ? "抽獎中…" : "點擊抽獎"}
        </button>

        <div className="h-16 text-center" aria-live="polite">
          {winner && (
            <p className="text-2xl font-bold">
              🎉 恭喜{" "}
              <span className="bg-gradient-to-b from-[#fde68a] to-[#f59e0b] bg-clip-text text-3xl text-transparent">
                {winner}
              </span>
              ！
            </p>
          )}
          {names.length < 2 && !spinning && (
            <p className="text-fuchsia-200/80">請至少輸入 2 個名字</p>
          )}
        </div>
      </section>

      <aside className="flex flex-col gap-4 self-start rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">名單（共 {names.length} 人）</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={spinning}
            rows={12}
            placeholder="一行輸入一個名字"
            className="rounded-xl border border-fuchsia-300/40 bg-white/90 p-3 text-purple-900 outline-none placeholder:text-purple-300 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/50 disabled:opacity-60"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-fuchsia-100">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
            className="accent-fuchsia-500"
          />
          抽中後從名單移除
        </label>

        {history.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">抽獎紀錄</span>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-fuchsia-200/70 hover:text-white"
              >
                清除
              </button>
            </div>
            <ol className="list-decimal space-y-1 pl-6 text-sm text-fuchsia-50">
              {history.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ol>
          </div>
        )}
      </aside>
    </div>
  );
}
