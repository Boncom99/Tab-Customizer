chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "changeTabProperties") {
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: setTabProperties,
      args: [message.newTitle, message.newIcon]
    });
  }
});
// Load stored name and URL on extension start
chrome.storage.local.get(['selectedName', 'selectedURL'], function(data) {
  if (data.selectedName && data.selectedURL) {
    setTabProperties(data.selectedName, data.selectedURL);
  }
});
function setTabProperties(newTitle, newIcon) {
  document.title = newTitle;
  const links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    if(links[i].getAttribute('rel').includes('icon')){
      if(newIcon){
          links[i].setAttribute('href', newIcon);
      }
      else{
      links[i].setAttribute('href', 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196');
      }
    }
  }
}
