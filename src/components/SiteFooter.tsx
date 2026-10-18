import Link from "next/link";
import { TOOLS } from "./tools";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0c0a1d] text-white/60">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[2fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="text-xl">🧰</span>
            <span className="font-bold">Jyun 的小工具箱</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            一些讓日常更有趣、更專注的小工具。免安裝、免登入，打開瀏覽器就能用。
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">工具</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="transition hover:text-white">
                  {tool.icon} {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © 2026 Jyun 的小工具箱 · Made with Next.js & Tailwind CSS
      </div>
    </footer>
  );
}
