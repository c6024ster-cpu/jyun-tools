export type Tool = {
  href: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  // 卡片配色，對應各工具頁的主題色
  gradient: string;
  glow: string;
  badge: string;
};

export const TOOLS: Tool[] = [
  {
    href: "/lottery",
    name: "抽獎轉盤",
    icon: "🎡",
    tagline: "公平又刺激的抽獎",
    description: "輸入名單，轉動華麗的燈泡大轉盤，讓命運決定今天的幸運兒。",
    features: ["自訂抽獎名單", "抽中後可自動移除", "保留抽獎紀錄"],
    gradient: "from-[#c026d3] to-[#6d28d9]",
    glow: "group-hover:shadow-[0_20px_60px_-10px_rgba(192,38,211,0.6)]",
    badge: "bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-400/30",
  },
  {
    href: "/pomodoro",
    name: "番茄鐘",
    icon: "🍅",
    tagline: "找回專注的節奏",
    description: "25 分鐘專注、5 分鐘休息，用番茄工作法把一天切成有效率的小段落。",
    features: ["專注／短休／長休自動輪替", "提示音與桌面通知", "自訂時間長度"],
    gradient: "from-[#ef4444] to-[#9f1239]",
    glow: "group-hover:shadow-[0_20px_60px_-10px_rgba(239,68,68,0.6)]",
    badge: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
  },
  {
    href: "/fortune",
    name: "好運抽籤",
    icon: "🏮",
    tagline: "看看今天的運勢",
    description: "誠心默念、搖一搖籤筒，從大吉到大凶，抽出屬於你的今日籤詩。",
    features: ["七種籤等，機率各不同", "工作、感情、財運、健康", "幸運色與幸運小物"],
    gradient: "from-[#f59e0b] to-[#b91c1c]",
    glow: "group-hover:shadow-[0_20px_60px_-10px_rgba(245,158,11,0.6)]",
    badge: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  },
];
