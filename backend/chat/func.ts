import * as chat from "../chat"
import type { Socket } from "socket.io"

export function parseHeader(header: string): string {
  for (const directive of header.split(",")[0].split(";")) {
    if (directive.startsWith("for=")) {
      return directive.substring(4);
    }
  }

  return ""
}

export function checkIfUsernameExists(username: string, yourUsername: string, 
socket: Socket<
  chat.ClientToServerEvents,
  chat.ServerToClientEvents,
  chat.InterServerEvents,
  chat.SocketData
>)
:boolean {
  const exists = chat.usernames.includes(username) && username!== yourUsername

  if (exists) {
    socket.emit('username exists')
    console.log("Function: username exists")
  }

  return exists
}

export function checkIfBanned(directIp: string, xForwardForIp: string,
  forwardedIp: string): number
{
  const find = chat.bannedIps.findIndex( o => 
    o.directIp === directIp &&
    o.xForwardForIp === xForwardForIp &&
    o.forwardedIp === forwardedIp
  ) 

  return find
}

export function setupChatlog(username: string, message: string, roomname: string) {
  var room = chat.chatrooms.find(array => array.roomname === roomname)

  if (!room) {
    room = { roomname, data: [] }    
    chat.chatrooms.push(room)
  }

  room.data.push({username, message})

  if (room.data.length > chat.CHAT_LOG_LIMIT_AMNT) {
    room.data.shift()
  }
}

export function getChatlog(roomname: string) {
  const room = chat.chatrooms.find(array => array.roomname === roomname)

  if (room) {
    var chatLog = room.data
    return chatLog
  }

  return []
}