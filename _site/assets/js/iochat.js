document.addEventListener('DOMContentLoaded', function() {

  const elementIds = ['toggleButtonChat', 'thirdChatServer', 
                      'toggleButtonSidebar', 'sidebars', 
                     'toggleButtonSidebarDesktop', 
                      'toggleButtonFullscreen', 
                     'secondChatButton', 'secondChatServer', 
                     'firstDrawButton', 'firstDrawServer', 
                      'secondChatButtonMobile', 'gamePageButton', 
                      'gamePage'];

  const elements = {};

  for (const id of elementIds) {
    const element = document.getElementById(id);
    if (element) {
      elements[id] = element;
    }
  }

  elements.toggleButtonChat.addEventListener('click', () => {
    elements.thirdChatServer.classList.toggle('active');
  });
  elements.toggleButtonSidebar.addEventListener('click', () => {
    elements.sidebars.classList.toggle('active');
  });
  elements.toggleButtonSidebarDesktop.addEventListener('click', () => {
    elements.sidebars.classList.toggle('active');
  });

  elements.secondChatButton.addEventListener('click', () => {
    elements.secondChatServer.classList.toggle('active');
  });
  elements.firstDrawButton.addEventListener('click', () => {
    elements.firstDrawServer.classList.toggle('active');
  });
  elements.secondChatButtonMobile.addEventListener('click', () => {
    elements.secondChatServer.classList.toggle('active');
  });
  elements.gamePageButton.addEventListener('click', () => {
    elements.gamePage.classList.toggle('active');
  })
  
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  elements.toggleButtonFullscreen.addEventListener('click', 
                                                   toggleFullscreen);
});
