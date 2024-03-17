chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "changeTitle") {
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: setTabProperties,
      args: [message.newTitle]
    });
  }
});

function setTabProperties(newTitle) {
  document.title = newTitle;
  const links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    if (links[i].getAttribute('rel').includes( 'icon')) {
        links[i].removeAttribute('href');
    }
  }
}
