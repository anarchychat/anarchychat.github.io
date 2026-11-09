import type { Server } from "socket.io"
import { Socket } from "socket.io"

export async function registerDm(io: Server) {
	console.log("Starting dm.ts")

	interface ServerToClientEvents {
		'log': (a: { username: string, message: string, color: string }[]) => void
		'new message': (a: string, b: string, c: string) => void
		'add to userlist': (a: string, b: string) => void
		'remove from userlist': (a: string) => void
		'userlist': (a: {username: string, color: string}[]) => void
	}

	interface ClientToServerEvents {
		'username': (a: string, b: string) => void
		'username list': () => void
		'join room': (newRoomname: string[]) => void
		'new message': (a: string, b: string, c: string) => void
	}

	interface InterServerEvents {
		ping: () => void
	}

	interface SocketData {
		name: string
		age: number
	}

	const CHAT_LOG_LIMIT_AMNT: number = 100

	// Chatroom
	const chatrooms: {
		connected: boolean[],
		roomname: string[], 
		data: {
			username: string,
			message: string,
			color: string
		}[]
	}[] = []

	const usernames: {username: string, color: string}[] = []

	io.on('connection', (socket: Socket<
		ClientToServerEvents,
		ServerToClientEvents,
		InterServerEvents,
		SocketData
	>) => {
		var roomname: string[] = []
		var yourUsername: string = ""

		socket.on('disconnect', () => {
			if (usernames.some(e => e.username === yourUsername)) {
				removeUser(yourUsername)
			}

			console.log("Disconnected: " + usernames)
		})

		socket.on('username', (username: string, color: string) => {
			console.log("Connected user: " + username)
			if (yourUsername != username && usernames.some(e => e.username === yourUsername)) {
				removeUser(yourUsername)
			}

			addUser(username, color)
			console.log("Connected: ", usernames)
		})

		socket.on('username list', () => {
			userList()
			console.log("Userlist: ", usernames)
		})

		socket.on('join room', (newRoomname: string[]) => {
			console.log("========================JOIN")
			const correctOrderRoomname = correctOrderArray(newRoomname)

			console.log("Joining room: " + correctOrderRoomname)
			joinRoom(roomname, correctOrderRoomname)

			socket.emit('log', getChatlog(correctOrderRoomname, yourUsername))
			console.log("JOIN========================")
		})

		socket.on('new message', (username: string, message: string, color: string) => {
			console.log("========================NEW MESSAGE")
			console.log("ROOMNAME RECEIVED: " + roomname)

			setupChatlog(username, message, color, roomname)

			console.log("ROOMNAME: " + roomname)
			console.log("New message received: " + 
				roomname + ": " + username + ": " + message)

			io.to(JSON.stringify(roomname)).emit("new message", username ,message, color)

			chatrooms.forEach((array) => console.log("Room names available: " + array.roomname))

			console.log("NEW MESSAGE========================")
		})

		function addUser(username: string, color: string) {
			yourUsername = username
			usernames.push({username: username, color: color})
			socket.broadcast.emit('add to userlist', yourUsername, color)
		}

		function removeUser(yourUsername: string) {
			var index = usernames.findIndex(e => e.username === yourUsername)
			usernames.splice(index, 1)
			socket.broadcast.emit('remove from userlist', yourUsername)
		}

		function userList() {
			const remove = usernames.filter((array) => array.username !== yourUsername)
			console.log("remove: ", remove)
			socket.emit('userlist', remove)
		}

		function correctOrderArray(newRoomname: string[]) {
			const matchingRoom = chatrooms.find( (array) =>
				arraysMatch(array.roomname, newRoomname) 
			)

			console.log(matchingRoom)
			if (matchingRoom) {
				chatrooms.forEach((array) => console.log("found: " + array.roomname))
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

		console.log("L I S T of chatrooms:" + chatrooms)
		// Instantiate a copy of both variables

		// Because if both are matching,
		// The parameters treat it as one
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
		const room = chatrooms.find((array) => 
			arraysMatch(array.roomname, roomname)
		)

		if ( room && room.roomname.includes(yourUsername) ) {
			var chatLog = room.data
			return chatLog
		}

		return []
	}

	function setupChatlog(username: string, message: string, color: string, yourRoomname: string[]) {
		var room = chatrooms.find( (array) =>
			arraysMatch(array.roomname, yourRoomname)
		)

		if (!room) {
			room = {connected: [], roomname: yourRoomname, data: []}
			chatrooms.push(room)
		}

		console.log("new message to send")

		room.data.push({username, message, color})

		if (room.data.length > CHAT_LOG_LIMIT_AMNT) {
			room.data.shift()
		}
	}
}