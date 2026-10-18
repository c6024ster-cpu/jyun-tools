import type { Metadata } from "next";
import PomodoroTimer from "./PomodoroTimer";

export const metadata: Metadata = {
  title: "番茄鐘 | Jyun Tools",
  description: "番茄工作法計時器，幫助你專注工作",
};

export default function PomodoroPage() {
  return <PomodoroTimer />;
}
