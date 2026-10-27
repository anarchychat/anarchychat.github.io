import { io } from "socket.io-client";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log("Development Mode")
  var domain = "http://localhost"
} else {
  console.log("Production Mode")
  var domain = "https://anarchychats.com"
}
export const socketio = io(domain + ":5000", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});

export const socketio_dm = io(domain + ":5001", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});


export const socketio_vc = io(domain + ":5002", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});

/*
export const socketio_dvc = io(domain + ":5003", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});
*/

export const socketio_draw = io(domain + ":5004", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});