chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "refreshTab") {
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: refresh,
      args: []
    });
  }
    sendResponse();
});

chrome.tabs.onUpdated.addListener((tabId ,changeInfo,_tab) => {
  const numberTabId=parseInt(tabId)
   // if (changeInfo.status === 'complete') {
    chrome.storage.local.get([`${tabId}`], function(response) {
      const data=response[tabId]
        if(!data){
          return
        }
      if (data.name || data.icon || data.emoji) {
        chrome.scripting.executeScript({
          target: {tabId: tabId},
          function: setTabProperties,
          args: [data.name, data.icon, data.emoji||""]
        });
      }
    });
   // }
});

function setTabProperties(newTitle, newIcon, newEmoji) {
  if(newTitle){
  document.title = newTitle;
  }
  let newIconToInsert=newEmoji
  if(!newEmoji){
    if(!newIcon){
      return
    }
    newIconToInsert=newIcon
  }
  const head = document.getElementsByTagName('head')[0]; // Get the head element
  const links = head.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    if(links[i].getAttribute('rel').includes('icon')){
          links[i].setAttribute('href', newIconToInsert);
    }
  }
}

