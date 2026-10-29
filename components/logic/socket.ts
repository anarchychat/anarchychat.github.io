import { io } from "socket.io-client";

const prod = process.env.NODE_ENV === 'production'

if (!prod) {
  console.log("Development Mode")
  var domain = "http://localhost:3000"
  //var domain = "193.181.219.45"
} else {
  console.log("Production Mode")
  var domain = "https://anarchychats.com"
}
  
export const socketio_chat = io(domain, {
  transports: ["websocket"],
  path: "/socketio_chat/",
  autoConnect: true
});

export const socketio_dm = io(domain, {
  transports: ["websocket"],
  path: "/socketio_dm/",
  autoConnect: true
});


export const socketio_vc = io(domain, {
  transports: ["websocket"],
  path: "/socketio_vc/",
  autoConnect: true
});

/*
export const socketio_dvc = io(domain, {
  transports: ["websocket"],
  path: "/socketio_dvc/",
  autoConnect: true
});
*/

export const socketio_draw = io(domain, {
  transports: ["websocket"],
  path: "/socketio_draw/",
  autoConnect: true
});