chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "changeTabProperties") {
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: setTabProperties,
      args: [message.newTitle, message.newIcon, message.newEmoji]
    });
  }
  else if(message.type === 'removeCurrentIcon'){
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: removeCurrentIcon,
      args: [message.favIconUrl]
    });
  }
  else if(message.type === 'saveNewIcon'){
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: saveNewIcon,
      args: [message.newIconName, message.favIconUrl]
    });
  }
  else if(message.type === 'deleteIcon'){
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: deleteIcon,
      args: [message.iconToDelete]
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
          args: [data.name, data.icon, data.emoji]
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
//TODO does not work
//the icon persists
function removeCurrentIcon(favIconUrl) {
  const head = document.getElementsByTagName('head')[0]; // Get the head element
  const links = head.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    if(links[i].getAttribute('href') ==='favIconUrl'){
      links[i].setAttribute('width', '1');
        links[i].setAttribute('height', '1');
        links[i].setAttribute('href','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wdAAwAB/EPK1nAAAAAElFTkSuQmCC');
        // links[i].remove()
        
    }
  }
}

function saveNewIcon(newIconName, favIconUrl){
     chrome.storage.local.get(['icons'], function(result) {
      const icons=result.icons
      const newObj={...icons, [newIconName]: favIconUrl}
       chrome.storage.local.set({icons:newObj});
    })

}
  function deleteIcon(iconToDelete){
    chrome.storage.local.get(['icons'], function(result) {
      const icons=result.icons
      const newObj={...icons}
      //delete key that the value is iconToDelete
        Object.entries(icons).forEach(([text, value])=> {
            if(value===iconToDelete){
            delete newObj[text]
            }
        })
      chrome.storage.local.set({icons:newObj});
    })
  }