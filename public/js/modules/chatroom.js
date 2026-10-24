'use strict';

function chatroom() {
  //document.getElementById('chatroom-btns');
  // make all child of chatroom-btns clickable
  // use the value (which is the name) to tell chat(x) which chat to go to 
  const chatButtons = document.getElementById('chatroom-btns');
  const chatButtonsPage = document.getElementById('chatroom-btns-page');
  const chatroomPage = document.getElementById('chatroom');
  //var conn = {};
  //let connectedChatNum = [];
  let connectedChatCurr;

  // Generate the list of 9 different chatroom buttons 
  function generateButtons() {
    for (let i = 1; i <= 9; i++) {
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.textContent = `Chatroom ${i}`;
      p.id = `chatroom${i}`;
      p.className = `hoverButton`;
      li.appendChild(p);
      chatButtons.appendChild(li);
    }
  }

  // If cookie for chatroom(num) exist, run chat()
  // with cookie variable
  // Else; do chatroom(1) and run chat();
  
  // This is to go to the chatroom (x)
  function chatPage() {
    for (let i = 1; i <= 9; i++) {
      const p = document.getElementById(`chatroom` + i);
      p.addEventListener('click', function() {
        // Add active class to target element
        chatroomPage.classList.add('active');
        chatButtonsPage.classList.remove('active');
        
        var chatroomNum = `chatroom` + i;
        var wsName = "wss://" + "chat.bzmb.eu" + "/" + chatroomNum;
        //connectedChatNum.push(i);
        if (connectedChatCurr) {
          console.log("closing chat: " + connectedChatCurr);
          closeChat(connectedChatCurr);
        }
        connectedChatCurr = wsName;
        chat(wsName); // Pass the array of class names
      })
    }
  }

  // This is to go to the chatroom buttons
  function chatroomButtonsPage() {
    const logout = document.getElementById(`backarrow`);
    logout.addEventListener('click', function() {
      chatButtonsPage.classList.add('active');
      chatroomPage.classList.remove('active');
      // TODO: Exit out of chat(), below here
    })
  }

  generateButtons();
  chatPage();
  chatroomButtonsPage();
};
