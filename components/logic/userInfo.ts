import type { Socket } from "socket.io-client"

export function getRandomDigit(): number {
  return Math.floor(Math.random() * 9999) + 1;
}

export function getRandomColor(): string {
  return "#" + Math.random().toString(16).slice(2, 8).padStart(6, "0");
}

export function addChatrooms(options: {
  setChatrooms: React.Dispatch<React.SetStateAction<{name: string}[]>>
}) {
  for (let i = 1; i < 10; i++) {
    console.log("num: " + i)
    //console.log("realnum: " + k)
    const newItem = {name: "Chatroom " + i}
    options.setChatrooms((current) => [
      ...current,
      newItem,
    ])
    //console.log("chatroom: " + chatrooms)
  }
}

export function addChatLog(options: {
  data: string[],
  setMessages: React.Dispatch<React.SetStateAction<{
    username: string
    message: string
    color: string
  }[]>>
}) {
  options.data.forEach((prop: any) => {
    options.setMessages((current) => [
      {username: prop.username, message: prop.message, color: prop.color},
      ...current
    ])
  })
}

export function handleClick(options: {
  yourName: string, 
  yourMessage: string,
  color: string,
  socketio: Socket, 
  setYourMessage: React.Dispatch<React.SetStateAction<string>>
}) {
  if (options.yourName != "" && options.yourMessage != "") {
    options.socketio.emit("new message", 
      options.yourName, 
      options.yourMessage, 
      options.color
    )
    options.setYourMessage("")
  }
}

export function handleSubmit(options: {
  event: React.SubmitEvent<HTMLFormElement>,
  yourName: string, 
  yourMessage: string,
  color: string,
  socketio: Socket,
  setYourMessage: React.Dispatch<React.SetStateAction<string>>
}) {
  options.event.preventDefault()
  if (options.yourName != "" && options.yourMessage != "") {
    options.socketio.emit("new message", 
      options.yourName, 
      options.yourMessage,
      options.color
    )
    options.setYourMessage("")
  }
}

export function addChatMessage(options: {
  username: string, 
  message: string,
  color: string
  setMessages: React.Dispatch<React.SetStateAction<{
    username: string
    message: string
    color: string
  }[]>>
}) {
  console.log("Receiving message2: " + options.username +
    ": " + options.message)
  options.setMessages((current) => [
    {username: options.username, message: options.message, color: options.color},
    ...current
  ])
}

export function clickChatBtn(options: {
  roomname: string,
  setMessages: React.Dispatch<React.SetStateAction<{
    username: string
    message: string
    color: string
  }[]>>,
  setRoomname: React.Dispatch<React.SetStateAction<string>>,
  socketio: Socket,
  setChatroomBtns: React.Dispatch<React.SetStateAction<boolean>>
}) {
  //console.log(name)
  options.setMessages([])
  options.setRoomname(options.roomname)
  console.log("Joining room: " + options.roomname)
  options.socketio.emit("join room", options.roomname)
  options.setChatroomBtns(false)
}

export function updateName(options: {
  newName: string, 
  socketio: Socket,
  setCookieValue: (name: string, value: string) => void,
}) {
  options.setCookieValue("name", options.newName)
  options.socketio.emit('username', options.newName)
}