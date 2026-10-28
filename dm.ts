// Setup basic express server
import { Server, Socket } from "socket.io"

interface ServerToClientEvents {
  'log': (a: { username: string, message: string }[]) => void;
  'new message': (a: string, b: string) => void;
	'add to userlist': (a: string) => void;
	'remove from userlist': (a: string) => void;
	'userlist': (a: string[]) => void;
}

interface ClientToServerEvents {
	'username': (a: string) => void;
	'username list': () => void;
	'join room': (newRoomname: string[]) => void;
	'new message': (a: string, b: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const CHAT_LOG_LIMIT_AMNT: number = 100

import { createServer } from "http";
const httpServer = createServer().listen(5001, "0.0.0.0");

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
	transports: ["websocket"],
//	path: '/socketio_dm/',
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
})

// Chatroom
const outerArray: {
	connected: boolean[],
	roomname: string[], 
	data: {
		username: string,
		message: string
	}[]
}[] = []

const usernames: string[] = []

io.on('connection', (socket: Socket<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>) => {
	var roomname: string[] = []
	var yourUsername: string = ""

	socket.on('disconnect', () => {
		if (usernames.includes(yourUsername)) {
			removeUser(yourUsername)
		}

		console.log("Disconnected: " + usernames)
	})

	socket.on('username', (username: string) => {
		console.log("Connected user: " + username)
		if (yourUsername != username && usernames.includes(yourUsername)) {
			removeUser(yourUsername)
		}

		addUser(username)
		console.log("Connected: " + usernames)
	})

	socket.on('username list', () => {
		userList()
		console.log("Userlist: " + usernames)
	})

	socket.on('join room', (newRoomname: string[]) => {
		console.log("========================JOIN")
		const correctOrderRoomname = correctOrderArray(newRoomname)

		console.log("Joining room: " + correctOrderRoomname)
		joinRoom(roomname, correctOrderRoomname)

		socket.emit('log', getChatlog(correctOrderRoomname, yourUsername))
		console.log("JOIN========================")
	})

  socket.on('new message', (username: string, message: string) => {
		console.log("========================NEW MESSAGE")
		console.log("ROOMNAME RECEIVED: " + roomname)

    setupChatlog(username, message, roomname)

		console.log("ROOMNAME: " + roomname)
		console.log("New message received: " + 
      roomname + ": " + username + ": " + message)

    io.to(JSON.stringify(roomname)).emit("new message", username ,message)

		outerArray.forEach((array) => console.log("Room names available: " + array.roomname))

		console.log("NEW MESSAGE========================")
  })

	function addUser(username: string) {
		yourUsername = username
		usernames.push(username)
		socket.broadcast.emit('add to userlist', yourUsername)
	}

	function removeUser(yourUsername: string) {
		var index = usernames.indexOf(yourUsername)
		usernames.splice(index, 1)
		socket.broadcast.emit('remove from userlist', yourUsername)
	}

	function userList() {
		const remove = usernames.filter((array) => array !== yourUsername)
		socket.emit('userlist', remove)
	}

	function correctOrderArray(newRoomname: string[]) {
		const matchingRoom = outerArray.find( (array) =>
			arraysMatch(array.roomname, newRoomname) 
		)

		console.log(matchingRoom)
		if (matchingRoom) {
			outerArray.forEach((array) => console.log("found: " + array.roomname))
			console.log("Right order: " + matchingRoom.roomname)
			return matchingRoom.roomname
		}

		console.log("Right order: " + newRoomname)
		return newRoomname
	}

	function joinRoom(oldRoom: string[], newRoom: string[]) {
		socket.leave(JSON.stringify(oldRoom))
		roomname = newRoom
		console.log("roomname: " + roomname)
		console.log("new roomname: " + newRoom)
    socket.join(JSON.stringify(newRoom))
	}
})

function arraysMatch (arr1: string[], arr2: string[]) {
	console.log("========================ARRAYS MATCH")

	console.log("L I S T of chatrooms:" + outerArray)
	// Instantiate a copy of both variables

	// Because if both are matching,
	// The parameters treat it as one;
	// If you modify arr1, it would also modify arr2
	arr1 = Array.from(arr1)
	arr2 = Array.from(arr2)
	
	console.log("ROOMNAME3 (in array): " + arr1)
	console.log("ROOMNAME4 (client sent): " + arr2)

	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
			console.log("i: " + i + " word: " + arr1[i])
			var matched = false
			for (var j = 0; j < arr2.length; j++) {
				console.log("j: " + j + " word: " + arr2[j])
				if (arr1[i] === arr2[j]) {
					console.log("matched: " + arr1[i] + " " + arr2[j])
					matched = true
					console.log("ROOMNAME7 (should stay same): " + arr1)
					console.log("ROOMNAME8: " + arr2)
					arr2.splice(j, 1)
					console.log("ROOMNAME9 (should stay same):" + arr1)
					console.log("ROOMNAME10: " + arr2)
					break
				}
			}
			if (matched === false) {
				console.log("false")
				return false
			}
			console.log("hit end")
	}

	console.log("ROOMNAME99: " + arr1)
	console.log("ROOMNAME100 (should be empty): " + arr2)


	// Otherwise, return true
	console.log("true")
	console.log("ARRAYS MATCH========================")
	return true
}

function getChatlog(roomname: string[], yourUsername: string) {
	const room = outerArray.find((array) => 
		arraysMatch(array.roomname, roomname)
	)

	if ( room && room.roomname.includes(yourUsername) ) {
		var chatLog = room.data
		return chatLog
	}

	return []
}

function setupChatlog(username: string, message: string, yourRoomname: string[]) {
	var room = outerArray.find( (array) =>
		arraysMatch(array.roomname, yourRoomname)
	)

	if (!room) {
		room = {connected: [], roomname: yourRoomname, data: []}
		outerArray.push(room)
	}

	console.log("new message to send")

	room.data.push({username, message})

	if (room.data.length > CHAT_LOG_LIMIT_AMNT) {
		room.data.shift()
	}
}