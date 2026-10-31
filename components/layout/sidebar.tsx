import {useState} from "react"

export default function Sidebar({
  setGame, setDraw, setChat, setBlock,
  setMusic, setBg, setDm, setVc
}: {
  setGame: () => void;
  setDraw: () => void;
  setChat: () => void;
  setBlock: () => void;
  setMusic: () => void;
  setBg: () => void;
  setDm: () => void;
  setVc: () => void;
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
    return
  }

  return (
    <div className="sbo sidebar blur">
      <div className="sbt button list opac">
        <a id="game-page-btn" 
          className="item nav-button desktop-button"
          onClick={() => setGame()}
        >
          <i className="ti ti-device-gamepad" />
        </a>
        <a id="draw-page-btn" 
          className="item nav-button desktop-button"
          onClick={() => setDraw()}
        >
          <i className="ti ti-pencil" />
        </a>
        <a id="chat-page-btn"
          className="item nav-button desktop-button"
          onClick={() => setChat()}
        >
          <i className="ti ti-message" />
        </a>
        <a id="block-page-btn"
          className="item nav-button desktop-button"
          onClick={() => setBlock()}
        >
          <i className="ti ti-forbid-2" />
        </a>
        <a id="music-page-btn"
          className="item nav-button desktop-button"
          onClick={() => setMusic()}
        >
          <i className="ti ti-music" />
        </a>
        <a id="background-page-btn"
          className="item nav-button desktop-button"
          onClick={() => setBg()}
        >
          <i className="ti ti-polaroid" />
        </a>
        <a id="dm-page-btn"
          className="item nav-button desktop-button"
          onClick={() => setDm()}
        >
          <i className="ti ti-messages" />
        </a>
        <a id="voicechat-page-btn"
          className="item nav-button desktop-button"
          onClick={() => setVc()}
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