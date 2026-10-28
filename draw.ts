// Setup basic express server
import { Server, Socket } from "socket.io"

interface ServerToClientEvents {
  'log': (a: { username: string, data: string }[] ) => void;
  'new drawing': (a: string, b: string) => void;
  'username exists': () => void;
}

interface ClientToServerEvents {
  'log': () => void;
  'new drawing': (a: string, b: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const DRAW_LOG_LIMIT_AMNT: number = 10

import { createServer } from "http";
const httpServer = createServer().listen(5004, "0.0.0.0");

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
	transports: ["websocket"],
//	path: '/socketio_draw/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

// Drawings
const outerArray: {
  username: string, 
  data: string
}[] = []

const usernames: string[] = []

io.on('connection', (socket: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>) => {
  var yourUsername: string = ""

  socket.on('disconnect', () => {
    console.log("Disconnected")
    if (yourUsername != "") {
      var index = usernames.indexOf(yourUsername)
      usernames.splice(index, 1)

      console.log("Spliced")
    }
  })

  socket.on('log', () => {
    socket.emit('log', getDrawlog())
  })

  socket.on('new drawing', (username: string, data: string) => {
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

    setupDrawlog(username, data)

    console.log("New drawing received: " + 
      username + ": " + data)

    io.emit('new drawing', username, data)
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

function setupDrawlog(username: string, data: string) {
  outerArray.push({username, data})

  if (outerArray.length > DRAW_LOG_LIMIT_AMNT) {
    outerArray.shift()
  }
}

function getDrawlog() {
  if (outerArray.length > 0) {
    return outerArray
  }

  return []
}