'use strict';

console.log("testing perf");

function perf() {
    // Function to remove existing video-background elements
    function removeVideoBackground() {
      const existingVideos = document.querySelectorAll('#video-background');
      existingVideos.forEach(video => {
        video.remove();
      });
    }
  
    const override = true;

    // Good UI or faster version of site
    if (navigator.deviceMemory < 2 || performance.now() > 3000 || override == true) {
      console.log("low memory: " + navigator.deviceMemory);
      console.log("slow performance: " + performance.now());
      removeVideoBackground();
      
      const elements = document.querySelectorAll('.blur');
      console.log("elements: ", elements);
      elements.forEach((element, i) => {
        console.warn(element);
        element.classList.remove("blur");
        element.classList.add("plain-color");
      });
      const performanceMode = document.getElementById('performance-mode');
      performanceMode.classList.toggle('active');
      setTimeout(() => performanceMode.classList.toggle('active'), 2000);     
    } else {
      console.log("high memory: " + navigator.deviceMemory);
      console.log("fast performance: " + performance.now());
      console.log("fast enough cpu");

      const elements = document.querySelectorAll('.plain-color');
      elements.forEach((element, i) => {
        element.classList.remove("plain-color");
        element.classList.add("blur");
      });
    }
};
