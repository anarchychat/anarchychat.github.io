import type { Metadata } from "next";

import "@/public/css/tabler-icons.css";

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
      <head>

        <link rel="stylesheet" 
        href="/css/desktop-mobile/layout/sidebar.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/bg.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/block.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/chat.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/dm.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/draw.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/game.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/music.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/performancemode.css"/>
        <link rel="stylesheet" 
        href="/css/desktop-mobile/vc.css"/>

        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/mobile.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/layout/topbar.css"/>

        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/desktop.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/layout/topbar.css"/>

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
