document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  let canvas = document.getElementsByClassName("whiteboard")[0];
  let context = canvas.getContext("2d");
  //let ws = new WebSocket("wss://" + "draw2.bzmb.eu" + "/ws");
  let pick = document.getElementsByClassName("colorpicker-draw")[0];
  //let eraserButton = document.getElementById('eraser'); // Eraser
  let wipeButton = document.getElementById('wipe'); // Wipe
  var current = { color: 'black' };

  var drawing = false;
  let eraserState = 'grey'; // Initial state (off)
  let isErasing = false;

  // Eraser button (if toggle)
  /*eraserButton.onclick = function() {
    isErasing = !isErasing;
    if (isErasing) {
      eraserButton.style.backgroundColor = 'black';
      eraserState = 'black'; // Eraser mode on
      console.log("%c Erase Mode is on", "color: lightgreen");
      context.globalCompositeOperation = 'destination-out';
    } else {
      eraserButton.style.backgroundColor = 'grey';
      eraserState = 'grey'; // Eraser mode off
      console.log("%c Erase Mode is off", "color: lightgreen");
      context.globalCompositeOperation = 'source-over';
    }
  };*/

  // Clear whiteboard on client side
  wipeButton.onclick = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Function to generate a random color
  function getRandomColor() {
    return "#" + Math.random().toString(16).slice(2, 8).padStart(6, "0");
  }

  // Function to set background-color
  function setColor(element, color) {
    element.style.backgroundColor = color;
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

  // Check if a color is stored in cookies
  let userColor = getCookie("color");
  if (!userColor) {
    // Generate a random color if no cookie exists
    userColor = getRandomColor();
    setCookie("color", userColor); // Store the color in a cookie
  }

  // Apply the stored or newly generated color
  setColor(pick, userColor); // Remember last saved color
  current.color = userColor; // Change stroke to last saved color

  // Add click event listener to change the color
  pick.onclick = function () {
    const newColor = getRandomColor(); // Generate a new random color
    setCookie("color", newColor, 365); // Update the cookie with the new color
    setColor(pick, newColor); // Apply the new color
    current.color = newColor; // Change stroke to new color
    //console.log(`New Color: ${newColor}`);
  };

  // Drawing event websocket
  addEventListener('message', function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'drawing') {
      onDrawingEvent(data);
    }
  });

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  onResize();

  window.addEventListener('resize', onResize, false);

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();
      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
  }

  // Mouse support for desktop devices
  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

  // Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true, isErasing);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true, isErasing);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, isErasing);
  }

  function generateUniqueId() {
    var max = "999999";
    return Math.floor(Math.random() * max);
  }

  function drawLine(x0, y0, x1, y1, color, broadcast, isErasing){
    context.beginPath();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;

    // Glowing effect
    context.lineWidth = 5;             // Line thickness
    context.shadowBlur = 20;           // Amount of glow
    context.shadowColor = color;      // Glow color
    //

    if (isErasing) {
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = 20; // Thicker line for eraser
    } else {
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 2; // Thinner line for drawing
    }
    context.stroke();
    context.closePath();

    var w = canvas.width;
    var h = canvas.height;

    //console.log(clientId); // Know what your generated clientId is to the server
    
    JSON.stringify({
      type: isErasing ? 'erase' : 'drawing',
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      clientId: clientId
    });
  }

  const clientId = generateUniqueId(); // Assign once per session

});
