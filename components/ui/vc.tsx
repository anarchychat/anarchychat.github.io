import { useState, useEffect } from "react";
import { socketio_vc } from "../logic/socket";
import { getRandomColor, getRandomDigit } from "../logic/userInfo";
import { Peer } from "peerjs";

//var stream: Promise<MediaStream> = 0
var stream: any = 0
var myPeer: any = 0

var cancelled = false;

export default function Vc({
  vc
}: {
  vc: boolean
}) {
  const [yourName, setYourName] = useState("Guest");
  const [yourMessage, setYourMessage] = useState("");
  const [roomname, setRoomname] = useState("Chatroom 1");
  const [color, setColor] = useState("#000000");
  const [messages, setMessages] = useState<{
    username: string,
    message: string
  }[]>([]);
  const [chatrooms, setChatrooms] = useState<{
    name: string
  }[]>([]);
  const [users, setUsers] = useState<{
    name: string
  }[]>([]);
  const [mic, setMic] = useState(false)
  const [chatroomBtns, setChatroomBtns] = useState(true);
  var i = 0;
  var j = 0;
  var k = 0;

  useEffect(() =>  {
    if (!cancelled) {
      addChatrooms();
      setYourName("Guest" + getRandomDigit());
      setColor(getRandomColor());
    }

    socketio_vc.on("connect", () => {
      console.log("Client connected:", socketio_vc.id);
      console.log("Client room: " + roomname);
      socketio_vc.emit("join room", roomname);
    });

    socketio_vc.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    socketio_vc.on('username exists', () => {
      //addChatMessage("Console", "Username is already being used!");
      console.log("Username exists");
    });

    socketio_vc.on('disconnect', () => {
      console.log("Disconnected");
    });

    return () => {
      console.log("off");
      socketio_vc.off();
      cancelled = true;
    };
  }, [socketio_vc]);

  function addChatrooms() {
    var m = 1;
    for (k = 1; k < 10; k++) {
      console.log("num: " + k);
      //console.log("realnum: " + k);
      const newItem = {name: "Chatroom " + k};
      setChatrooms((current) => [
        ...current,
        newItem,
      ]);
      //console.log("chatroom: " + chatrooms);
    }
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (yourName != "" && yourMessage != "") {
      socketio_vc.emit("new message", yourName, yourMessage,);
      setYourMessage("");
    }
  }

  function clickChatBtn(roomname: string) {
    //console.log(name);
    setMessages([]);
    setRoomname(roomname);
    console.log("Joining room: " + roomname);
    socketio_vc.emit("join room", roomname);
    setChatroomBtns(false);

    myPeer = new Peer("", {
      host: '/',
      port: 3001
    })

    stream = navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    });
  }

  function updateName(newName: string) {
    setYourName(newName);
    socketio_vc.emit('username', newName);
  }

  function microphone() {
    setMic(!mic);

    if (mic) {
      stream.then((stream: any) => {
        //addVideoStream(myVideo, stream)

        myPeer.on('call', (call: any) => {
          call.answer(stream)
          const video = document.createElement('video')
          call.on('stream', (userVideoStream: any) => {
            //addVideoStream(video, userVideoStream)
          })
        })

        socketio_vc.on('user-connected', userId => {
          //connectToNewUser(userId, stream)
        })
      })
    } else {
      stream.getTracks().forEach((track: any) => track.stop())
    }
  }

  return (
    <div id="voicechat-page" 
      className={`voicechat-page blur ${vc ? "active" : ""}`} 
      tabIndex={vc ? 0 : -1}
      inert={!vc}
    >
      <div 
        id="voice-chatroom-btns-page3" 
        className={`voice-chatroom-btns-page ${chatroomBtns ? "active" : "" }`}
      >
        <form id="voice-name-home" onSubmit={handleSubmit}>
          <input
            value={yourName}
            onChange={(e) => updateName(e.target.value)} 
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
            onClick={() => setColor(getRandomColor())}
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
          <form id="voice-message" onSubmit={handleSubmit}>
            <button 
              type="submit" 
              id="voice-send"
              value="Send" 
              className={`ti ${mic ? 'ti-microphone green' 
                : "ti-microphone-off red"}`}
              onClick={() => microphone()}
            />
          </form>
          <div id="voice-log">
            {users.map((user) => (
              <li key={i += 1}>{user.name}</li>
            ))} 
          </div>
          <form id="voice-name" onSubmit={handleSubmit}>
            <button
              id="voice-backarrow" 
              className="ti ti-logout voice-backarrow hoverButton"
              onClick={() => setChatroomBtns(true)}
            />
            <input 
              value={yourName}
              onChange={(e) => setYourName(e.target.value)} 
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
              onClick={() => setColor(getRandomColor())}
            />
          </form>
        </div>
      </div>
    </div>
  );
}