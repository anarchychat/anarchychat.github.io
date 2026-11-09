"use client"

import { useState, useEffect, memo } from "react"
import dynamic from "next/dynamic"
import React from 'react'
import Topbar from "@/components/layout/topbar"
import Sidebar from "@/components/layout/sidebar"
import Bg from "@/components/ui/bg"
import Block from "@/components/ui/block"
import Chat from "@/components/ui/chat"
import Draw from "@/components/ui/draw"
import Game from "@/components/ui/game"
import Music from "@/components/ui/music"
import Dm from "@/components/ui/dm"
import Vc from "@/components/ui/vc"
import * as music from "@/components/ui/music"
import * as userInfo from "@/components/logic/userInfo"
import * as cookie from "@/components/logic/cookie"

export default function FrontPage() {
  const [game, setGame] = useState(false)
  const [draw, setDraw] = useState(false)
  const [chat, setChat] = useState(false)
  const [block, setBlock] = useState(false)
  const [music, setMusic] = useState(false)
  const [bg, setBg] = useState(false)
  const [dm, setDm] = useState(false)
  const [vc, setVc] = useState(false)
  const [blur, setBlur] = useState(false)
  const [b1, setB1] = useState(false)
  const [b2, setB2] = useState(false)
  const [b3, setB3] = useState(false)
  const [b4, setB4] = useState(false)
  const [b5, setB5] = useState(false)
  const [b6, setB6] = useState(false)
  const [bgInput, setBgInput] = useState("")
  const [gameInput, setGameInput] = useState("")
  const [savedMusicInput, setSavedMusicInput] = useState("")
  const [blockData, setBlockData] = useState<string[]>(getCookieValue("block", "") as string[])
  const [yourName, setYourName] = useState(getCookieValue("name", "Guest"))
  const [color, setColor] = useState(getCookieValue("color", "#000000"))
  var domLoaded: boolean = false

  useEffect(() => {
    // For remembering which home page you are on
    if (getCookieValue("btn", "")) {
      btnHandler(getCookieValue("btn", "") as string)
    }
    if (getCookieValue("blur", "")) {
      console.log("blur: ", getCookieValue("blur", "") as boolean)
      setBlur(getCookieValue("blur", "") as boolean)
    }
    if (getCookieValue("game", "")) {
      setGameInput(getCookieValue("game", "") as string)
    }
    if (getCookieValue("music", "")) {
      console.log("MUSIC: ", getCookieValue("music", "") as string)
      setSavedMusicInput(getCookieValue("music", "") as string)
    }
    if (getCookieValue("bg", "")) {
      console.log("RUNNING: ", getCookieValue("bg", ""))
      const getValue = getCookieValue("bg", "") as string[]
      changeBg(getValue[1], getValue[0])
      setBgInput(getValue[0])
    }
    domLoaded = true
  }, [])

  function setCookieValue(name: string, value: string | boolean): void {
    if (name === "name") {
      cookie.setCookie(name, value as string)
      setYourName(value as string)
    }
    if (name === "color") {
      cookie.setCookie(name, value as string)
      setColor(value as string)
    }
    if (name === "block") {
      setBlockData((current) => [
        ...current,
        value as string
      ])
      let setter = blockData
      setter.push(value as string)
      console.log("blockData: ", setter)
      cookie.setCookie("block", setter)
    }
    if (name === "unblock") {
      setBlockData((current) => current.filter((username) => 
        username !== value
      ))
      let setter = blockData.filter((username) =>
        username !== value
      )
      console.log("blockData: ", setter)
      cookie.setCookie("block", setter)
    }
    if (name === "unblock-all") {
      console.log("CALLED")
      setBlockData([])
      let setter: string[] = []
      console.log("blockData: ", setter)
      cookie.setCookie("block", setter)
    }
    if (name === "btn") {
      cookie.setCookie(name, value as string)
      btnHandler(value as string)
    }
    if (name === "blur") {
      cookie.setCookie(name, value as boolean)
      setBlur(value as boolean)
    }
    if (name === "game") {
      cookie.setCookie(name, value as string)
      setGameInput(value as string)
    }
    if (name === "music") {
      cookie.setCookie(name, value as string)
      console.log("MUSIC VALUE: ", value as string)
      setSavedMusicInput(value as string)
    }
    // Backgrounds
    console.log("debug: ", name, value)
    const bgNum = ["b1", "b2", "b3",
      "b4", "b5", "b6"
    ]
    for (const num of bgNum) {
      if (name === num) {
        cookie.setCookie("bg", [value as string, name])
        console.log("bg value: ", value)
        changeBg(name as string, value as string)
      }
    }
    if (name === "cust") {
      cookie.setCookie("bg", [value as string, name])
      console.log("bg value: ", value)
      setBgInput(value as string)
    }
    if (name === "no-bg") {
      cookie.setCookie("bg", [value as string, name])
      console.log("bg value: ", value)
      setBgInput(value as string)
    }
    // End of backgrounds
  }

  function getCookieValue(name: string, defaultValue: string | boolean): string | string[] | boolean {
    console.log("name: ", name, "name-return: ", cookie.getCookie(name))
    if (cookie.getCookie(name)) {
      return cookie.getCookie(name)
    }
    console.log("did not get any cookie data...")
    if (name === "name") {
      console.log("name: ", defaultValue as string + userInfo.getRandomDigit())
      setCookieValue("name", defaultValue as string + userInfo.getRandomDigit())
      return defaultValue as string + userInfo.getRandomDigit()
    }
    if (name === "color") {
      setCookieValue("color", userInfo.getRandomColor())
      return "" + userInfo.getRandomColor()
    }
    if (name === "block") {
      setCookieValue("unblock-all", "")
      return []
    }
    if (name === "btn") {
      setCookieValue("btn", "")
      return ""
    }
    if (name === "blur") {
      setCookieValue("blur", false)
      return ""
    }
    if (name === "game") {
      setCookieValue("game", "")
      return ""
    }
    if (name === "music") {
      console.log("did not find music")
      setCookieValue("music", "")
      return ""
    }
    if (name === "bg") {
      setCookieValue("no-bg", "")
      return ""
    }
    return ""
  }

  function changeBg(bg: string, url: string) {
    const type = ["b1", "b2", "b3", "b4", "b5", "b6"]
    const set = [setB1, setB2, setB3, setB4, setB5, setB6]
    const bgBool = [b1, b2, b3, b4, b5, b6]
    for (const name of set) {
      name(false)
    }

    for (let i=0; i < set.length; i++) {
      if (bg == type[i]) {
        setBgInput(url)
        set[i](!bgBool[i])
        if (!bgBool[i] === false) {
          console.log("bg NONE")
          setCookieValue("no-bg", "")
          setBgInput("")
        }
        console.log("bgBool[i]: ", !bgBool[i])
      }
    }   
  }

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
      {bgInput ? (
        <video 
          className="video-background" 
          autoPlay={true} 
          loop={true} 
          style={{ 'opacity': '0.6' }}
          src={bgInput}
        ></video>
      ):(<></>)
      }
      <div className="main" id="gridLayer">
            <Topbar blur={blur} />
            <Sidebar 
              blur={blur}
              game={game}
              draw={draw}
              chat={chat}
              block={block}
              music={music}
              bg={bg}
              dm={dm}
              vc={vc}
              setCookieValue={setCookieValue}
            />
          <div className="mid" style={{ 'gridArea': 'mid', 'zIndex': '0' }}>
            <Bg 
              bg={bg} 
              blur={blur}
              b1={b1}
              b2={b2}
              b3={b3}
              b4={b4}
              b5={b5}
              b6={b6}
              setCookieValue={setCookieValue}
            />
            <Block 
              block={block} 
              blur={blur} 
              blockData={blockData} 
              color={color as string}
              setCookieValue={setCookieValue}
            />
            <Chat 
              chat={chat} 
              blur={blur} 
              blockData={blockData}
              yourName={yourName as string}
              color={color as string}
              setCookieValue={setCookieValue}
            />
            <Draw 
              draw={draw} 
              blur={blur} 
              blockData={blockData}
              yourName={yourName as string}
              color={color as string}
              setCookieValue={setCookieValue}
            />
            <Game 
              game={game}
              gameInput={gameInput} 
              blur={blur}
              setCookieValue={setCookieValue} 
            />
            <Music 
              music={music}
              savedMusicInput={savedMusicInput} 
              blur={blur} 
              setCookieValue={setCookieValue} 
            />
            <Dm 
              dm={dm} 
              blur={blur} 
              blockData={blockData} 
              yourName={yourName as string}
              color={color as string}
              setCookieValue={setCookieValue}
            />
            <Vc 
              vc={vc} 
              blur={blur} 
              blockData={blockData} 
              yourName={yourName as string}
              color={color as string}
              setCookieValue={setCookieValue}
            />
          </div>
      </div>
      
      <div className="performance-mode" id="performance-mode">
        <div style={{ 'display': 'inline' }}>Performance Mode Activated! </div>
        <i className="ti ti-leaf" style={{ 'display': 'inline' }}></i>
      </div>
    </>
  );
}