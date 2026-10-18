import type { Metadata } from "next";
import FortuneDraw from "./FortuneDraw";

export const metadata: Metadata = {
  title: "好運抽籤 | Jyun Tools",
  description: "隨機抽一支籤，看看今天的運勢",
};

export default function FortunePage() {
  return <FortuneDraw />;
}
