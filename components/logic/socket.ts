import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"

const prod = process.env.NODE_ENV === 'production'
export var domain = ""
var http = ""

if (!prod) {
  console.log("Development Mode")
  domain = "localhost:3000"
  http = "http"
} else {
  console.log("Production Mode")
  domain = "anarchychats.com"
  http = "https"
}
  
console.log(domain)

export const socketio_chat: Socket = io(http + "://" + domain, {
  transports: ["websocket"],
  path: "/socketio_chat/",
  autoConnect: true
})

export const socketio_dm: Socket = io(http + "://" + domain, {
  transports: ["websocket"],
  path: "/socketio_dm/",
  autoConnect: true
})


export const socketio_vc: Socket = io(http + "://" + domain, {
  transports: ["websocket"],
  path: "/socketio_vc/",
  autoConnect: true
})

/*
export const socketio_dvc: Socket = io(http + "://" + domain, {
  transports: ["websocket"],
  path: "/socketio_dvc/",
  autoConnect: true
})
*/

export const socketio_draw: Socket = io(http + "://" + domain, {
  transports: ["websocket"],
  path: "/socketio_draw/",
  autoConnect: true
})
