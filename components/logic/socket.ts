import { io } from "socket.io-client";

export const socketio = io("http://localhost:5000", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});

export const socketio_dm = io("http://localhost:5001", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});


export const socketio_vc = io("http://localhost:5002", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});

/*
export const socketio_dvc = io("http://localhost:5003", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});
*/

export const socketio_draw = io("http://localhost:5004", {
  //transports: ["websocket"],
  //withCredentials: true,
  path: "/socket.io/",
  autoConnect: true
});