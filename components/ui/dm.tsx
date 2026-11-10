import { SetStateAction, Dispatch, useEffect, useState } from "react"
import { socketio_dm } from "../logic/socket"
import * as userInfo from "../logic/userInfo"

var cancelled = false

export default function Dm({
  dm, blur, blockData, yourName, color, setCookieValue
}: {
  dm: boolean,
  blur: boolean,
  blockData: string[],
  yourName: string,
  color: string,
  setCookieValue: (name: string, value: string) => void,
}) {
  const [yourMessage, setYourMessage] = useState("")
  const [roomname, setRoomname] = useState<string[]>([])
  const [messages, setMessages] = useState<{
    username: string,
    message: string,
    color: string
  }[]>([])
  const [chatrooms, setChatrooms] = useState<{
    name: string,
    color: string
  }[]>([])
  const [chatroomBtns, setChatroomBtns] = useState(true)

  //console.log("test")

  useEffect(() =>  {
    // Properly make client disconnect on page refresh 
    const onBeforeUnload = () => {
      socketio_dm.disconnect()
    }
    window.addEventListener("beforeunload", onBeforeUnload)

    socketio_dm.on("connect", () => {
      console.log("Client connected:", socketio_dm.id)
      // console.log("Client room: " + roomname)
      socketio_dm.emit("username", yourName, color)
      socketio_dm.emit("username list")
    })

    socketio_dm.on("add to userlist", (name, color) => {
      console.log("Receiving chatrooms: " + name + " " + color)
      addUser(name, color)
    })

    socketio_dm.on("remove from userlist", (name) => {
      //console.log("Receiving chatrooms: " + name)
      removeUser(name)
    })

    socketio_dm.on("userlist", (data: {username: string, color: string}[]) => {
      console.log("Receiving userlist: " + data)
      addUserlist(data)
    })

    socketio_dm.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message)
    })

    socketio_dm.on("new message", (username, message, color) => {
      console.log("Receiving message1: " + username + ": " + message)
      userInfo.addChatMessage({
        username: username, 
        message: message, 
        color: color,
        setMessages: setMessages
      })
    })

    socketio_dm.on('log', (data: string[]) => {
      console.log("Receiving logs: " + data)
      setMessages([])
      userInfo.addChatLog({
        data: data, 
        setMessages: setMessages
      })
    })

    socketio_dm.on('username exists', () => {
      userInfo.addChatMessage({
        username: "Console", 
        message: "Username is already being used!",
        color: "#000000",
        setMessages: setMessages
      })
      console.log("Username exists")
    })

    socketio_dm.on('disconnect', () => {
      console.log("Disconnected")
    })

    function removeUser(name: string) {
      console.log("33453452 remove user: " + name)

      console.log("start==========")
      chatrooms.forEach((current) => console.log(current.name))
      console.log("==========end")

      setChatrooms(
        chatrooms.filter(
          (current) => current.name !== name
        )
      )

      console.log("start2==========")
      chatrooms.forEach((current) => console.log(current.name))
      console.log("==========end2")
    }

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
      console.log("off")
      socketio_dm.off()
      cancelled = true
    }
  }, [socketio_dm, chatrooms, yourName])

  function addUserlist(data: {username: string, color: string}[]) {
    // console.log("Receiving message2: " + username + ": " + message)
    console.log("423525 userlist: ", data)
    for (const prop of data) {
      console.log("prop.name: ", prop.username)
      console.log("prop.color: ", prop.color)
      setChatrooms((current) => [...current, 
        {name: prop.username, color: prop.color}
      ])
    }
  }

  function addUser(name: string, color: string) {
    console.log("412353 add user: " + name)
    setChatrooms((current) => [...current,
      {name: name, color: color}
    ])
  }

  function clickChatBtn(roomname: string) {
    //console.log(name)
    setMessages([])
    setRoomname([yourName, roomname])
    console.log("Joining room: " + [yourName, roomname])
    socketio_dm.emit("join room", [yourName, roomname])
    setChatroomBtns(false)
  }

  function updateName(newName: string) {
    setCookieValue("name", newName)
    socketio_dm.emit('username', newName)
  }

  function blockInArray(item: {name: string}) {
    for (const blockedUsername of blockData) {
      if (item.name === blockedUsername) {
        console.log("EQUAL")
        return false
      }
    }
    console.log("NOT EQUAL")
    return true
  }

  return (
    <div id="dm-page" 
      className={`dm-page ${blur ? "blur" : ""} ${dm ? "active" : ""}`} 
      tabIndex={dm ? 0 : -1}
      inert={!dm}
    >
      <div 
        id="dm-chatroom-btns-page" 
        className={`dm-chatroom-btns-page ${chatroomBtns ? "active" : "" }`}
      >
        <form id="dm-name-home" onSubmit={
          (e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_dm, 
            setYourMessage: setYourMessage
          })
        }>
          <input
            value={yourName}
            onChange={(e) => updateName(e.target.value)} 
            type="text" 
            id="home-dm-nme" 
            placeholder="Name" 
            size={58}
            autoComplete="off"
          />
          <button
            id="dm-colorpicker-home" 
            className="ti ti-palette"
            style={{
              color: color,
            }}
            onClick={() => setCookieValue("color", userInfo.getRandomColor())}
          />
        </form>
        <div className="header">Your Group Chats</div>
        <div id="dm-chatroom-btns" className="dm-chatroom-btns">
          <li className="chatroom-btns">
            {chatrooms.filter(username => blockInArray(username)).map((chatroom, i) => (
              <button 
                key={i} 
                className="hoverButton chatroom-btns" 
                onClick={() => clickChatBtn(chatroom.name)}
                style={{color: chatroom.color}}
              >
                {chatroom.name}
              </button>
            ))}
          </li>							
        </div>
      </div>

      <div 
        id="dm-chatroom" 
        className={`dm-chatroom ${chatroomBtns ? "" : "active" }`}
      >
        <div id="dm-chat" className="dm-chat">
          <form id="dm-message" onSubmit={(e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_dm, 
            setYourMessage: setYourMessage
          })}>
            <input
              value={yourMessage}
              onChange={(e) => setYourMessage(e.target.value)}
              type="text" 
              id="dm-msg" 
              placeholder="Message" 
              size={58} 
            autoComplete="off"
            />
            <button 
              type="submit"
              id="dm-send"
              value="Send"
              className="ti ti-send"
              onClick={() => userInfo.handleClick({
                yourName: yourName, 
                yourMessage: yourMessage,
                color: color,
                socketio: socketio_dm, 
                setYourMessage: setYourMessage
              })}
            />
          </form>
          <div id="dm-log">
            {messages.map((message, i) => (
              <li key={i}>
                <p className="dm-username" style={{color: message.color}}>
                  {message.username}
                </p>
                <p className="dm-message">: {message.message}</p>
              </li>
            ))} 
          </div>
          <form id="dm-name" onSubmit={(e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_dm, 
            setYourMessage: setYourMessage
          })}>
            <button
              id="dm-backarrow" 
              className="ti ti-logout dm-backarrow hoverButton"
              onClick={() => setChatroomBtns(true)}
            />
            <input
              value={yourName}
              onChange={(e) => setCookieValue("name", e.target.value)} 
              type="text" 
              id="dm-nme" 
              placeholder="Name" 
              size={58}
              autoComplete="off"
            />
            <button
              id="dm-colorpicker" 
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