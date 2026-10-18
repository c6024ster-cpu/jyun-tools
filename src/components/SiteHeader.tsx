import Link from "next/link";
import { TOOLS } from "./tools";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0a1d]/75 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7] via-[#ec4899] to-[#f59e0b] text-lg shadow-lg transition group-hover:rotate-12">
            🧰
          </span>
          <span className="text-lg font-bold tracking-wide">
            Jyun <span className="text-white/60">的小工具箱</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full px-3 py-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <span className="sm:mr-1">{tool.icon}</span>
              <span className="hidden sm:inline">{tool.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
