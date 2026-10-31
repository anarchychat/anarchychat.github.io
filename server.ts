import { createServer } from "http"
import next from "next"
import { Server } from "socket.io"

import { registerChat } from "./chat"
import { registerDraw } from "./draw"
import { registerDm } from "./dm"
import { registerVc } from "./vc"

const prod = process.env.NODE_ENV === 'production'

// Make this file NOT print console logs
if (prod) {
  console.log = function() {}
}

const dev = process.env.NODE_ENV !== "production"

var hostname = "0.0.0.0"
if (dev) {
  hostname = "127.0.0.1"
}

const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const httpServer = createServer((req, res) => {
  handle(req, res)
})

const socketOptions = {  
  transports: ["websocket" as const],  
  cors: {    
    origin: "*",    
    methods: ["GET", "POST"],  
  },
};

export const io_chat = new Server(httpServer, {  
  ...socketOptions,  
  path: "/socketio_chat/",
});
export const io_draw = new Server(httpServer, {  
  ...socketOptions,  
  path: "/socketio_draw/",
});
export const io_dm = new Server(httpServer, {  
  ...socketOptions,  
  path: "/socketio_dm/",
});
export const io_vc = new Server(httpServer, {  
  ...socketOptions,  
  path: "/socketio_vc/",
});

registerChat(io_chat)
registerDraw(io_draw)
registerDm(io_dm)
registerVc(io_vc)
  
async function start() {
  await app.prepare().then(() => {
    httpServer.listen(port, hostname)
    
    console.log(
      `> Server listening at http://${hostname}:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`
    )
  })
}

start().catch((error) => {  
  console.error("Failed to start server:", error)
  process.exit(1)
})