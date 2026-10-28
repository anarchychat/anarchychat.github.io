// Setup basic express server
import { Server, Socket } from "socket.io"

// Make this file NOT print console logs
//console.log = function() {}

interface ServerToClientEvents {
  'log': (a: { username: string, message: string }[]) => void;
  'new message': (a: string, b: string) => void;
  'username exists': () => void;
}

interface ClientToServerEvents {
  'join room': (a: string) => void;
  'new message': (a: string, b: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const CHAT_LOG_LIMIT_AMNT: number = 100

import { createServer } from "http";
const httpServer = createServer().listen(10000, "0.0.0.0");

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  transports: ["websocket"],
  path: '/socketio_chat/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Chatroom
const outerArray: {
  roomname: string, 
  data: {
    username: string,
    message: string
  }[]
}[] = []

const usernames: string[] = []

io.on('connection', (socket: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>) => {
  var roomname: string = ""
  var yourUsername: string = ""

  socket.on('disconnect', () => {
    console.log("Disconnected")
    if (yourUsername != "") {
      var index = usernames.indexOf(yourUsername)
      usernames.splice(index, 1)

      console.log("Spliced")
    }
  })

  socket.on('join room', (newRoomname: string) => {
    console.log("Joining room: " + newRoomname)
    socket.leave(roomname)
    roomname = newRoomname
    socket.join(roomname)
    socket.emit('log', getChatlog(roomname))
  })

  socket.on('new message', (username: string, message: string) => {
    if (checkIfUsernameExists(username, yourUsername, socket)) {
      console.log("Username already exists")
      return
    }

    if (username !== yourUsername) {
      const oldIndex = usernames.indexOf(yourUsername)

      if (oldIndex !== -1) {
        usernames.splice(oldIndex, 1)
        console.log("Spliced")
      }

      yourUsername = username
      usernames.push(username)
      console.log("Changed username")
    }

    setupChatlog(username, message, roomname)

    console.log("New message received: " + 
      roomname + ": " + username + ": " + message)

    io.to(roomname).emit('new message', username, message)
  })
})

function checkIfUsernameExists(username: string, yourUsername: string, socket: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>)
:boolean {
  const exists = usernames.includes(username) && username!== yourUsername

  if (exists) {
    socket.emit('username exists')
    console.log("Function: username exists")
  }

  return exists
}

function setupChatlog(username: string, message: string, roomname: string) {
  var room = outerArray.find(array => array.roomname === roomname)

  if (!room) {
    room = { roomname, data: [] }    
    outerArray.push(room)
  }

  room.data.push({username, message})

  if (room.data.length > CHAT_LOG_LIMIT_AMNT) {
    room.data.shift()
  }
}

function getChatlog(roomname: string) {
  const room = outerArray.find(array => array.roomname === roomname)

  if (room) {
    var chatLog = room.data
    return chatLog
  }

  return []
}