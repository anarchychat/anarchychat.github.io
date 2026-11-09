import { SetStateAction, Dispatch, useState, useEffect, useRef } from "react"
import { socketio_vc } from "../logic/socket"
import * as userInfo from "../logic/userInfo"
import { MediaConnection, Peer } from "peerjs"

var stream: Promise<MediaStream>
var myPeer: Peer = new Peer()

var cancelled = false

export default function Vc({
  vc, blur, blockData, yourName, color, setCookieValue
}: {
  vc: boolean,
  blur: boolean,
  blockData: string[]
  yourName: string,
  color: string,
  setCookieValue: (name: string, value: string) => void,
}) {
  const [yourMessage, setYourMessage] = useState("")
  const [roomname, setRoomname] = useState("Chatroom 1")
  /*
  const [messages, setMessages] = useState<{
    username: string,
    message: string,
    color: string
  }[]>([])
  */
  const [chatrooms, setChatrooms] = useState<{
    name: string
  }[]>([])
  const [users, setUsers] = useState<{
    name: string,
    color: string
  }[]>([])
  type peer = {
    a: MediaConnection
  }
  const peers: peer = {} as peer
  const [mic, setMic] = useState(false)
  const [chatroomBtns, setChatroomBtns] = useState(true)
  const audioRefs = useRef<HTMLAudioElement[]>([])

  useEffect(() =>  {
    if (!cancelled) {
      userInfo.addChatrooms({setChatrooms: setChatrooms})
    }

    // Properly make client disconnect on page refresh 
    const onBeforeUnload = () => {
      socketio_vc.disconnect()
    }
    window.addEventListener("beforeunload", onBeforeUnload)

    socketio_vc.on("connect", () => {
      console.log("Client connected:", socketio_vc.id)
      console.log("Client room: " + roomname)
      //socketio_vc.emit("join-room", roomname)
    })

    socketio_vc.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message)
    })

    socketio_vc.on('username exists', () => {
      //addChatMessage("Console", "Username is already being used!")
      console.log("Username exists")
    })

    socketio_vc.on('disconnect', () => {
      console.log("Disconnected")
    })

    return () => {
      console.log("off")
      socketio_vc.off()
      cancelled = true
    }
  }, [socketio_vc])

  function clickChatBtn(roomname: string) {
    //console.log(name)
    console.log(mic)
    //setMessages([])
    setRoomname(roomname)
    //console.log("Joining room: " + roomname)
    //socketio_vc.emit("join-room", roomname)
    setChatroomBtns(false)

    setUsers([{name: yourName, color: color}])

    myPeer = new Peer("", {
      host: "/",
      port: 3001
    })
    console.log("myPeer: ", myPeer)

    stream = navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    })

    stream.then((stream: MediaStream) => {
      addVideoStream(0, stream)

      myPeer.on('call', (call: any) => {
        call.answer(stream)
        call.on('stream', (userVideoStream: MediaStream) => {
          addVideoStream(0, userVideoStream)
        })
      })

      socketio_vc.on('user-connected', (userId, color) => {
        connectToNewUser(userId, color, stream)
      })

      socketio_vc.on('user-disconnected', (userId) => {
        if (peers[userId as keyof typeof peers]) peers[userId as keyof typeof peers].close()
      })

      myPeer.on('open', id => {
        console.log("Joining room: ", roomname, " ", id)
        socketio_vc.emit('join-room', roomname, id, color)
      })
    })
  }

  function microphone() {
    setMic(!mic)
    console.log(!mic)

    if (!mic) {
      console.log("enabled")
      stream.then((stream: MediaStream) => {
        stream.getAudioTracks()[0].enabled = true
      })
      return
    }

    console.log("disabled")
    stream.then((stream: MediaStream) => {
      stream.getAudioTracks()[0].enabled = false
    })
  };

  function connectToNewUser(userId: string, color: string, stream: MediaStream) {
    const call = myPeer.call(userId, stream)
    const i = users.length + 1
    console.log("VC index: ", i)
    setUsers((current) => [
      ...current,
      {name: userId, color: color}
    ])
    call.on('stream', userVideoStream => {
      addVideoStream(i, userVideoStream)
    })
    call.on('close', () => {
      audioRefs.current[i].remove()
    })

    peers[userId as keyof typeof peers] = call
  }

  function addVideoStream(i: number, stream: MediaStream) {
    audioRefs.current[i].srcObject = stream
    audioRefs.current[i].addEventListener('loadedmetadata', () => {
      audioRefs.current[i].play()
    })
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
    <div id="voicechat-page" 
      className={`voicechat-page ${blur ? "blur" : ""} ${vc ? "active" : ""}`} 
      tabIndex={vc ? 0 : -1}
      inert={!vc}
    >
      <div 
        id="voice-chatroom-btns-page3" 
        className={`voice-chatroom-btns-page ${chatroomBtns ? "active" : "" }`}
      >
        <form id="voice-name-home" onSubmit={
          (e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_vc, 
            setYourMessage: setYourMessage
          })
        }>
          <input
            value={yourName}
            onChange={(e) => userInfo.updateName({
              newName: e.target.value, 
              socketio: socketio_vc, 
              setCookieValue: setCookieValue
            })} 
            type="text" 
            id="voice-nme" 
            placeholder="Name" 
            size={58}
            autoComplete="off"
          />
          <button
            id="voice-colorpicker-home" 
            className="ti ti-palette"
            style={{
              color: color,
            }}
            onClick={() => setCookieValue("color", userInfo.getRandomColor())}
          />
        </form>
        <div className="header">Chatrooms</div>
        <div id="voice-chatroom-btns" className="voice-chatroom-btns">
          <li className="chatroom-btns">
            {chatrooms.map((chatroom) => (
              <button 
                key={chatroom.name} 
                className="hoverButton chatroom-btns" 
                onClick={() => clickChatBtn(chatroom.name)}
              >
                {chatroom.name}
              </button>
            ))}
          </li>							
        </div>
      </div>

      <div 
        id="voice-chatroom" 
        className={`voice-chatroom ${chatroomBtns ? "" : "active" }`}
      >
        <div id="voice-chat" className="voice-chat">
          <form id="voice-message" onSubmit={(e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_vc, 
            setYourMessage: setYourMessage
          })}>
            <button 
              type="submit" 
              id="voice-send"
              value="Send" 
              className={`ti ${mic ? 'ti-microphone green' :
                "ti-microphone-off red"}`}
              onClick={() => microphone()}
            />
          </form>
          <div id="voice-log">
            {users.filter(username => blockInArray(username)).map((user, i) => (
              <li key={i} style={{color: user.color}}>
                {user.name}
                <audio
                  ref={(node) => {
                    if (node) {
                      audioRefs.current[i] = node;
                    }
                  }}
                ></audio>
              </li>
            ))} 
          </div>
          <form id="voice-name" onSubmit={(e) => userInfo.handleSubmit({
            event: e, 
            yourName: yourName, 
            yourMessage: yourMessage, 
            color: color,
            socketio: socketio_vc, 
            setYourMessage: setYourMessage
          })}>
            <button
              id="voice-backarrow" 
              className="ti ti-logout voice-backarrow hoverButton"
              onClick={() => setChatroomBtns(true)}
            />
            <input 
              value={yourName}
              onChange={(e) => setCookieValue("name", e.target.value)} 
              type="text" 
              id="voice-nme" 
              placeholder="Name" 
              size={58}
              autoComplete="off"
            />
            <button
              id="voice-colorpicker" 
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