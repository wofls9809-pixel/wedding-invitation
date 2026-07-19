import type { Metadata } from "next";
import "./globals.css";
import "./refinement.css";

const siteUrl = "https://wedding-invitation-gray-nine.vercel.app";
const title = "이재린 · 조미연 결혼식에 초대합니다";
const description = "2026년 8월 15일 오후 5시, 소중한 날에 함께해 주세요.";
const previewImage = `${siteUrl}/wedding-og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: [{
      url: previewImage,
      width: 1731,
      height: 909,
      alt: title,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [previewImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
