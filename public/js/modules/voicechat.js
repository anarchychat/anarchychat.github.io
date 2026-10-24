'use strict';

function music() {
    // Music feature
    const audio = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    //const prevBtn = document.getElementById('prevBtn');
    //const nextBtn = document.getElementById('nextBtn');
    const trackName = document.getElementById('trackName');
    //const trackArtist = document.getElementById('trackArtist');
    //const trackArt = document.getElementById('trackArt');
    const seekSlider = document.getElementById('seekSlider');
    const currentTime = document.getElementById('currentTime');
    const totalDuration = document.getElementById('totalDuration');
    const volumeSlider = document.getElementById('volumeSlider');

    /*let trackIndex = 0;
    const tracks = [
      { name: "Sample 1",
       src: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3" },
      { name: "Sample 2",
       src: "https://github.com/rafaelreis-hotmart/Audio-Sample-files/raw/master/sample.mp3" }
    ];*/

    // Load track info
    /*function loadTrack(index) {
      const track = tracks[index];
      trackName.textContent = track.name;
      audio.src = track.src;
    }*/

    // If play button is pressed
    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playPauseBtn.classList.remove("ti-player-play");
        playPauseBtn.classList.add("ti-player-pause");
      } else {
        audio.pause();
        playPauseBtn.classList.remove("ti-player-pause");
        playPauseBtn.classList.add("ti-player-play");
      }
    });

    // Acquire website name
    function getDomain(url) {
      try {
        return new URL(url).hostname;
      } catch (e) {
        return "Invalid URL";
      }
    }

    // Custom music url
    var customMusic = document.getElementById('url-music'); // Textbox
    customMusic.addEventListener('input', () => {
      const musicUrl = customMusic.value;
      trackName.textContent = getDomain(musicUrl); // website name as song name
      audio.src = musicUrl;
      audio.play();
      playPauseBtn.classList.remove("ti-player-play");
      playPauseBtn.classList.add("ti-player-pause");
    });

    // Time updater
    audio.addEventListener('timeupdate', () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      seekSlider.value = percent || 0;

      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60);
      currentTime.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    });

    // Time seeker
    seekSlider.addEventListener('change', () => {
      const seekTime = (seekSlider.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    });

    // Volume seeker
    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value / 100;
    });

    // If ended go to next track
    /*audio.addEventListener('ended', () => nextBtn.click());*/

    // Previous button
    /*prevBtn.addEventListener('click', () => {
      trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
      loadTrack(trackIndex);
      audio.play();
    });*/

    // Next button
    /*nextBtn.addEventListener('click', () => {
      trackIndex = (trackIndex + 1) % tracks.length;
      loadTrack(trackIndex);
      audio.play();
    });*/

    // Load first track
    /*loadTrack(trackIndex);*/
};
