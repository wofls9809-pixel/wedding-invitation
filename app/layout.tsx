import type { Metadata } from "next";
import "./globals.css";
import "./refinement.css";

export const metadata: Metadata = {
  title: "이재린 · 조미연 웨딩 디너 초대장",
  description: "2026년 8월 15일 오후 5시, 산하춘에서 열리는 웨딩 디너에 초대합니다.",
  openGraph: {
    title: "이재린 · 조미연 웨딩 디너 초대장",
    description: "2026.08.15 SAT 5:00 PM · 산하춘",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
