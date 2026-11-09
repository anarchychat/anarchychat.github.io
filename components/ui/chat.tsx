import { SetStateAction, Dispatch, useEffect, useState } from "react"
import { socketio_chat } from "../logic/socket"
import * as userInfo from "../logic/userInfo"
import { setCookie } from "../logic/cookie"

var cancelled = false

export default function Chat({
  chat, blur, blockData, yourName, color, setCookieValue
}: {
  chat: boolean,
  blur: boolean,
  blockData: string[],
  yourName: string,
  color: string,
  setCookieValue: (name: string, value: string) => void,
}) {
  const [yourMessage, setYourMessage] = useState("")
  const [roomname, setRoomname] = useState("Chatroom 1")
  const [messages, setMessages] = useState<{
    username: string,
    message: string,
    color: string
  }[]>([])
  const [chatrooms, setChatrooms] = useState<{
    name: string
  }[]>([])
  const [chatroomBtns, setChatroomBtns] = useState(false)

  console.log("CHAT TEST")

  useEffect(() =>  {
    if (!cancelled) {
      userInfo.addChatrooms({setChatrooms: setChatrooms})
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

    socketio_chat.on("new message", (username, message, color) => {
      console.log("Receiving message1: " + username + ": " + message)
      userInfo.addChatMessage({
        username: username, 
        message: message, 
        color: color,
        setMessages: setMessages
      })
    })

    socketio_chat.on('log', (data: string[]) => {
      setMessages([])
      console.log("Receiving logs: " + data)
      userInfo.addChatLog({
        data: data,
        setMessages: setMessages
      })
    })

    socketio_chat.on('muted', () => {
      console.log("muted...")
      userInfo.addChatMessage({
        username: "Console", 
        message: "You've been muted, please wait",
        color: "#000000",
        setMessages: setMessages
      })
    })

    socketio_chat.on('username exists', () => {
      userInfo.addChatMessage({
        username: "Console", 
        message: "Username is already being used!",
        color: "#000000",
        setMessages: setMessages
      })
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

  function blockInArray(item: {username: string}) {
    for (const blockedUsername of blockData) {
      if (item.username === blockedUsername) {
        console.log("EQUAL")
        return false
      }
    }
    console.log("NOT EQUAL")
    return true
  }

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
          (e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_chat, 
            setYourMessage: setYourMessage
          })
        }>
          <input
            value={yourName}
            onChange={(e) => setCookieValue("name", e.target.value)} 
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
            onClick={() => setCookieValue("color", userInfo.getRandomColor())}
          />
        </form>
        <div className="header">Chatrooms</div>
        <div id="chatroom-btns" className="chatroom-btns">
          <li className="chatroom-btns">
            {chatrooms.map((chatroom) => (
              <button 
                key={chatroom.name} 
                className="hoverButton chatroom-btns" 
                onClick={() => userInfo.clickChatBtn({
                  roomname: chatroom.name, 
                  setMessages: setMessages, 
                  setRoomname: setRoomname, 
                  socketio: socketio_chat, 
                  setChatroomBtns: setChatroomBtns
                })}
              >
                {chatroom.name}
              </button>
            ))}
          </li>
        </div>
      </div>

      <div id="chatroom" className={`chatroom ${chatroomBtns ? "" : "active"}`}>
        <div id="chat" className="chat">
          <form id="message" onSubmit={(e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_chat, 
            setYourMessage: setYourMessage
          })}>
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
              onClick={() => userInfo.handleClick({
                yourName: yourName, 
                yourMessage: yourMessage,
                color: color,
                socketio: socketio_chat, 
                setYourMessage: setYourMessage
              })}
            />
          </form>
          <div id="log">
            {messages.filter(username => blockInArray(username)).map((message, i) => (
              <li key={i}>
                <p className="chat-username" style={{color: message.color}}>{message.username}</p>
                <p className="chat-message">: {message.message}</p>
              </li>
            ))} 
          </div>
          <form id="name" onSubmit={(e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_chat, 
            setYourMessage: setYourMessage
          })}>
            <button
              id="backarrow" 
              className="ti ti-logout backarrow hoverButton"
              onClick={() => setChatroomBtns(true)}
            />
            <input
              value={yourName}
              onChange={(e) => setCookieValue("name", e.target.value)} 
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
              onClick={() => setCookieValue("color", userInfo.getRandomColor())}
            />
          </form>
        </div>
      </div>
    </div>
  )
}