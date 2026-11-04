import type { Server } from "socket.io"
import { Socket } from "socket.io"
import * as func from "./chat/func"

export interface ServerToClientEvents {
  'log': (a: { username: string, message: string }[]) => void
  'new message': (a: string, b: string) => void
  'username exists': () => void
  'muted': () => void
}
export interface ClientToServerEvents {
  'join room': (a: string) => void
  'new message': (a: string, b: string) => void
}
export interface InterServerEvents {
  ping: () => void
}
export interface SocketData {
  name: string
  age: number
}

export const CHAT_LOG_LIMIT_AMNT: number = 100
export const chatrooms: {
  roomname: string, 
  data: {
    username: string,
    message: string
  }[]
}[] = []
export const usernames: string[] = []
export const bannedIps: {
  directIp: string,
  xForwardForIp: string
  forwardedIp: string
}[] = []
export const spamTimeCounter: number = 3000 // milliseconds
export const banTimeCoutner: number = 60000 // milliseconds

export async function registerChat(io: Server) {
  console.log("Starting chat.ts")

  io.on('connection', (socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >) => {
    var roomname: string = ""
    var yourUsername: string = ""
    var msgAmnt: number = 0

    const directIp = socket.handshake.address;
    console.log("directIp: ", directIp)

    var xForwardForIp = ""
    if (socket.handshake.headers["x-forwarded-for"]) {
      xForwardForIp = (socket.handshake.headers["x-forwarded-for"] as string).split(",")[0]
    }
    console.log("xForwardForIp: ", xForwardForIp)

    var forwardedIp = ""
    if (socket.handshake.headers["forwarded"]) {
      forwardedIp = func.parseHeader((socket.handshake.headers["forwarded"] as string) || "");
    }
    console.log("forwardedIp: ", forwardedIp)

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
      socket.emit('log', func.getChatlog(roomname))
    })

    socket.on('new message', (username: string, message: string) => {
      if (func.checkIfUsernameExists(username, yourUsername, socket)) {
        console.log("Username already exists")
        return
      }
      if (func.checkIfBanned(directIp, xForwardForIp, forwardedIp) > -1) {
        console.log("Banned ip (directIp, xForwardForIp, forwardedIp): ",
          directIp + " - ", xForwardForIp + " - ", forwardedIp
         )
         socket.emit('muted')
        return
      }

      if (username !== yourUsername) {
        changeUsername(username)
      }

      func.setupChatlog(username, message, roomname)

      console.log("New message received: " + 
        roomname + ": " + username + ": " + message)

      checkIfSpamming()

      io.to(roomname).emit('new message', username, message)
    })

    function changeUsername(username: string) {
      const oldIndex = usernames.indexOf(yourUsername)

      if (oldIndex !== -1) {
        usernames.splice(oldIndex, 1)
        console.log("Spliced")
      }

      yourUsername = username
      usernames.push(username)
      console.log("Changed username")
    }

    function checkIfSpamming() 
    {
      // msgAmnt++ for 3 seconds (chat.spamTimeCounter) then remove
      console.log("msgAmnt: ", msgAmnt)
      msgAmnt++
      setTimeout(function(){msgAmnt--}, spamTimeCounter)

      if (msgAmnt > 4) {
        // put in bannedIps for 60 seconds then remove
        console.log("bannedIps: ", bannedIps)
        bannedIps.push({directIp, xForwardForIp, forwardedIp})
        setTimeout(function(){
          const find = func.checkIfBanned(directIp, xForwardForIp, forwardedIp)
          if (find > -1) {
            bannedIps.splice(find, 1)
          }
        }, banTimeCoutner)
      }
    }
  })
}