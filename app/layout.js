import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://wedding-invitation-gray-nine.vercel.app"),
  title: "재린 ♥ MJ 결혼합니다",
  description: "소중한 분들을 저희의 특별한 날에 초대합니다.",
  openGraph: {
    title: "재린 ♥ MJ 결혼합니다",
    description: "소중한 분들을 저희의 특별한 날에 초대합니다.",
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/images/og-card.svg",
        width: 1200,
        height: 630,
        alt: "재린과 MJ의 결혼식 초대장"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "재린 ♥ MJ 결혼합니다",
    description: "소중한 분들을 저희의 특별한 날에 초대합니다.",
    images: ["/images/og-card.svg"]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f6f0e5"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
