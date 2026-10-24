export default function Music({
  music
}: {
  music: boolean
}) {
  return (
    <div id="music-page" 
      className={`music-page blur ${music ? "active" : ""}`}
      tabIndex={music ? 0 : -1} 
      inert={!music}
    >
      <div className="innerMusicPage">
        <div className="music-player">
          <div className="track-name" id="trackName">
            Track Name
          </div>
          <div className="buttons">
          <i 
            id="playPauseBtn" 
            className="ti ti-player-pause" 
          />
          </div>

          <div className="blur sliderbox">
            <div className="slidecontainer">
              <input 
                type="range" 
                min="0"
                max="100" 
                defaultValue={0}
                className="slider" 
                id="myRange"
              />
            </div>
          </div>

          <div className="time">
            <span id="currentTime">
              05:48
            </span>
              /
            <span id="totalDuration">
             00:00
            </span>
          </div>

          <div className="blur sliderbox">
            <div className="slidecontainer">
              <input 
                type="range" 
                min="0"
                max="100" 
                defaultValue={80}
                className="slider" 
                id="myRange"
              />
            </div>
          </div>
        </div>

        <audio id="audioPlayer" />

        <input
          id="url-music" 
          className="music-ib"
          placeholder="Music URL" 
        />
      </div>
      <div id="spotify" />
    </div>
  );
}