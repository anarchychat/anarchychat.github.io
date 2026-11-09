import { useState } from "react"

export default function Sidebar({
  blur, game, draw, chat, block, music,
  bg, dm, vc, setCookieValue
}: {
  blur: boolean; game: boolean;
  draw: boolean; chat: boolean;
  block: boolean; music: boolean;
  bg: boolean; dm: boolean;
  vc: boolean;
  setCookieValue: (name: string, value: string) => void;
}) {
  const [fs, setFs] = useState(false);

  function fsHandler() {
    if (!fs) {
      document.body.requestFullscreen()
      setFs(!fs)
      return
    }
    
    document.exitFullscreen()
    setFs(!fs)
  }

  return (
    <div className={`sbo sidebar ${blur ? "blur" : ""}`}>
      <div className="sbt button list opac">
        <a id="game-page-btn" 
          className="item nav-button desktop-button"
          style={game ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "game")}
        >
          <i className="ti ti-device-gamepad" />
        </a>
        <a id="draw-page-btn" 
          className="item nav-button desktop-button"
          style={draw ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "draw")}
        >
          <i className="ti ti-pencil" />
        </a>
        <a id="chat-page-btn"
          className="item nav-button desktop-button"
          style={chat ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "chat")}
        >
          <i className="ti ti-message" />
        </a>
        <a id="block-page-btn"
          className="item nav-button desktop-button"
          style={block ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "block")}
        >
          <i className="ti ti-forbid-2" />
        </a>
        <a id="music-page-btn"
          className="item nav-button desktop-button"
          style={music ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "music")}
        >
          <i className="ti ti-music" />
        </a>
        <a id="background-page-btn"
          className="item nav-button desktop-button"
          style={bg ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "bg")}
        >
          <i className="ti ti-polaroid" />
        </a>
        <a id="dm-page-btn"
          className="item nav-button desktop-button"
          style={dm ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "dm")}
        >
          <i className="ti ti-messages" />
        </a>
        <a id="voicechat-page-btn"
          className="item nav-button desktop-button"
          style={vc ? {backgroundColor: 'rgba(255,255,255,0.1)'} : {}}
          onClick={() => setCookieValue("btn", "vc")}
        >
          <i className="ti ti-microphone" />
        </a>
        <a id="fullscreen-btn"
          className="item nav-button desktop-button"
          onClick={() => fsHandler()}
        >
          <i className="ti ti-arrows-maximize" />
        </a>
      </div>
    </div>
  );
}