// Setup basic express server
import type { Server } from "socket.io"
import { Socket } from "socket.io"

export function registerVc(io: Server) {
  console.log("Starting vc.ts")

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
}