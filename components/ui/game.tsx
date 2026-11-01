import {useState} from "react"

export default function Game({
  game, blur
}: {
  game: boolean,
  blur: boolean
}) {
  const [gameFrame, setGameFrame] = useState(false);
  const [input, setInput] = useState("");

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
    
    setInput(url);

    if (e === "") {
      setGameFrame(false)
      return
    }

    setGameFrame(true)
  }

  return (
      <div id="game-page" 
        className={`game-page ${blur ? "blur" : ""} ${game ? "active" : ""}`} 
        tabIndex={game ? 0 : -1}
        inert={!game}
      >
        <div id="gamePage" className="gamePageClass active">
          <form className="margins">
            <input 
              className="gameURL" 
              type="text" 
              id="gameURL" 
              name="gameURL" 
              placeholder="Game URL"
              value={input}
              onChange={(e) => onGameChange(e.target.value)}
            />
          </form>
          <div id="gameFrame">
            {gameFrame && (
              <iframe 
                className="gameURL" 
                src={`https://${input}`}
              />
            )}
          </div>
        </div>
      </div>
  );
}