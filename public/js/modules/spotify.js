'use strict';

function spotify() {
    const spotifyDiv = document.getElementById('spotify');
    const urlInput = document.getElementById('url-music');
    const url = urlInput.value;

    // Clear previous iframe
    spotifyDiv.innerHTML = '';

    // Create iframe
    const iframe = document.createElement('iframe');
    // Append to DOM first, then set src (ensures reliability)
    spotifyDiv.appendChild(iframe);

    // Create iframe and directly assign src
    urlInput.addEventListener('input', () => {
        const url = urlInput.value;
        iframe.src = url;

        // Clear previous content
        //spotifyDiv.innerHTML = '';

        iframe.src = url;
        iframe.style.width = '300px';
        iframe.style.height = '380px';
        iframe.style.border = 'none';
    });
}
