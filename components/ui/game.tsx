import {useState} from "react"

export default function Game({
  game
}: {
  game: boolean
}) {
  const [gameFrame, setGameFrame] = useState(false);
  const [input, setInput] = useState("");

  function onGameChange(e: string) {
    setInput(e);
    setGameFrame(true);
  }

  return (
      <div id="game-page" 
        className={`game-page blur ${game ? "active" : ""}`} 
        tabIndex={game ? 0 : -1}
        inert={!game}
      >
        <div id="gamePage" className="gamePageClass active">
          <form>
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
              <iframe className="gameURL" src={`https://${input}`}></iframe>
            )}
          </div>
        </div>
      </div>
  );
}