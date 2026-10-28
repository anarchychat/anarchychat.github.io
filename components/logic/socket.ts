import { io } from "socket.io-client";

const prod = process.env.NODE_ENV === 'production'
//const prod = false

if (!prod) {
  console.log("Development Mode")
  var domain = "http://localhost"
} else {
  console.log("Production Mode")
  var domain = "https://anarchychats.com"
  //var domain = "http://213.188.198.174"
}

function port(num: string) {
  if (!prod) {
    return num
  }

  //return ""
  return num
}
  
export const socketio_chat = io(domain + port(":10000"), {
  transports: ["websocket"],
  path: "/socketio_chat/",
  autoConnect: true
});

export const socketio_dm = io(domain + port(":10001"), {
  transports: ["websocket"],
  path: "/socketio_dm/",
  autoConnect: true
});


export const socketio_vc = io(domain + port(":10002"), {
  transports: ["websocket"],
  path: "/socketio_vc/",
  autoConnect: true
});

/*
export const socketio_dvc = io(domain + port(":10003"), {
  transports: ["websocket"],
  path: "/socketio_dvc/",
  autoConnect: true
});
*/

export const socketio_draw = io(domain + port(":10004"), {
  transports: ["websocket"],
  path: "/socketio_draw/",
  autoConnect: true
});