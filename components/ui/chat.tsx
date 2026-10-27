import { useEffect, useState } from "react";
import { socketio_chat } from "../logic/socket";
import { getRandomColor, getRandomDigit } from "../logic/userInfo";

var cancelled = false;

export default function Chat({
  chat
}: {
  chat: boolean
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
  const [chatroomBtns, setChatroomBtns] = useState(false);
  var i = 0;
  var j = 0;
  var k = 0;

  useEffect(() =>  {
    if (!cancelled) {
      setColor(getRandomColor());
      setYourName("Guest" + getRandomDigit());
      addChatrooms();
    }

    socketio_chat.on("connect", () => {
      console.log("Client connected:", socketio_chat.id);
      console.log("Client room: " + roomname);
      socketio_chat.emit("join room", roomname);
    });

    socketio_chat.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    socketio_chat.on("new message", (username, message) => {
      console.log("Receiving message1: " + username + ": " + message)
      addChatMessage(username, message);
    });

    socketio_chat.on('log', (data) => {
      setMessages([]);
      console.log("Receiving logs: " + data);
      addChatLog(data);
    });

    socketio_chat.on('username exists', () => {
      addChatMessage("Console", "Username is already being used!");
      console.log("Username exists");
    });

    socketio_chat.on('disconnect', () => {
      console.log("Disconnected");
    });

    return () => {
      console.log("off");
      socketio_chat.off();
      cancelled = true;
    };
  }, [socketio_chat]);

  function handleClick() {
    if (yourName != "" && yourMessage != "") {
      socketio_chat.emit("new message", yourName, yourMessage,);
      setYourMessage("");
    }
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (yourName != "" && yourMessage != "") {
      socketio_chat.emit("new message", yourName, yourMessage,);
      setYourMessage("");
    }
  }

  function addChatMessage(username: string, message: string) {
    console.log("Receiving message2: " + username + ": " + message)
    setMessages((current) => [...current, 
      {username: username, message: message}
    ])
  }

  function addChatLog(data: any) {
    data.forEach((prop: any) => {
      setMessages((current) => [...current, 
        {username: prop.username, message: prop.message}
      ])
    })
  }

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

  function clickChatBtn(roomname: string) {
    //console.log(name);
    setMessages([]);
    setRoomname(roomname);
    console.log("Joining room: " + roomname);
    socketio_chat.emit("join room", roomname);
    setChatroomBtns(false);
  }

  return (
    <div id="chat-page" 
      className={`chat-page blur ${chat ? "active" : ""}`}
      tabIndex={chat ? 0 : -1}
      inert={!chat}
    >
      <div 
        id="chatroom-btns-page" 
        className={`chatroom-btns-page ${chatroomBtns ? "active" : ""}`}
      >
        <form id="chat-name-home" onSubmit={handleSubmit}>
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
            onClick={() => setColor(getRandomColor())}
          />
        </form>
        <div className="header">Chatrooms</div>
        <div id="chatroom-btns" className="chatroom-btns">
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

      <div id="chatroom" className={`chatroom ${chatroomBtns ? "" : "active"}`}>
        <div id="chat" className="chat">
          <form id="message" onSubmit={handleSubmit}>
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
              onClick={() => handleClick()}
            />
          </form>
          <div id="log">
            {messages.map((message) => (
              <li key={i += 1}>{message.username}: {message.message}</li>
            ))} 
          </div>
          <form id="name" onSubmit={handleSubmit}>
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
              onClick={() => setColor(getRandomColor())}
            />
          </form>
        </div>
      </div>
    </div>
  );
}