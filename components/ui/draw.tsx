import { useRef, useState, useEffect, useCallback } from "react"
import { getRandomDigit, getRandomColor } from "../logic/userInfo"
import { socketio_draw } from "../logic/socket"

var cancelled = false

export default function Draw({
  draw
}: {
  draw: boolean
}) {
  const WIDTH = 1920
  const HEIGHT = 720
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState("#000000")
  const [eraser, setEraser] = useState(false)
  const [neon, setNeon] = useState(false)
  const [slider, setSlider] = useState<number>(10)
  const [drawMode, setDrawMode] = useState(false)
  const [yourName, setYourName] = useState("Guest")
  const [drawings, setDrawings] = useState<{
    username: string,
    data: string
  }[]>([]);
  type Coordinate = { x: number; y: number; };
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  var j = 0;

  function isEvent(x: any) {
    if (x.type === "touchstart"
    || x.type === "touchend" || x.type === "touchcancel"
    || x.type === "touchmove") {
      return true
    }
  }

  const startPaint = useCallback((event: MouseEvent | TouchEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  const getCoordinates = (event: MouseEvent | TouchEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (isEvent(event)) {
      event = event as TouchEvent
      console.log("TOUCH MODE")
      return {
        x: Math.floor(  ((event.touches[0].clientX - rect.left - canvas.clientLeft) / canvas.clientWidth) *    canvas.width),
        y: Math.floor(  ((event.touches[0].clientY - rect.top - canvas.clientTop) / canvas.clientHeight) *    canvas.height)
      }
    }

    event = event as MouseEvent
    console.log("MOUSE MODE")
    return { 
      x: Math.floor(  ((event.clientX - rect.left - canvas.clientLeft) / canvas.clientWidth) *    canvas.width),
      y: Math.floor(  ((event.clientY - rect.top - canvas.clientTop) / canvas.clientHeight) *    canvas.height)
    };
  };

  const paint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current
    const context = canvas.getContext('2d')
    if (context) {
      context.strokeStyle = color
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
        context.shadowColor = color
        context.shadowBlur = slider * 1.5
      }

      context.beginPath()
      context.moveTo(originalMousePosition.x, originalMousePosition.y)
      context.lineTo(newMousePosition.x, newMousePosition.y)
      context.closePath()

      context.stroke()
    }
  };

  const exitPaint = useCallback(() => {
      setIsPainting(false);
  }, []);

  useEffect(() => {
    if (!cancelled) {
      setColor(getRandomColor());
      setYourName("Guest" + getRandomDigit());
    }
    if (!canvasRef.current) {
      return;
    }

    socketio_draw.on("connect", () => {
      console.log("Client connected:", socketio_draw.id);
      socketio_draw.emit("log");
    });

    socketio_draw.on("new drawing", (username, message) => {
      console.log("Receiving message1: " + username + ": " + message)
      addDraw(username, message);
    });

    socketio_draw.on('log', (data) => {
      setDrawings([]);
      console.log("Receiving logs: " + data);
      addDrawLog(data);
    });

    socketio_draw.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    socketio_draw.on('disconnect', () => {
      console.log("Disconnected");
    });

    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint)
    canvas.addEventListener('mousemove', paint)
    canvas.addEventListener('mouseup', exitPaint)
    canvas.addEventListener('mouseleave', exitPaint)
    canvas.addEventListener('touchstart', startPaint)
    canvas.addEventListener('touchmove', paint)
    canvas.addEventListener('touchend', exitPaint)
    canvas.addEventListener('touchcancel', exitPaint)

    return () => {
      cancelled = true;
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
      canvas.removeEventListener('touchstart', startPaint)
      canvas.removeEventListener('touchmove', paint)
      canvas.removeEventListener('touchend', exitPaint)
      canvas.removeEventListener('touchcancel', exitPaint)
        socketio_draw.off();
    }
  }, [socketio_draw, color, startPaint, paint, exitPaint]) 

  function clearCanvas() {
    console.log("clear");
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (yourName != "") {
      socketio_draw.emit("new message", yourName);
    }
  }

  function addDraw(username: string, data: string) {
    console.log("Receiving message2: " + username + ": " + data)
    setDrawings((current) => [...current, 
      {username: username, data: data}
    ])
  }

  function addDrawLog(data: any) {
    data.forEach((prop: any) => {
      setDrawings((current) => [...current, 
        {username: prop.username, data: prop.data}
      ])
    })
  }
  
  function sendDraw() {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      socketio_draw.emit("new drawing", yourName, dataUrl)
    }
  }

  return (
    <div id="draw-page" 
      className={`draw-page blur ${draw ? "active" : ""}`} 
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
              onChange={(e) => setYourName(e.target.value)} 
              type="text" 
              id="chat-nme" 
              placeholder="Name" 
              size={58}
              autoComplete="off"
            />
            <button
              id="chat-colorpicker-home" 
              className="ti ti-palette"
              style={{
                color: color,
              }}
              onClick={() => setColor(getRandomColor())}
            />
          </form>
        </div>
        <div className="middle">
          <div className="header">
            Drawings
          </div>
          <div className="hold-list">
            {drawings.map((drawing) => (
              <li key={j += 1} className="drawing-landscape">
                <p>
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
              className="add spacing-margin blur ti ti-plus"
              onClick={() => setDrawMode(true)}
            />
          </div>
        </div>
      </div>

      <div 
        className={`draw drawClass ${drawMode ? `active` : ""}`} 
        id="firstDrawServer" 
      >
        <div className="top-row">
          <form id="draw-name-home" onSubmit={handleSubmit}>
            <input
              value={yourName}
              onChange={(e) => setYourName(e.target.value)} 
              type="text" 
              id="chat-nme" 
              placeholder="Name" 
              size={58}
              autoComplete="off"
            />
            <button
              id="chat-colorpicker-home" 
              className="ti ti-palette"
              style={{
                color: color,
              }}
              onClick={() => setColor(getRandomColor())}
            />
          </form>
        </div>
        <div className="top-row colors">
          <div className="left-side">
            <button
              className="colorpicker-draw"
              style={{
                backgroundColor: color,
              }}
              onClick={() => setColor(getRandomColor())}
            />
            <button
              className={`eraser blur ti ${eraser ? `ti-pencil` : `ti-eraser`}`}
              onClick={() => setEraser(!eraser)}
            />
            <button
              className={`neon blur ${neon ? `on`: ""}`}
              onClick={() => setNeon(!neon)}
            >
              Neon
            </button>
            <div className="blur sliderbox">
              <div className="slidecontainer">
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
            </div>
          </div>
          <div className="right-side">
            <button 
              className="blur wipe ti ti-trash-x"
              onClick={() => clearCanvas()}
            >
            </button>
          </div>
        </div>

        <div className="middle-whiteboard">
          <canvas
            className="whiteboard"
            width={WIDTH}
            height={HEIGHT}
            ref={canvasRef}
          />
        </div>

        <div className="bottom-row">
          <div className="left-side">
            <button 
              className="backarrow blur ti ti-logout"
              onClick={() => setDrawMode(false)}
            />
          </div>
          <div className="right-side">
            <button
              className="checkmark blur ti ti-check"
              onClick={function() { sendDraw(); setDrawMode(false) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}