'use strict';

function game() {
    var inputGame = document.getElementById("gameURL");

    inputGame.addEventListener('input', function(event) {
        var yourGame = inputGame.value;
        loadGame(yourGame);
        saveCookie("game=", yourGame);
    })

    function saveCookie(id, value) {
		// Comment below for debugging
		document.cookie = id + value;
	}

    // Get cookie value
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

    console.log(getCookie("game"));
    if (getCookie("game") !== undefined && getCookie("game") !== null) {
        console.log(getCookie("game"));
        inputGame.value = yourGame = getCookie('game');
        var yourGame = inputGame.value;
        loadGame(yourGame);
    }

    function loadGame(url) {
        var appendGame = document.getElementById('gameFrame');
		var appendHttps = "https://";

        console.log("Check gameFrame: " + appendGame.childNodes.length);
        if (appendGame.childNodes.length <= 1) {
            console.warn("LOADING GAME: " + appendHttps + url);
            var frameGame = document.createElement('iframe');
            frameGame.src = appendHttps + url;
            frameGame.id = "gameBox";
            frameGame.style.cssText = "width: 100%; height: 100%;";
            appendGame.appendChild(frameGame);
        } else {
            console.warn("LOADING GAME: " + appendHttps + url);
            var frameGame = document.getElementById("gameBox");
            frameGame.src = appendHttps + url;
        }
    }
};
