(function() {
	window.addEventListener('load', function() {
	    var msg2 = document.getElementById("msg3"); // Message input field
	    var nme2 = document.getElementById("nme3"); // Username input field
	    var log2 = document.getElementById("log3"); // Log container for messages
	    var pick2 = document.getElementById("colorpicker3"); // Username's Colorpicker
	    var message2 = document.getElementById("message3");
		let conn;
	
	    // Function to generate a random color
	    function getRandomColor() {
	        return "#" + Math.random().toString(16).slice(2, 8).padStart(6, "0");
	    }
	
		// Random digit
		function getRandomDigit() {
		    return Math.floor(Math.random() * 9999) + 1;
		}
	
	    // Function to set background-color and text color
	    function setColor(element, color) {
	        element.style.backgroundColor = color;
	        element.style.color = "#FFFFFF"; // Default text color (white)
	    }
	
		// Function to set username
		function setName(element, string) {
			nme2.value = string;
		}
	
	    // Function to set a cookie
	    function setCookie(name, value, days) {
	        const date = new Date();
	        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
	        const expires = "expires=" + date.toUTCString();
	        document.cookie = name + "=" + value + ";" + expires + ";path=/";
	    }
	
	    // Function to get a cookie by name
	    function getCookie(name) {
	        const cookies = document.cookie.split(";"); // Split cookies into an array
	        for (let i = 0; i < cookies.length; i++) {
	            let cookie = cookies[i].trim(); // Trim whitespace
	            if (cookie.startsWith(name + "=")) {
	                return cookie.substring((name + "=").length); // Return the value of the cookie
	            }
	        }
	        return null; // Return null if the cookie is not found
	    }
	
	    // Check if a username is stored in cookies
	    var userName = getCookie("nme2");
	    if (!userName) {
	        // Generate a random color if no cookie exists
			var userName = "Guest" + getRandomDigit();
	        setCookie("nme2", userName); // Store the username in a cookie
	    }
	
	    // Apply the stored or newly generated name
	    setName(nme2, userName);
	
	    // Add event listener to change the username
	    nme2.addEventListener('input', function() {
			var newName = this.value;
	        setCookie("nme2", newName); // Update the cookie with the new username
	        setName(nme2, newName); // Apply the new username
	        //console.log(`New Name: ${newName}`);
	    });
	
	    // Check if a color is stored in cookies
	    var userColor = getCookie("color");
	    if (!userColor) {
	        // Generate a random color if no cookie exists
	        var userColor = getRandomColor();
	        setCookie("color", userColor); // Store the color in a cookie
	    }
	
	    // Apply the stored or newly generated color
	    setColor(pick2, userColor);
	
	    // Add click event listener to change the color
	    pick2.onclick = function() {
	        const newColor = getRandomColor(); // Generate a new random color
	        setCookie("color", newColor, 365); // Update the cookie with the new color
	        setColor(pick2, newColor); // Apply the new color
	        //console.log(`New Color: ${newColor}`);
	    };
	
		// Handle the form submission for sending messages
	    message2.onsubmit = function() {
	        if (!conn) {
	            return false;
	        }
	        if (!msg2.value) {
	            return false;
	        }
	
		// Send username and message as JSON to the server
		const fullMessage = {
			username: nme2.value,
			color: getComputedStyle(pick2).backgroundColor,
			text: msg2.value,
		};
	
		//console.log("Sending message:", JSON.stringify(fullMessage));
		conn.send(JSON.stringify(fullMessage));
		    // Clear the message input field
	        msg2.value = "";
	        return false;
	    };
		  
		// Check if the browser supports WebSocket
	    if (window["WebSocket"]) {
			function establishConnection() {
			    // Establish a WebSocket connection to the server
				conn = new WebSocket("wss://" + "chat3.bzmb.eu" + "/ws");
	
				// Event handler when open
				conn.onopen = function(evt) {
					console.log("%c Connection established to chat", "color: lightgreen");
				};
			    // Event handler for when the WebSocket connection is closed
		        conn.onclose = function(evt) {
					console.log("%c Connection closed, reconnecting...", "color: red");
					setTimeout(reconnect, 2000); // Reconnect after a delay
		        };
				// Event handler for when a message is received from the server
				conn.onmessage = function(evt) {
				    try {
				        // Log raw data for debugging
				        //console.log("Raw data received:", evt.data);
	
				        // Parse the incoming JSON string into a JavaScript object
				        const data = JSON.parse(evt.data);
	
				        // Log parsed data for debugging
				        //console.log("Parsed data:", data);
	
				        // Ensure `data` has both `username` and `text`
				        if (!data.username || !data.text) {
				            console.error("Parsed data is missing username or text:", data);
				            return;
				        }
	
				        // Display username and message
				        const item = document.createElement("div");
						item.id = 'box3';
	
				        // Create a span for the username with bold styling
				        const nameDiv = document.createElement("div");
				        nameDiv.textContent = data.username + ": ";
						nameDiv.style.color = data.color; // Make the color recieved from server
				        // nameDiv.style.fontWeight = "bold"; // Make username bold
	
				        // Create a div for the message text (on a new line)
				        const messageDiv = document.createElement("div");
				        messageDiv.textContent = data.text;
	
				        // Append elements to display the message in the chat log
				        item.appendChild(nameDiv); // Add username span
				        item.appendChild(messageDiv); // Add message div
	
				        // Append the constructed item to the chat log
						appendLog(item);
				    } catch(error) {
				        console.error("Error processing WebSocket message:", error);
				    }
				};
	
				// Append log function implementation (ensure this exists)
				function appendLog(item) {
				    if (!log2) {
				        console.error("Chat log container not found!");
				        return;
				    }
				    log2.prepend(item);
				}
			}
	
		    // Function to reconnect
		    function reconnect() {
		        console.log('Reconnecting...');
		        establishConnection(); // Attempt to reconnect
		        var reconnectDelay = 2000; // Increase delay for next attempt
		    }
	
		    // Establish the initial connection
		    establishConnection();
	    } else {
			// If WebSockets are not supported by the browser, display an error message
	        var item = document.createElement("div");
	        item.innerHTML = "<b>Your browser does not support WebSockets.</b>"; // Bold error message
	        appendLog(item); // Append the error message to the log
	    }
	});
})();
