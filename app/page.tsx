"use client";

import { useState } from "react";
import Topbar from "@/components/layout/topbar";
import Sidebar from "@/components/layout/sidebar";
import Bg from "@/components/ui/bg";
import Block from "@/components/ui/block";
import Chat from "@/components/ui/chat";
import Draw from "@/components/ui/draw";
import Game from "@/components/ui/game";
import Music from "@/components/ui/music";
import Dm from "@/components/ui/dm";
import Vc from "@/components/ui/vc";

export default function HomePage() {
  const [game, setGame] = useState(false)
  const [draw, setDraw] = useState(false)
  const [chat, setChat] = useState(true)
  const [block, setBlock] = useState(false)
  const [music, setMusic] = useState(false)
  const [bg, setBg] = useState(false)
  const [dm, setDm] = useState(false)
  const [vc, setVc] = useState(false)
  const [url, setUrl] = useState("")
  const [blur, setBlur] = useState(false)
  
  function unsetAll() {
    for (const setValue of [
      setGame,
      setDraw,
      setChat,
      setBlock,
      setMusic,
      setBg,
      setDm,
      setVc
    ]) {
      setValue(false);
    }
  }

  function btnHandler(btn: string) {
    console.log("name: " + btn);
    for (const [name, getValue, getSetter] of [
      ["game", game, setGame],
      ["draw", draw, setDraw],
      ["chat", chat, setChat],
      ["block", block, setBlock],
      ["music", music, setMusic],
      ["bg", bg, setBg],
      ["dm", dm, setDm],
      ["vc", vc, setVc],
    ] as const) {
      if (btn === name) {
        if (getValue) {
          console.log("true: " + name);
          unsetAll();
          getSetter(false);
          break;
        } else {
          console.log("false: " + name);
          unsetAll();
          getSetter(true);
          break;
        }
      }
    }
  }

  return (
    <>
      {url ? (
        <video 
          id="video-background" 
          autoPlay={true} 
          loop={true} 
          style={{ 'opacity': '0.6' }}
          src={url}
        ></video>
      ):(<></>)
      }
      <div className="main" id="gridLayer">
            <Topbar blur={blur} />
            <Sidebar 
              setGame={() => {
                btnHandler("game")
              }}
              setDraw={() => {
                btnHandler("draw")
              }}   
              setChat={() => {
                btnHandler("chat")
              }}
              setBlock={() => {
                btnHandler("block")
              }}
              setMusic={() => {
                btnHandler("music")
              }}
              setBg={() => {
                btnHandler("bg")
              }}            
              setDm={() => {
                btnHandler("dm")
              }}            
              setVc={() => {
                btnHandler("vc")
              }}
              blur={blur}
            />
          <div className="mid" style={{ 'gridArea': 'mid', 'zIndex': '0' }}>
            <Bg bg={bg} setUrl={setUrl} blur={blur} setBlur={setBlur} />
            <Block block={block} blur={blur} />
            <Chat chat={chat} blur={blur} />
            <Draw draw={draw} blur={blur} />
            <Game game={game} blur={blur} />
            <Music music={music} blur={blur} />
            <Dm dm={dm} blur={blur} />
            <Vc vc={vc} blur={blur} />
          </div>
      </div>
      
      <div className="performance-mode" id="performance-mode">
        <div style={{ 'display': 'inline' }}>Performance Mode Activated! </div>
        <i className="ti ti-leaf" style={{ 'display': 'inline' }}></i>
      </div>
    </>
  );
}
