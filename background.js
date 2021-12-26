chrome.commands.onCommand.addListener((command) => {
  if (command === 'hello') {
    console.log("Hello there! ^^");
    chrome.windows.getCurrent(function (currentWindow) {
      chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
          activeTabs.map(function (tab) {
              chrome.tabs.executeScript(tab.id, { file: 'insert.js', allFrames: false });
          });
      });
  });
  }
});
