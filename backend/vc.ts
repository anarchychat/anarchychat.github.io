import type { Server } from "socket.io"
import { Socket } from "socket.io"

export async function registerVc(io: Server) {
  console.log("Starting vc.ts")

  interface ServerToClientEvents {
    'user-connected': (a: string, b: string) => void
    'user-disconnected': (a: string) => void
  }

  interface ClientToServerEvents {
    'join-room': (a: string, b: string, c: string) => void
  }

  interface InterServerEvents {
    ping: () => void
  }

  interface SocketData {
    name: string
    age: number
  }

  io.on('connection', (socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >) => {
    console.log("VC - connected")
    socket.on('join-room', (roomId: string, userId: string, color: string) => {
      socket.join(roomId)
      console.log("VC - joining: ", roomId)
      io.to(roomId).emit('user-connected', userId, color)
      console.log("VC - user-connected: ", userId, " ", color)

      socket.on('disconnect', () => {
        io.to(roomId).emit('user-disconnected', userId)
        console.log("VC - disconnect: ", userId)
      })
    })
  })
}