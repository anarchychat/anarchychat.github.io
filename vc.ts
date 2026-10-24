// Setup basic express server
import { Server, Socket } from "socket.io"

interface ServerToClientEvents {
  'user-connected': (a: string) => void;
  'user-disconnected': (a: string) => void;
}

interface ClientToServerEvents {
  'join-room': (a: string, b: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(5002, {
  //transports: ["websocket"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on('connection', (socket: Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>) => {
  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId)
    socket.broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', userId)
    })
  })
})