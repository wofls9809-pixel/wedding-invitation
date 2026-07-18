import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://wedding-invitation-gray-nine.vercel.app"),
  title: "미연 ♥ 재린 웨딩 디너 초대장",
  description: "2026년 8월 15일 오후 5시, 산하춘에서 만나요.",
  openGraph: {
    title: "미연 ♥ 재린 웨딩 디너 초대장",
    description: "2026년 8월 15일 오후 5시 · 산하춘",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "미연과 재린의 웨딩 디너 초대장" }]
  },
  twitter: { card: "summary_large_image", title: "미연 ♥ 재린 웨딩 디너 초대장", description: "2026년 8월 15일 오후 5시 · 산하춘", images: ["/images/og.jpg"] }
};

export const viewport = { width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#f7f1e8" };

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
