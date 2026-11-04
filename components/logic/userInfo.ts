import type { Socket } from "socket.io-client"

export function getRandomDigit(): number {
  return Math.floor(Math.random() * 9999) + 1;
}

export function getRandomColor(): string {
  return "#" + Math.random().toString(16).slice(2, 8).padStart(6, "0");
}

export function addChatrooms(
  setChatrooms: React.Dispatch<React.SetStateAction<{name: string}[]>>
) {
  for (let i = 1; i < 10; i++) {
    console.log("num: " + i)
    //console.log("realnum: " + k)
    const newItem = {name: "Chatroom " + i}
    setChatrooms((current) => [
      ...current,
      newItem,
    ])
    //console.log("chatroom: " + chatrooms)
  }
}

export function addChatLog(data: any,
  setMessages: React.Dispatch<React.SetStateAction<{
    username: string
    message: string
  }[]>>
) {
  data.forEach((prop: any) => {
    setMessages((current) => [
      {username: prop.username, message: prop.message},
      ...current
    ])
  })
}

export function handleClick(yourName: string, yourMessage: string,
  socketio: Socket, 
  setYourMessage: React.Dispatch<React.SetStateAction<string>>
) {
  if (yourName != "" && yourMessage != "") {
    socketio.emit("new message", yourName, yourMessage,)
    setYourMessage("")
  }
}

export function handleSubmit(event: React.SubmitEvent<HTMLFormElement>,
  yourName: string, yourMessage: string,
  socketio: Socket,
  setYourMessage: React.Dispatch<React.SetStateAction<string>>
) {
  event.preventDefault()
  if (yourName != "" && yourMessage != "") {
    socketio.emit("new message", yourName, yourMessage,)
    setYourMessage("")
  }
}

export function addChatMessage(username: string, message: string,
  setMessages: React.Dispatch<React.SetStateAction<{
    username: string
    message: string
  }[]>>
) {
  console.log("Receiving message2: " + username + ": " + message)
  setMessages((current) => [
    {username: username, message: message},
    ...current
  ])
}

export function clickChatBtn(roomname: string,
  setMessages: React.Dispatch<React.SetStateAction<{
    username: string
    message: string
  }[]>>,
  setRoomname: React.Dispatch<React.SetStateAction<string>>,
  socketio: Socket,
  setChatroomBtns: React.Dispatch<React.SetStateAction<boolean>>
) {
  //console.log(name)
  setMessages([])
  setRoomname(roomname)
  console.log("Joining room: " + roomname)
  socketio.emit("join room", roomname)
  setChatroomBtns(false)
}