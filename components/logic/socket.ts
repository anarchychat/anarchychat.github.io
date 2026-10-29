import { io } from "socket.io-client";

const prod = process.env.NODE_ENV === 'production'
//const prod = false

if (!prod) {
  console.log("Development Mode")
  var domain = "localhost"
  //var domain = "213.188.198.174"
} else {
  console.log("Production Mode")
  var domain = "anarchychats.com"
}

function port(num: string) {
  if (!prod) {
    return num
  }

  return ""
}

function sub(sub: string) {
  if (!prod) {
    return "http://"
  }

  return "https://" + sub
}
  
export const socketio_chat = io(sub("chat.") + domain + port(":10000"), {
  transports: ["websocket"],
  path: "/socketio_chat/",
  autoConnect: true
});

export const socketio_dm = io(sub("dm.") + domain + port(":10001"), {
  transports: ["websocket"],
  path: "/socketio_dm/",
  autoConnect: true
});


export const socketio_vc = io(sub("vc.") + domain + port(":10002"), {
  transports: ["websocket"],
  path: "/socketio_vc/",
  autoConnect: true
});

/*
export const socketio_dvc = io(sub("dvc.") + domain + port(":10003"), {
  transports: ["websocket"],
  path: "/socketio_dvc/",
  autoConnect: true
});
*/

export const socketio_draw = io(sub("draw.") + domain + port(":10004"), {
  transports: ["websocket"],
  path: "/socketio_draw/",
  autoConnect: true
});