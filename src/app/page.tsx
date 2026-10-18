import Link from "next/link";
import { TOOLS } from "@/components/tools";

const HIGHLIGHTS = [
  { icon: "⚡", title: "打開就能用", text: "不用安裝、不用註冊，點進去馬上開始。" },
  { icon: "📱", title: "手機也好用", text: "版面自動適應螢幕，隨時隨地都能用。" },
  { icon: "🔒", title: "資料不外流", text: "所有內容只在你的瀏覽器裡運作。" },
];

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#0c0a1d] text-white">
      {/* 背景光暈 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#a855f7]/30 blur-[120px]" />
        <div className="absolute -right-24 top-40 h-[24rem] w-[24rem] rounded-full bg-[#ec4899]/25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-[#f59e0b]/15 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-16 pt-20 text-center sm:pt-28">
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur">
          ✨ 3 個小工具，讓每天多一點樂趣
        </span>
        <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight sm:text-7xl">
          Jyun 的
          <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#fbbf24] bg-clip-text text-transparent">
            小工具箱
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
          抽獎、專注、算運勢——把生活裡的小事，交給這些輕巧又好看的工具。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="#tools"
            className="rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] px-8 py-3.5 font-semibold shadow-[0_10px_30px_-5px_rgba(236,72,153,0.5)] transition hover:brightness-110 active:scale-[0.98]"
          >
            開始探索
          </a>
          <Link
            href="/fortune"
            className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            🏮 先抽一支籤
          </Link>
        </div>

        {/* 工具圖示浮動展示 */}
        <div className="mt-16 flex gap-4 sm:gap-6">
          {TOOLS.map((tool, i) => (
            <div
              key={tool.href}
              className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${tool.gradient} text-4xl shadow-2xl ring-1 ring-white/20 sm:h-24 sm:w-24 sm:text-5xl ${
                i === 1 ? "-translate-y-4" : "rotate-[-6deg]"
              } ${i === 2 ? "rotate-[6deg]" : ""}`}
            >
              {tool.icon}
            </div>
          ))}
        </div>
      </section>

      {/* 工具卡片 */}
      <section id="tools" className="relative mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f472b6]">Tools</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">工具一覽</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-white/25 ${tool.glow}`}
            >
              <div
                className={`absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${tool.gradient} opacity-20 blur-2xl transition group-hover:opacity-50`}
              />
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-3xl shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-6`}
              >
                {tool.icon}
              </div>
              <span className={`mt-5 w-fit rounded-full px-3 py-1 text-xs font-medium ring-1 ${tool.badge}`}>
                {tool.tagline}
              </span>
              <h3 className="mt-3 text-2xl font-bold">{tool.name}</h3>
              <p className="mt-2 leading-relaxed text-white/60">{tool.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/75">
                {tool.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#f472b6]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <span className="mt-auto flex items-center gap-1 pt-6 font-semibold text-white/90">
                立即使用
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 特色 */}
      <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-8">
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="flex gap-4">
              <span className="text-3xl">{h.icon}</span>
              <div>
                <h3 className="font-semibold">{h.title}</h3>
                <p className="mt-1 text-sm text-white/55">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
