import { useEffect, useState } from "react";
import { socketio_dm } from "../logic/socket";
import { getRandomColor, getRandomDigit } from "../logic/userInfo";

var cancelled = false;

export default function Dm({
  dm
}: {
  dm: boolean
}) {
  const [yourName, setYourName] = useState("Guest");
  const [yourMessage, setYourMessage] = useState("");
  const [roomname, setRoomname] = useState<string[]>([]);
  const [color, setColor] = useState("#000000");
  const [messages, setMessages] = useState<{
    username: string,
    message: string
  }[]>([]);
  const [chatrooms, setChatrooms] = useState<{
    name: string
  }[]>([]);
  const [chatroomBtns, setChatroomBtns] = useState(true);
  var i = 0;
  var j = 0;
  var k = 0;

  console.log("test");

  useEffect(() =>  {
    if (!cancelled) {
      setColor(getRandomColor());
      setYourName("Guest" + getRandomDigit());
    }

    // Properly make client disconnect on page refresh 
    const onBeforeUnload = () => {
      socketio_dm.disconnect();
    }
    window.addEventListener("beforeunload", onBeforeUnload);

    socketio_dm.on("connect", () => {
      console.log("Client connected:", socketio_dm.id);
      // console.log("Client room: " + roomname);
      socketio_dm.emit("username", yourName);
      socketio_dm.emit("username list");
    });

    socketio_dm.on("add to userlist", (name) => {
      console.log("Receiving chatrooms: " + name)
      addUser(name);
    })

    socketio_dm.on("remove from userlist", (name) => {
      //console.log("Receiving chatrooms: " + name)
      removeUser(name);
    })

    socketio_dm.on("userlist", (data) => {
      console.log("Receiving userlist: " + data)
      addUserlist(data);
    })

    socketio_dm.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    socketio_dm.on("new message", (username, message) => {
      console.log("Receiving message1: " + username + ": " + message)
      addChatMessage(username, message);
    });

    socketio_dm.on('log', (data) => {
      console.log("Receiving logs: " + data);
      setMessages([]);
      addChatLog(data);
    });

    socketio_dm.on('username exists', () => {
      addChatMessage("Console", "Username is already being used!");
      console.log("Username exists");
    });

    socketio_dm.on('disconnect', () => {
      console.log("Disconnected");
    });

    function removeUser(name: string) {
      console.log("33453452 remove user: " + name);

      console.log("start==========")
      chatrooms.forEach((current) => console.log(current.name));
      console.log("==========end")

      setChatrooms(
        chatrooms.filter(
          (current) => current.name !== name
        )
      )

      console.log("start2==========")
      chatrooms.forEach((current) => console.log(current.name));
      console.log("==========end2")
    }

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      console.log("off");
      socketio_dm.off();
      cancelled = true;
    };
  }, [socketio_dm, chatrooms, yourName]);

  function addChatMessage(username: string, message: string) {
    // console.log("Receiving message2: " + username + ": " + message)
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

  function addUserlist(data: string[]) {
    // console.log("Receiving message2: " + username + ": " + message)
    console.log("423525 userlist: " + data);
    for (const prop of data) {
      setChatrooms((current) => [...current, 
        {name: prop}
      ])
    }
  }

  function addUser(name: string) {
    console.log("412353 add user: " + name)
    setChatrooms((current) => [...current,
      {name: name}
    ])
  }

  function clickChatBtn(roomname: string) {
    //console.log(name);
    setMessages([]);
    setRoomname([yourName, roomname]);
    console.log("Joining room: " + [yourName, roomname]);
    socketio_dm.emit("join room", [yourName, roomname]);
    setChatroomBtns(false);
  }

  function handleClick() {
    if (yourName != "" && yourMessage != "") {
      socketio_dm.emit("new message", yourName, yourMessage,);
      setYourMessage("");
    }
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (yourName != "" && yourMessage != "") {
      socketio_dm.emit("new message", name, yourMessage,);
      setYourMessage("");
    }
  }

  function updateName(newName: string) {
    setYourName(newName);
    socketio_dm.emit('username', newName);
  }

  return (
    <div id="dm-page" 
      className={`dm-page blur ${dm ? "active" : ""}`} 
      tabIndex={dm ? 0 : -1}
      inert={!dm}
    >
      <div 
        id="dm-chatroom-btns-page" 
        className={`dm-chatroom-btns-page ${chatroomBtns ? "active" : "" }`}
      >
        <form id="dm-name-home" onSubmit={handleSubmit}>
          <input
            value={yourName}
            onChange={(e) => updateName(e.target.value)} 
            type="text" 
            id="dm-nme" 
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
            onClick={() => setColor(getRandomColor())}
          />
        </form>
        <div className="header">Your Group Chats</div>
        <div id="dm-chatroom-btns" className="dm-chatroom-btns">
          <li className="chatroom-btns">
            {chatrooms.map((chatroom) => (
              <button 
                key={j += 1} 
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
        id="dm-chatroom" 
        className={`dm-chatroom ${chatroomBtns ? "" : "active" }`}
      >
        <div id="dm-chat" className="dm-chat">
          <form id="dm-message" onSubmit={handleSubmit}>
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
              onClick={() => handleClick()}
            />
          </form>
          <div id="dm-log">
            {messages.map((message) => (
              <li key={i += 1}>{message.username}: {message.message}</li>
            ))} 
          </div>
          <form id="dm-name" onSubmit={handleSubmit}>
            <button
              id="dm-backarrow" 
              className="ti ti-logout dm-backarrow hoverButton"
              onClick={() => setChatroomBtns(true)}
            />
            <input
              value={yourName}
              onChange={(e) => setYourName(e.target.value)} 
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
              onClick={() => setColor(getRandomColor())}
            />
          </form>
        </div>
      </div>
    </div>
  );
}