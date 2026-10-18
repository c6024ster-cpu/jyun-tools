"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: Record<
  Mode,
  { label: string; bg: string; accent: string; ring: string; hint: string }
> = {
  focus: {
    label: "專注",
    bg: "from-[#7f1d1d] via-[#b91c1c] to-[#450a0a]",
    accent: "text-rose-100",
    ring: "#fecaca",
    hint: "專心做一件事，別分心 🍅",
  },
  short: {
    label: "短休息",
    bg: "from-[#064e3b] via-[#0f766e] to-[#022c22]",
    accent: "text-emerald-100",
    ring: "#a7f3d0",
    hint: "起來走走、喝口水 ☕",
  },
  long: {
    label: "長休息",
    bg: "from-[#1e3a8a] via-[#1d4ed8] to-[#172554]",
    accent: "text-sky-100",
    ring: "#bfdbfe",
    hint: "好好休息一下，你做得很好 🌿",
  },
};

const DEFAULT_MINUTES: Record<Mode, number> = { focus: 25, short: 5, long: 15 };
const LONG_BREAK_EVERY = 4;
const RING_RADIUS = 140;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// 只在事件或計時器回呼中呼叫，不在 render 期間執行
function now() {
  return Date.now();
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    [0, 0.25, 0.5].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = [880, 988, 1175][i];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.65);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // 瀏覽器不支援音效時略過
  }
}

function notify(body: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    new Notification("番茄鐘", { body });
  }
}

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [mode, setMode] = useState<Mode>("focus");
  const [remainingMs, setRemainingMs] = useState(DEFAULT_MINUTES.focus * 60_000);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [task, setTask] = useState("");
  const [autoStart, setAutoStart] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const endAtRef = useRef(0);

  const totalMs = minutes[mode] * 60_000;
  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;
  const theme = MODES[mode];

  function switchMode(next: Mode, start = false) {
    const ms = minutes[next] * 60_000;
    setMode(next);
    setRemainingMs(ms);
    setRunning(start);
    if (start) endAtRef.current = now() + ms;
  }

  function handleFinish() {
    playChime();
    if (mode === "focus") {
      const count = completed + 1;
      setCompleted(count);
      const next = count % LONG_BREAK_EVERY === 0 ? "long" : "short";
      notify(`完成一個番茄！該${MODES[next].label}了`);
      switchMode(next, autoStart);
    } else {
      notify("休息結束，準備開始專注吧！");
      switchMode("focus", autoStart);
    }
  }

  // 用 ref 保存最新的 handleFinish，避免計時器拿到舊的 state
  const finishRef = useRef(handleFinish);
  useEffect(() => {
    finishRef.current = handleFinish;
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = endAtRef.current - now();
      if (left <= 0) {
        clearInterval(id);
        setRemainingMs(0);
        finishRef.current();
      } else {
        setRemainingMs(left);
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const original = document.title;
    return () => {
      document.title = original;
    };
  }, []);

  useEffect(() => {
    document.title = running
      ? `${formatTime(remainingMs)} ${theme.label} | 番茄鐘`
      : "番茄鐘 | Jyun Tools";
  }, [running, remainingMs, theme.label]);

  function toggle() {
    if (running) {
      setRunning(false);
      setRemainingMs(endAtRef.current - now());
      return;
    }
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    endAtRef.current = now() + remainingMs;
    setRunning(true);
  }

  function reset() {
    switchMode(mode);
  }

  function skip() {
    if (mode === "focus") {
      switchMode(
        (completed + 1) % LONG_BREAK_EVERY === 0 ? "long" : "short"
      );
    } else {
      switchMode("focus");
    }
  }

  function changeMinutes(target: Mode, value: number) {
    const clamped = Math.min(120, Math.max(1, Math.round(value) || 1));
    setMinutes((m) => ({ ...m, [target]: clamped }));
    // 沒在計時時，直接套用到目前模式
    if (target === mode && !running) setRemainingMs(clamped * 60_000);
  }

  const cycleIndex = completed % LONG_BREAK_EVERY;

  return (
    <div
      className={`flex flex-1 flex-col bg-gradient-to-b ${theme.bg} text-white transition-colors duration-700`}
    >
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center gap-8 px-4 py-10">
        <header className="text-center">
          <h1 className="text-4xl font-black tracking-widest drop-shadow">番茄鐘</h1>
          <p className={`mt-2 ${theme.accent} opacity-80`}>{theme.hint}</p>
        </header>

        {/* 模式切換 */}
        <div className="flex gap-1 rounded-full bg-black/20 p-1">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === m ? "bg-white text-zinc-900 shadow" : "text-white/80 hover:bg-white/10"
              }`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        {/* 倒數圓環 */}
        <div className="relative aspect-square w-full max-w-[320px]">
          <svg viewBox="0 0 320 320" className="h-full w-full -rotate-90">
            <circle cx={160} cy={160} r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={14} />
            <circle
              cx={160}
              cy={160}
              r={RING_RADIUS}
              fill="none"
              stroke={theme.ring}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-7xl font-bold tabular-nums tracking-tight">
              {formatTime(remainingMs)}
            </span>
            <span className={`mt-2 text-lg ${theme.accent}`}>{theme.label}</span>
          </div>
        </div>

        {/* 控制按鈕 */}
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="h-12 w-12 rounded-full bg-white/15 text-xl transition hover:bg-white/25"
            aria-label="重設"
            title="重設"
          >
            ↺
          </button>
          <button
            onClick={toggle}
            className="w-44 rounded-full bg-white py-4 text-xl font-bold tracking-widest text-zinc-900 shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition hover:brightness-95 active:scale-[0.98]"
          >
            {running ? "暫停" : remainingMs < totalMs ? "繼續" : "開始"}
          </button>
          <button
            onClick={skip}
            className="h-12 w-12 rounded-full bg-white/15 text-xl transition hover:bg-white/25"
            aria-label="跳過"
            title="跳過"
          >
            ⏭
          </button>
        </div>

        {/* 目前任務 */}
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="這次要專注做什麼？"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-lg outline-none placeholder:text-white/50 focus:border-white/50"
        />

        {/* 進度 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {Array.from({ length: LONG_BREAK_EVERY }, (_, i) => (
              <span
                key={i}
                className={`text-2xl transition ${i < cycleIndex ? "" : "opacity-25 grayscale"}`}
              >
                🍅
              </span>
            ))}
          </div>
          <p className="text-sm text-white/70">
            今天已完成 <span className="font-bold text-white">{completed}</span> 個番茄
            ・每 {LONG_BREAK_EVERY} 個番茄一次長休息
          </p>
        </div>

        {/* 設定 */}
        <div className="w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-3 font-semibold"
          >
            設定
            <span className={`transition ${showSettings ? "rotate-180" : ""}`}>▾</span>
          </button>
          {showSettings && (
            <div className="flex flex-col gap-4 border-t border-white/15 px-5 py-4">
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(MODES) as Mode[]).map((m) => (
                  <label key={m} className="flex flex-col gap-1 text-sm">
                    {MODES[m].label}（分鐘）
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={minutes[m]}
                      onChange={(e) => changeMinutes(m, Number(e.target.value))}
                      className="rounded-lg bg-white/90 px-3 py-2 text-zinc-900 outline-none"
                    />
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoStart}
                  onChange={(e) => setAutoStart(e.target.checked)}
                />
                時間到自動開始下一段
              </label>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
