import { useState, useRef } from 'react'

export default function Music({
  music
}: {
  music: boolean
}) {
  const [volume, setVolume] = useState(false);
  const [play, setPlay] = useState(false);
  const [input, setInput] = useState("");
  const [spotifyFrame, setSpotifyFrame] = useState(false);
  const spotify = useRef<HTMLDivElement>(null);
  
  function onMusicChange(e: string) {
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

    if (url.includes("spotify.com")) {
      setSpotifyFrame(true);
      return
    }

    setSpotifyFrame(false);
  }

  return (
    <div id="music-page" 
      className={`music-page blur ${music ? "active" : ""}`}
      tabIndex={music ? 0 : -1} 
      inert={!music}
    >
      <div className="innerMusicPage">
        <div className="music-container">
          <div className="music-player">
            <div className="buttons">
              <i 
                className="btn volume ti ti-volume"
                onClick={() => setVolume(!volume)}
              />
              {volume ? (
              <div className="blur volume-slider">
                <input 
                  type="range" 
                  min="0"
                  max="100" 
                  defaultValue={0}
                  className="slider" 
                  id="myRange"
                />
              </div>
              ):(<></>)
              }
            </div>

            <div className="track-name">
              Track Name
            </div>

            <div className="blur time-slider">
              <input 
                type="range" 
                min="0"
                max="100" 
                defaultValue={80}
                className="slider" 
                id="myRange"
              />
            </div>

            <div className="time">
              <span className="current-time">
                5:48
              </span>
              <span className="total-duration">
              0:00
              </span>
            </div>

            <div className="buttons">
              <i 
                className={`btn play-pause ti ${ play ? "ti-player-pause" : "ti-player-play" }`} 
                onClick={() => setPlay(!play)}
              />
            </div>
          </div>

          <audio id="audioPlayer" />

          <input
            className="url-music music-ib"
            placeholder="Music URL" 
            onChange={(e) => onMusicChange(e.target.value)}
          />
        </div>

        <div className="spotify">
          {spotifyFrame && (
            <iframe className="gameURL" src={`https://${input}`}></iframe>
          )}
        </div>
      </div>
    </div>
  );
}