import {useState} from "react"

export default function Game({
  game, blur, gameInput, setCookieValue
}: {
  game: boolean,
  blur: boolean,
  gameInput: string,
  setCookieValue: (name: string, value: string) => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);

  function onGameChange(e: string) {
    var url = e

    if (url.includes("https://")) {
      console.log("https: ", e)
      url = e.replace('https://', '')
    }
    if (url.includes("http://")) {
      console.log("http: ", e)
      url = e.replace('http://', '')
    }
    
    setCookieValue("game", url);
  }

  function gameFullscreen() {
    setFullscreen(!fullscreen)

    if (!fullscreen) {
      console.log("run")


    }
  }

  return (
      <div id="game-page" 
        className={`game-page ${blur ? "blur" : ""} 
          ${game ? "active" : ""}`} 
        tabIndex={game ? 0 : -1}
        inert={!game}
      >
        <div id="gamePage" className="gamePageClass active">
          <form className="margins">
            <input 
              className="game-url" 
              type="text" 
              name="gameURL" 
              placeholder="Game URL"
              value={gameInput}
              onChange={(e) => onGameChange(e.target.value)}
            />
          </form>
          {gameInput && (
            <div className="game-frame">
              <iframe 
                className={`game-iframe ${fullscreen ? 'game-fs' : ''}`}
                src={`https://${gameInput}`}
              />
              <div className="game-row">
                <button
                  className={`game-fullscreen ti ti-arrows-maximize
                    ${fullscreen ? 'game-fs-button' : ''}`}
                  onClick={() => gameFullscreen()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
  );
}