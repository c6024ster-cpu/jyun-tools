import type { Metadata } from "next";
import LotteryWheel from "./LotteryWheel";

export const metadata: Metadata = {
  title: "抽獎轉盤 | Jyun Tools",
  description: "輸入名單，轉動轉盤抽出得獎者",
};

export default function LotteryPage() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-[#3b0764] via-[#581c87] to-[#2e1065] text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10">
        <header className="text-center">
          <h1 className="bg-gradient-to-b from-white to-fuchsia-200 bg-clip-text text-4xl font-black tracking-widest text-transparent drop-shadow-[0_2px_8px_rgba(232,121,249,0.6)]">
            幸運抽獎轉盤
          </h1>
          <p className="mt-2 text-fuchsia-200/80">
            輸入這次的名單（一行一個），按下「點擊抽獎」轉動轉盤。
          </p>
        </header>
        <LotteryWheel />
      </main>
    </div>
  );
}
