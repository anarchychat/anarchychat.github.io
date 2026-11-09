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
        media='screen and (max-width: 600px)' 
        href="/css/mobile/layout/sidebar.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/layout/topbar.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/bg.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/block.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/chat.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/dm.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/draw.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/game.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/mobile.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/music.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/performancemode.css"/>
        <link rel="stylesheet" 
        media='screen and (max-width: 600px)' 
        href="/css/mobile/vc.css"/>

        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/layout/sidebar.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/layout/topbar.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/bg.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/block.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/chat.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/dm.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/draw.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/game.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/desktop.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/music.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/performancemode.css"/>
        <link rel="stylesheet" 
        media='screen and (min-width: 601px)' 
        href="/css/desktop/vc.css"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
