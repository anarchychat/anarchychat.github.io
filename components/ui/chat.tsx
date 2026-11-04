import { useEffect, useState } from "react"
import { socketio_chat } from "../logic/socket"
import * as userInfo from "../logic/userInfo"
var domain = "http://localhost:3000"

var cancelled = false

export default function Chat({
  chat, blur
}: {
  chat: boolean,
  blur: boolean
}) {
  const [yourName, setYourName] = useState("Guest")
  const [yourMessage, setYourMessage] = useState("")
  const [roomname, setRoomname] = useState("Chatroom 1")
  const [color, setColor] = useState("#000000")
  const [messages, setMessages] = useState<{
    username: string,
    message: string
  }[]>([])
  const [chatrooms, setChatrooms] = useState<{
    name: string
  }[]>([])
  const [chatroomBtns, setChatroomBtns] = useState(false)
  var i = 0

  console.log("CHAT TEST")

  useEffect(() =>  {
    if (!cancelled) {
      setColor(userInfo.getRandomColor())
      setYourName("Guest" + userInfo.getRandomDigit())
      userInfo.addChatrooms(setChatrooms)
    }

    // Properly make client disconnect on page refresh 
    const onBeforeUnload = () => {
      socketio_chat.disconnect()
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    
    console.log("CHAT TEST 2")

    socketio_chat.on("connect", () => {
      console.log("CHAT Client connected:", socketio_chat.id)
      console.log("CHAT Client room: " + roomname)
      socketio_chat.emit("join room", roomname)
    })

    socketio_chat.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message)
    })

    socketio_chat.on("new message", (username, message) => {
      console.log("Receiving message1: " + username + ": " + message)
      userInfo.addChatMessage(username, message, setMessages)
    })

    socketio_chat.on('log', (data) => {
      setMessages([])
      console.log("Receiving logs: " + data)
      userInfo.addChatLog(data, setMessages)
    })

    socketio_chat.on('muted', () => {
      console.log("muted...")
      userInfo.addChatMessage("Console", "You've been muted, please wait",
        setMessages
      )
    })

    socketio_chat.on('username exists', () => {
      userInfo.addChatMessage("Console", "Username is already being used!",
        setMessages
      )
      console.log("Username exists")
    })

    socketio_chat.on('disconnect', () => {
      console.log("Disconnected")
    })
    return () => {
      console.log("off")
      socketio_chat.off()
      cancelled = true
    }
  }, [socketio_chat])

  return (
    <div id="chat-page" 
      className={`chat-page ${blur ? "blur" : ""} ${chat ? "active" : ""}`}
      tabIndex={chat ? 0 : -1}
      inert={!chat}
    >
      <div 
        id="chatroom-btns-page" 
        className={`chatroom-btns-page ${chatroomBtns ? "active" : ""}`}
      >
        <form id="chat-name-home" onSubmit={
          (e) => userInfo.handleSubmit(
            e, yourName, yourMessage, socketio_chat, setYourMessage
          )
        }>
          <input
            value={yourName}
            onChange={(e) => setYourName(e.target.value)} 
            type="text" 
            id="chat-nme" 
            placeholder="Name" 
            size={58}
            autoComplete="off"
          />
          <button
            id="chat-colorpicker-home" 
            className="ti ti-palette"
            style={{
              color: color,
            }}
            onClick={() => setColor(userInfo.getRandomColor())}
          />
        </form>
        <div className="header">Chatrooms</div>
        <div id="chatroom-btns" className="chatroom-btns">
          <li className="chatroom-btns">
            {chatrooms.map((chatroom) => (
              <button 
                key={chatroom.name} 
                className="hoverButton chatroom-btns" 
                onClick={() => userInfo.clickChatBtn(
                  chatroom.name, setMessages, setRoomname, 
                  socketio_chat, setChatroomBtns
                )}
              >
                {chatroom.name}
              </button>
            ))}
          </li>
        </div>
      </div>

      <div id="chatroom" className={`chatroom ${chatroomBtns ? "" : "active"}`}>
        <div id="chat" className="chat">
          <form id="message" onSubmit={(e) => userInfo.handleSubmit(
            e, yourName, yourMessage, socketio_chat, setYourMessage
          )}>
            <input
              value={yourMessage}
              onChange={(e) => setYourMessage(e.target.value)}
              type="text" 
              id="msg" 
              placeholder="Message" 
              size={58} 
              autoComplete="off"
            />
            <button 
              type="submit"
              id="send"
              value="Send"
              className="ti ti-send"
              onClick={() => userInfo.handleClick(yourName, yourMessage,
                socketio_chat, setYourMessage
              )}
            />
          </form>
          <div id="log">
            {messages.map((message) => (
              <li key={i += 1}>{message.username}: {message.message}</li>
            ))} 
          </div>
          <form id="name" onSubmit={(e) => userInfo.handleSubmit(
            e, yourName, yourMessage, socketio_chat, setYourMessage
          )}>
            <button
              id="backarrow" 
              className="ti ti-logout backarrow hoverButton"
              onClick={() => setChatroomBtns(true)}
            />
            <input
              value={yourName}
              onChange={(e) => setYourName(e.target.value)} 
              type="text" 
              id="nme" 
              placeholder="Name" 
              size={58}
              autoComplete="off"
            />
            <button
              id="colorpicker" 
              className="ti ti-palette"
              style={{
                color: color,
              }}
              onClick={() => setColor(userInfo.getRandomColor())}
            />
          </form>
        </div>
      </div>
    </div>
  )
}