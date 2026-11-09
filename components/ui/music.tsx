import { useState, useRef, useEffect } from 'react'
import * as cookie from "@/components/logic/cookie"

// Use sample music from here: https://samplelib.com/sample-mp3.html

export default function Music({
  music, savedMusicInput, blur, setCookieValue
}: {
  music: boolean,
  savedMusicInput: string,
  blur: boolean,
  setCookieValue: (name: string, value: string) => void,
}) {
  const [volume, setVolume] = useState(false)
  const [volumeNum ,setVolumeNum] = useState(50)
  const [play, setPlay] = useState(false)
  const [musicInput, setMusicInput] = useState("")
  const [spotifyInput, setSpotifyInput] = useState("")
  const [spotifyFrame, setSpotifyFrame] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTimeMin, setTotalTimeMin] = useState("0")
  const [currentTimeMin, setCurrentTimeMin] = useState("0")
  const [totalTimeSec, setTotalTimeSec] = useState("00")
  const [currentTimeSec, setCurrentTimeSec] = useState("00")
  const [trackName, setTrackName] = useState("")
  const [isMusicChanged, setIsMusicChanged] = useState(false)
  const musicRef = useRef<HTMLInputElement>(null)
  const musicPlayer = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (cookie.getCookie("music")) {
      onMusicChange(cookie.getCookie("music") as string)
    }
  }, [])

  function onMusicChange(url: string) {
    console.log("MUSIC RUNNING CHANGE")
    var newUrl = url

    if (newUrl.includes("https://")) {
      console.log("https: ", url)
      newUrl = url.replace('https://', '')
    }
    if (newUrl.includes("http://")) {
      console.log("http: ", url)
      newUrl = url.replace('http://', '')
    }

    if (newUrl.includes("spotify.com")) {
      if (!newUrl.includes("embed")) {
        console.log("no embed")
        const find = newUrl.indexOf("/")
        const res = newUrl.substring(0, find) + "/embed" + 
          newUrl.substring(find)
        console.log("res: ", res)
        setSpotifyInput(res)
      }
      setCookieValue("music", newUrl)
      setMusicInput("")
      setTrackName("")
      setTotalTimeMin("0")
      setCurrentTimeMin("0")
      setTotalTimeSec("00")
      setCurrentTimeSec("00")
      setSpotifyFrame(true)
      return
    }

    setSpotifyInput("")
    setCookieValue("music", newUrl)
    setMusicInput(newUrl)

    const fileName = newUrl.substring(newUrl.lastIndexOf("/") + 1, 
      newUrl.length)
    console.log("fileName: ", fileName)
    setTrackName(fileName)
    setSpotifyFrame(false)
    setIsMusicChanged(true)
  }

  function player() {
    setPlay(!play)

    if (!musicPlayer.current) return

    if (play) {
      musicPlayer.current.play()
      return
    }

    musicPlayer.current.pause()
  }

  function handleVolume(e: number) {
    setVolumeNum(e)

    if (musicPlayer.current) {
      musicPlayer.current.volume = volumeNum / 100
    }
  }

  function changePlayerTime(newCurrent: number) {
    setCurrentTime(newCurrent)

    if (musicPlayer.current) {
      musicPlayer.current.currentTime = newCurrent
    }

    handleTime(newCurrent, totalTime)
  }

  const timeUpdateHandler = (e: React.ChangeEvent<HTMLAudioElement>) => {
    const current = e.target.currentTime
    const duration = e.target.duration

    handleTime(current, duration)
  }

  function handleTime(current: number, duration: number) {
    var roundedCurrent = Math.floor(current)
    var roundedDuration = Math.floor(duration)

    console.log("roundedCurrent: ", roundedCurrent)
    console.log("roundedDuration: ", roundedDuration)

    if (roundedCurrent === currentTime
      && !isMusicChanged
    ) {
      console.log("Same, not continuing.")
      return
    }

    setIsMusicChanged(false)
    setCurrentTime(roundedCurrent)
    setTotalTime(roundedDuration)

    var currentMin = 0
    while (roundedCurrent > 59) {
      roundedCurrent -= 60
      currentMin++
      console.log("currentMin: ", currentMin)
    }
    var durationMin = 0
    while (roundedDuration > 59) {
      roundedDuration -= 60
      durationMin++
      console.log("durationMin: ", durationMin)
    }

    var stringCurrent: string = roundedCurrent.toString()
    var stringDuration: string = roundedDuration.toString()
    if (roundedCurrent < 10) {
      stringCurrent = "0" + roundedCurrent
    }
    if (roundedDuration < 10) {
      stringDuration = "0" + roundedDuration
    }

    setCurrentTimeSec(stringCurrent)
    setTotalTimeSec(stringDuration)
    setCurrentTimeMin(currentMin.toString())
    setTotalTimeMin(durationMin.toString())
  }

  return (
    <div id="music-page" 
      className={`music-page ${blur ? "blur" : ""} ${music ? "active" : ""}`}
      tabIndex={music ? 0 : -1} 
      inert={!music}
    >
      <div className="innerMusicPage">
        <div className="music-container">
          <div className="music-player">
            <div className="top-buttons">
              <i 
                className="btn volume ti ti-volume"
                onClick={() => setVolume(!volume)}
              />
              {volume ? (
              <div className={`${blur ? "blur" : ""} volume-slider`}>
                <input 
                  type="range" 
                  min={0}
                  max={100} 
                  value={volumeNum}
                  onChange={(event) => handleVolume(event.target.valueAsNumber)}
                  className="slider" 
                  id="myRange"
                />
              </div>
              ):(<></>)
              }
            </div>

            <div className="track-name">
              {trackName}
            </div>

            <div className={`${blur ? "blur" : ""} time-slider`}>
              <input 
                type="range" 
                min={0}
                max={totalTime}
                value={currentTime}
                onChange={(event) => changePlayerTime(event.target.valueAsNumber)}
                className="slider" 
                id="myRange"
              />
            </div>

            <div className="time">
              <span className="current-time">
                {currentTimeMin}:{currentTimeSec}
              </span>
              <span className="total-duration">
                {totalTimeMin}:{totalTimeSec}
              </span>
            </div>

            <div className="bottom-buttons">
              <i 
                className={`btn play-pause ti ${ play ? "ti-player-play" : "ti-player-pause" }`} 
                onClick={() => player()}
              />
            </div>
          </div>

          {musicInput && (
            <audio
              onLoadedMetadata={timeUpdateHandler}
              onTimeUpdate={timeUpdateHandler}
              src={`https://${musicInput}`}
              ref={musicPlayer}
            ></audio>
          )}

          <input
            className="url-music music-ib"
            placeholder="Music URL" 
            ref={musicRef}
            value={savedMusicInput}
            onChange={(e) => onMusicChange(e.target.value)}
          />
        </div>

        <div className="spotify">
          {spotifyFrame && (
            <iframe
              className="spotify-iframe" 
              src={`https://${spotifyInput}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}