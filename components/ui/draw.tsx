import { SetStateAction, Dispatch, useRef, useState, useEffect, useCallback } from "react"
import { getRandomDigit, getRandomColor } from "../logic/userInfo"
import { socketio_draw } from "../logic/socket"

var cancelled = false

export default function Draw({
  draw, blur, blockData, yourName, color, setCookieValue
}: {
  draw: boolean,
  blur: boolean,
  blockData: string[],
  yourName: string,
  color: string,
  setCookieValue: (name: string, value: string) => void,
}) {
  const WIDTH = 1920
  const HEIGHT = 720
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [eraser, setEraser] = useState(false)
  const [neon, setNeon] = useState(false)
  const [slider, setSlider] = useState<number>(10)
  const [drawMode, setDrawMode] = useState(false)
  const [drawings, setDrawings] = useState<{
    username: string,
    color: string,
    data: string
  }[]>([])
  type Coordinate = { x: number; y: number }
  const [drawColor, setDrawColor] = useState("#000000")
  const [isPainting, setIsPainting] = useState(false)
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined)

  function isTouchEvent(event: MouseEvent | TouchEvent) {
    if (event.type === "touchstart"
    || event.type === "touchend" 
    || event.type === "touchcancel"
    || event.type === "touchmove") {
      return true
    }
  }

  const startPaint = useCallback((event: MouseEvent | TouchEvent) => {
    const coordinates = getCoordinates(event)
    if (coordinates) {
      setIsPainting(true)
      setMousePosition(coordinates)
    }
  }, [])

  const getCoordinates = (event: MouseEvent | TouchEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return
    }

    const canvas: HTMLCanvasElement = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    if (isTouchEvent(event)) {
      event = event as TouchEvent
      console.log("TOUCH MODE")
      return {
        x: ((event.touches[0].clientX - rect.left)
          / canvas.clientWidth)
          * canvas.width,
        y: ((event.touches[0].clientY - rect.top)
          / canvas.clientHeight)
          * canvas.height
      }
    }

    event = event as MouseEvent
    console.log("MOUSE MODE")
    return { 
      x: ((event.clientX - rect.left)
        / canvas.clientWidth)
        * canvas.width,
      y: ((event.clientY - rect.top)
        / canvas.clientHeight)
        * canvas.height
    }
  }

  const paint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event)
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition)
          setMousePosition(newMousePosition)
        }
      }
    },
    [isPainting, mousePosition]
  )

  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) {
      return
    }

    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    if (context) {
      context.strokeStyle = drawColor
      context.lineJoin = 'round'
      context.lineWidth = slider
      context.globalCompositeOperation = "source-over"
      context.shadowColor = "transparent"
      context.shadowBlur = 0

      if (eraser) {
        context.shadowBlur = 0
        context.globalCompositeOperation = "destination-out"
      }
      if (neon && !eraser) {
        context.shadowColor = drawColor
        context.shadowBlur = slider * 1.5
      }

      context.beginPath()
      context.moveTo(originalMousePosition.x, originalMousePosition.y)
      context.lineTo(newMousePosition.x, newMousePosition.y)
      context.closePath()

      context.stroke()
    }
  }

  const exitPaint = useCallback(() => {
      setIsPainting(false)
  }, [])

  useEffect(() => {
    if (!cancelled) {
      setDrawColor(getRandomColor())
    }
    if (!canvasRef.current) {
      return
    }

    // Properly make client disconnect on page refresh 
    const onBeforeUnload = () => {
      socketio_draw.disconnect()
    }
    window.addEventListener("beforeunload", onBeforeUnload)

    socketio_draw.on("connect", () => {
      console.log("Client connected:", socketio_draw.id)
      socketio_draw.emit("log")
    })

    socketio_draw.on("new drawing", (username, color, message) => {
      console.log("Receiving message1: " + username + ": " + message + " " + color)
      addDraw(username, color, message)
    })

    socketio_draw.on('log', (data) => {
      setDrawings([])
      console.log("Receiving logs: " + data)
      addDrawLog(data)
    })

    socketio_draw.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message)
    })

    socketio_draw.on('disconnect', () => {
      console.log("Disconnected")
    })

    const canvas: HTMLCanvasElement = canvasRef.current
    canvas.addEventListener('mousedown', startPaint)
    canvas.addEventListener('mousemove', paint)
    canvas.addEventListener('mouseup', exitPaint)
    canvas.addEventListener('mouseleave', exitPaint)
    canvas.addEventListener('touchstart', startPaint)
    canvas.addEventListener('touchmove', paint)
    canvas.addEventListener('touchend', exitPaint)
    canvas.addEventListener('touchcancel', exitPaint)

    return () => {
      cancelled = true
      canvas.removeEventListener('mousedown', startPaint)
      canvas.removeEventListener('mousemove', paint)
      canvas.removeEventListener('mouseup', exitPaint)
      canvas.removeEventListener('mouseleave', exitPaint)
      canvas.removeEventListener('touchstart', startPaint)
      canvas.removeEventListener('touchmove', paint)
      canvas.removeEventListener('touchend', exitPaint)
      canvas.removeEventListener('touchcancel', exitPaint)
      socketio_draw.off()
    }
  }, [socketio_draw, color, drawColor, startPaint, paint, exitPaint]) 

  function clearCanvas() {
    console.log("clear")
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (yourName != "") {
      socketio_draw.emit("new message", yourName)
    }
  }

  function addDraw(username: string, color: string, data: string) {
    console.log("Receiving message2: " + username + ": " + data)
    setDrawings((current) => [
      {username: username, color: color, data: data},
      ...current
    ])
  }

  function addDrawLog(data: any) {
    data.forEach((prop: any) => {
      setDrawings((current) => [
        {username: prop.username, color: prop.color, data: prop.data},
        ...current
      ])
    })
  }
  
  function sendDraw() {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      socketio_draw.emit("new drawing", yourName, color, dataUrl)
    }
  }

  function blockInArray(item: {username: string}) {
    for (const blockedUsername of blockData) {
      if (item.username === blockedUsername) {
        console.log("EQUAL")
        return false
      }
    }
    console.log("NOT EQUAL")
    return true
  }

  return (
    <div id="draw-page" 
      className={`draw-page ${blur ? "blur" : ""} ${draw ? "active" : ""}`} 
      tabIndex={draw ? 0 : -1}
      inert={!draw}
    >
      <div
        className={`viewdrawings ${drawMode ? "" : 'active'}`}
      >
        <div className="top-row">
          <form id="draw-name-home" onSubmit={handleSubmit}>
            <input
              value={yourName}
              onChange={(e) => setCookieValue("name", e.target.value)} 
              type="text" 
              id="home-draw-nme" 
              placeholder="Name" 
              size={58}
              autoComplete="off"
            />
            <button
              id="home-draw-colorpicker" 
              className="ti ti-palette"
              style={{
                color: color,
              }}
              onClick={() => setCookieValue("color", getRandomColor())}
            />
          </form>
        </div>
        <div className="middle">
          <div className="header">
            Drawings
          </div>
          <div className="hold-list">
            {drawings.filter(username => blockInArray(username)).map((drawing, i) => (
              <li key={i} className="drawing-landscape">
                <p style={{color: drawing.color}}>
                  {drawing.username}
                </p>
                <img 
                  src={drawing.data} 
                  width="80%"
                  className="drawing-border"
                />
              </li>
            ))}
          </div>
        </div>
        <div className="bottom-row">
          <div className="right-side">
            <button 
              className={`add spacing-margin ${blur ? "blur" : ""} ti ti-plus`}
              onClick={() => setDrawMode(true)}
            />
          </div>
        </div>
      </div>

      <div 
        className={`draw drawClass ${drawMode ? `active` : ""}`} 
        id="firstDrawServer" 
      >
        <div className="row">
          <form id="draw-name-home" onSubmit={handleSubmit}>
            <input
              value={yourName}
              onChange={(e) => setCookieValue("name", e.target.value)} 
              type="text" 
              id="draw-nme" 
              placeholder="Name" 
              size={58}
              autoComplete="off"
            />
            <button
              id="draw-colorpicker" 
              className="ti ti-palette"
              style={{
                color: color,
              }}
              onClick={() => setCookieValue("color", getRandomColor())}
            />
          </form>
        </div>
        <div className="row colors">
          <button
            className="colorpicker-draw"
            style={{
              backgroundColor: drawColor,
            }}
            onClick={() => setDrawColor(getRandomColor())}
          />
          <button
            className={`eraser blur ti ${eraser ? `ti-pencil` : `ti-eraser`}`}
            onClick={() => setEraser(!eraser)}
          />
          <button
            className={`neon ${blur ? "blur" : ""} ${neon ? `on`: ""}`}
            onClick={() => setNeon(!neon)}
          >
            Neon
          </button>
          <div className={`${blur ? "blur" : ""} sliderbox`}>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={slider} 
              onChange={(event) => setSlider(event.target.valueAsNumber)}
              className="slider" 
              id="myRange"
            />
          </div>
          <button 
            className={`${blur ? "blur" : ""} wipe ti ti-trash-x`}
            onClick={() => clearCanvas()}
          />
        </div>

        <div className="middle-whiteboard">
          <canvas
            className="whiteboard"
            width={WIDTH}
            height={HEIGHT}
            ref={canvasRef}
          />
        </div>

        <div className="row">
          <button 
            className={`backarrow ${blur ? "blur" : ""} ti ti-logout`}
            onClick={() => setDrawMode(false)}
          />
          <button
            className={`checkmark ${blur ? "blur" : ""} ti ti-check`}
            onClick={function() { sendDraw(); setDrawMode(false) }}
          />
        </div>
      </div>
    </div>
  )
}