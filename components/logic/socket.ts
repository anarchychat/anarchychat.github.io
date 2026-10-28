import { io } from "socket.io-client";

const prod = process.env.NODE_ENV === 'production'

if (!prod) {
  console.log("Development Mode")
  var domain = "http://localhost"
} else {
  console.log("Production Mode")
  var domain = "https://anarchychats.com"
}

function port(num: string) {
  if (!prod) {
    return num
  }

  return ""
}
  
export const socketio_chat = io(domain + port(":5000"), {
  transports: ["websocket"],
  path: "/socketio_chat/",
  autoConnect: true
});

export const socketio_dm = io(domain + port(":5001"), {
  transports: ["websocket"],
  path: "/socketio_dm/",
  autoConnect: true
});


export const socketio_vc = io(domain + port(":5002"), {
  transports: ["websocket"],
  path: "/socketio_vc/",
  autoConnect: true
});

/*
export const socketio_dvc = io(domain + port(":5003"), {
  transports: ["websocket"],
  path: "/socketio_dvc/",
  autoConnect: true
});
*/

export const socketio_draw = io(domain + port(":5004"), {
  transports: ["websocket"],
  path: "/socketio_draw/",
  autoConnect: true
});