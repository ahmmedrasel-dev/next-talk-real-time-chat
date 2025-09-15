import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://next-talk.example.com"),
  title: "NextTalk - Real-time Chat App",
  description:
    "Secure, real-time 1:1 and group chat with presence, typing indicators, and modern UI.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "NextTalk - Real-time Chat App",
    description:
      "Chat instantly with friends and groups. Modern, secure, and fast.",
    url: "https://next-talk.example.com",
    siteName: "NextTalk",
    images: [
      {
        url: "/next.svg",
        width: 180,
        height: 38,
        alt: "NextTalk Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
