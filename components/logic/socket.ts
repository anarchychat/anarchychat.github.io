import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"

const prod = process.env.NODE_ENV === 'production'

if (!prod) {
  console.log("Development Mode")
  var domain = "http://localhost:3000"
} else {
  console.log("Production Mode")
  //var domain = "https://anarchychats.com"
  var domain = "http://localhost:3000"
}
  
console.log(domain)

export const socketio_chat: Socket = io(domain, {
  transports: ["websocket"],
  path: "/socketio_chat/",
  autoConnect: true
})

export const socketio_dm: Socket = io(domain, {
  transports: ["websocket"],
  path: "/socketio_dm/",
  autoConnect: true
})


export const socketio_vc: Socket = io(domain, {
  transports: ["websocket"],
  path: "/socketio_vc/",
  autoConnect: true
})

/*
export const socketio_dvc: Socket = io(domain, {
  transports: ["websocket"],
  path: "/socketio_dvc/",
  autoConnect: true
})
*/

export const socketio_draw: Socket = io(domain, {
  transports: ["websocket"],
  path: "/socketio_draw/",
  autoConnect: true
})
