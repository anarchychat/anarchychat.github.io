import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "@/public/css/desktop/layout/topbar.css";
import "@/public/css/desktop/layout/sidebar.css";
import "@/public/css/desktop/desktop.css";
import "@/public/css/desktop/game.css";
import "@/public/css/desktop/draw.css";
import "@/public/css/desktop/chat.css";
import "@/public/css/desktop/block.css";
import "@/public/css/desktop/music.css";
import "@/public/css/desktop/bg.css";
import "@/public/css/desktop/dm.css";
import "@/public/css/desktop/vc.css";
import "@/public/css/desktop/performancemode.css"
import "@/public/css/tabler-icons.css";
import "@/public/css/style.css";
import "./globals.css";
//import Script from "next/script";

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
});

export const metadata: Metadata = {
  title: "𝗔𝗡𝗔𝗥𝗖𝗛𝗬 𝗖𝗛𝗔𝗧",
  description: "Made by Lorenzino, Mr. iogames and more in TKR, is a mod for the chatbox on the website iogames.fun. this turns it into one big chat site! including: Enchanced chat, Animated Backgrounds, an alternate chat, and more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/*
        <Script src="/js/modules/dm.js" strategy="beforeInteractive" />
        <Script src="/js/modules/background.js" strategy="beforeInteractive" />
        <Script src="/js/modules/buttons.js" strategy="beforeInteractive" />
        <Script src="/js/modules/custom-feature.js" strategy="beforeInteractive" />
        <Script src="/js/modules/gif-autoload.js" strategy="beforeInteractive" />
        <Script src="/js/modules/chat.js" strategy="beforeInteractive" />
        <Script src="/js/modules/chatroom.js" strategy="beforeInteractive" />
        <Script src="/js/modules/draw.js" strategy="beforeInteractive" />
        <Script src="/js/modules/music.js" strategy="beforeInteractive" />
        <Script src="/js/modules/spotify.js" strategy="beforeInteractive" />
        <Script src="/js/modules/performance.js" strategy="beforeInteractive" />
        <Script src="/js/modules.js" strategy="afterInteractive" />
        */}

        {children}
      </body>
    </html>
  );
}
