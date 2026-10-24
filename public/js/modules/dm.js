'use strict';

// - Doing any testing or debugging requires TWO browsers,
// because otherwise they share the same localstorage and cookies
function dm() {
	var wss = "wss://dm.bzmb.eu";
	var ws, toId, fromId, privId, debug;
	var nickname, yourNickname = "";
	var users = 0;
	var alreadyConnected = false;
	var usernameInputEle = document.getElementById('dm-nme');
	var messageInputEle = document.getElementById('dm-msg');
	var chatForm = document.getElementById("dm-message");
	var chatUserForm = document.getElementById("dm-name");
	var sendButton = document.getElementById("dm-send");
	var dmChatButtonsPage = document.getElementById('dm-chatroom-btns-page');
	var dmChatroomPage = document.getElementById('dm-chatroom');
	const logout = document.getElementById(`dm-backarrow`);

	/*                              */
	/* Functions with HTML involved */
	/*                              */
	// - If username changes, also broadcast to others that it changed too
	// - It is an event listener that continuously checks for input
	usernameInputEle.addEventListener('input', function(event) {
		yourNickname = usernameInputEle.value;
		changeFromNickname();
		saveCookie("dm-name=", yourNickname);
	});
	// This is to go to the chatroom buttons
	logout.addEventListener('click', function() {
		dmChatButtonsPage.classList.add('active');
		dmChatroomPage.classList.remove('active');
	})
	// Message text box event listener when press enter
	chatForm.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') { sendMessage(); }
	});
	// Send button event listener when clicked
	sendButton.addEventListener('click', () => { sendMessage(); });
	// Give text to create a new html element
	function appendMessage(otherId, nickname, message) {
		console.log("appendmessage: " + toId);
		// Must be when you click a username, you will see messages appear then
		if ( toId === otherId || otherId === "client" ) {
			var messagesEle = document.getElementById('dm-log');
			var boxEle = document.createElement("div");
			var messagesListEle = document.createElement("div");
			boxEle.id = "dm-box";
			messagesListEle.textContent = nickname + ": " + message;
			messagesListEle.id = "textmsg";
			messagesEle.prepend(boxEle);
			boxEle.appendChild(messagesListEle);
		};
	}
	// Show a "no users" message when there are no users
	function appendNoUserlist() {
		var nobodyTextEle = "<h3>" + "nobody is here" + "</h3>";
		var usersEle = document.getElementById('dm-chatroom-btns');
		var createUserListEle = document.createElement("li");
		createUserListEle.innerHTML = nobodyTextEle;
		createUserListEle.id = "noUserlist";
		usersEle.appendChild(createUserListEle);
	}
	// Delete the no users message when there is somebody
	function deleteNoUserlist() {
		var allListsEle = document.querySelectorAll('li');
		var nobodyTextEle = "<h3>" + "nobody is here" + "</h3>";
		var targetElement = Array.from(allListsEle).find(el => el.innerHTML === nobodyTextEle);
		if (targetElement) { targetElement.remove(); };
	}
	// Add a singular new user to left pane
	function addUser(nickname, dataToId, fromId) {
		// Click to get uuid
		var createUserListEle = document.createElement("li");
		var usersEle = document.getElementById('dm-chatroom-btns');
		var usersTextEle = document.createElement("p");
		
		createUserListEle.addEventListener("click", () => {
			// Add active class to target element
			dmChatroomPage.classList.add('active');
			dmChatButtonsPage.classList.remove('active');

			// setup your id for others
			toId = dataToId;
			// clear message array then show up array from local storage
			var clearAll = document.querySelectorAll("#textmsg");
			clearAll.forEach(e => e.remove());
			var getMessages = readStorage(dataToId + "=" + fromId);
			// if getMessages array does not exist yet, because nobody messaged
			if (getMessages != null) {
				// Append array of messages from local storage
				var parsedMessages = getMessages;
				for (var i = 0; i < parsedMessages.length; i++) {
					appendMessage(toId, parsedMessages[i].username, parsedMessages[i].message);
				}
			}
		});
		
		createUserListEle.style = "cursor: pointer;"; 
		createUserListEle.id = dataToId; 
		createUserListEle.classList.add("usernameBtns");

		usersTextEle.classList.add("hoverButton"); 
		usersTextEle.textContent = nickname;

		usersEle.appendChild(createUserListEle); 
		createUserListEle.appendChild(usersTextEle);
	}
	function clearUsers() {
		var userClear = document.querySelectorAll(".usernameBtns");
		userClear.forEach(e => e.remove());
		var userClear = document.getElementById("noUserlist");
		if (userClear) { userClear.remove(); };
	}
	// Delete a singular user when they left on the left pane
	function delUser(nickname, dataToId) {
		clearUsers();
		var targetElement = document.getElementById(dataToId);
		if (targetElement) { targetElement.remove(); };
	}
	// When somebody changes their username, you will reflect it
	// with this function and see change on left pane
	function changeToNickname(nickname, toId) {
		var name = document.getElementById(toId);
		name.textContent = nickname;
	}
	// When you send message in message box, send your information and message
	function sendMessage() {
		try {
			var messageInputEle = document.getElementById('dm-msg');
			if(ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({
					type: "message", message: messageInputEle.value,
					toId: toId
				}));
			};
			messageInputEle.value = '';
			messageInputEle.focus();
		} catch (error) { console.warn(error); };
	};
	/*                                     */
	/* End of functions with HTML involved */
	/*                                     */

	// Change your own username
	function changeFromNickname() {
		if(ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify({
				type: "nicknameChange", fromId: fromId,
				nickname: yourNickname, privId: privId
			}));
		}
	}

	// Get cookie value
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

	// Save cookie
	function saveCookie(id, value) {
		// Comment below for debugging
		document.cookie = id + value;
	}

	// - To remember an array of JSON messages, store in local storage
	// - Warning / TODO: If you have multiple tabs, this will make
	// duplicate messages in the localStorage.
	function saveStorage(toUuid, message, username) {
		// if no localstorage for item exists
		if (localStorage.getItem(toUuid + "=" + fromId) === null) {
			var array = new Array();
			array.push( {username, message} );
			localStorage.setItem(toUuid + "=" + fromId, JSON.stringify(array));
		} else {
			// Add message on top of array
			var array = localStorage.getItem(toUuid + "=" + fromId);
			var parsedArray = JSON.parse(array);
			parsedArray.push( {username, message} );
			localStorage.setItem(toUuid + "=" + fromId, JSON.stringify(parsedArray));
		};
	};

	// Get the JSON message + name array data from local storage
	function readStorage(name) {
		var getter = localStorage.getItem(name);
		var parsedGetter = JSON.parse(getter);
		return parsedGetter;
	};

	function establishConnection() {
		ws = new WebSocket(wss);
		clearUsers();

		// When websocket is open
		ws.onopen = function(e) {
			// Check if username is already stored in a cookie
			// And also setup things with username, fromId and privId
			console.warn("privId: " + getCookie("privId"));
			if (getCookie("privId") !== null) {
				console.warn("yes");
				var usernameInputEle = document.getElementById('dm-nme');
				usernameInputEle.setAttribute('value', getCookie("dm-name"));
				yourNickname = getCookie("dm-name");
				fromId = getCookie("fromId");
				privId = getCookie("privId");
				ws.send(JSON.stringify({
							type: "cookie", fromId: fromId,
							privId: privId, nickname: yourNickname
						}));
				ws.send(JSON.stringify( {type: "userlist"} ));
			} else {
				console.log("no");
				var loop = ["uuid", "privUuid", "nickname", "add", "userlist"];
				for (let i = 0; i < loop.length; i++) {
					ws.send(JSON.stringify( {type: loop[i]} ));
				}
			};
		};

		// When websocket sends you a message
		ws.onmessage = function(msg) {
			var data = JSON.parse(msg.data);

			// - For loading userlist
			// - Check if it is an array; for userlist, which is whole list of users
			switch (data.type) {
				case "userlist":
					// if more than one object exists in array
					if (Object.keys(data.arrayWithoutFromClient).length > 0) {
						for (let i = 0; i < Object.keys(data.arrayWithoutFromClient).length; i++) {
							users += 1;
							let obj = data.arrayWithoutFromClient[i];
							addUser(obj.nickname, obj.toId, fromId);
						};
					} else {
						appendNoUserlist();
					};
					break;
				// At start, get your own public uuid from server
				case "uuid":
					fromId = data.fromId;
					saveCookie("fromId=", data.fromId);
					break;
				// At start, get your own private uuid from server
				case "privUuid":
					privId = data.privId;
					saveCookie("privId=", data.privId);
					break;
				// Set default username
				case "nickname":
					yourNickname = data.nickname;
					var usernameInputEle = document.getElementById('dm-nme');
					usernameInputEle.value = yourNickname;
					saveCookie("dm-name=", data.nickname);
					break;
				// Add single user
				case "adduser":
					users += 1;
					console.log("adding user: " + data.nickname + " " + data.toId + " " + fromId);
					addUser(data.nickname, data.toId, fromId);
					var checkIfUserlist = document.getElementsByClassName("noUserlist")
					// Remove "nobody is here" text if one user exists
					if (users > 1 || users == 1 && checkIfUserlist) {
						deleteNoUserlist();
					}
					break;
				// Delete single user
				case "deluser":
					users -= 1;
					console.log("deleting user: " + data.nickname + " " + data.toId);
					delUser(data.nickname, data.toId);
					// Add "nobody is here" text
					if (users == 0) { appendNoUserlist(); }
					break;
				// Load a message
				case "message":
					// Need to differentiate when they send message to you,
					// so it will show message and store in the right array
					if (data.toId == fromId) {
						appendMessage(data.fromId, data.nickname, data.message);
						saveStorage(data.fromId, data.message, data.nickname);
					} else {
						appendMessage(data.toId, data.nickname, data.message);
						saveStorage(data.toId, data.message, data.nickname);
					}
					break;
				// Change other person's username to reflect change
				case "nicknameChange":
					// Change element with class=data.toId innerHTML to data.nickname
					changeToNickname(data.nickname, data.toId);
					break;
				case "alreadyConnected":
					if (alreadyConnected === false) {
						console.log("loading");
						clearUsers();
						addUser("You are already connected on another browser/tab", 0, 0);
						alreadyConnected = true;
					};
				// - Log when you get websocket closed from server
				// because of you being already connected
				default:
					var caseMessage = ["notAvailable", "This user is not available right now",
									  "userDeleted", "This user was either deleted or never existed",
									  "notSelected", "You haven't clicked a user yet"];
					for (let i = 0; i < caseMessage.length; i += 2) {
						if (data.type === caseMessage[i]) {
							appendMessage("client", "Client", caseMessage[i + 1]);
							break;
						};
					};
					break;
			};
		};

		// When websocket closes
		ws.onclose = function(e) {
			if (alreadyConnected === false) {
				appendMessage("client", "Client", "Connection closed, reconnecting...");
				setTimeout(reconnect, 2000);
			};
		};
	};

	// Function to reconnect
	function reconnect() {
		establishConnection(wss); // Attempt to reconnect
		var reconnectDelay = 2000; // Increase delay for next attempt
	};

	// Establish the initial connection
	establishConnection(wss);
};
