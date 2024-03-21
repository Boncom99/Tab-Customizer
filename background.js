chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "changeTabProperties") {
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: setTabProperties,
      args: [message.newTitle, message.newIcon]
    });
  }
  else if(message.type === 'saveNewIcon'){
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: saveNewIcon,
      args: [message.newIconName]
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId ,changeInfo,_tab) => {
  const numberTabId=parseInt(tabId)
   if (changeInfo.status === 'complete') {
    chrome.storage.local.get([`${tabId}`], function(response) {
      const data=response[tabId]
      if (data.name || data.icon) {
        // setTabProperties(data.name, data.icon);
        chrome.scripting.executeScript({
          target: {tabId: tabId},
          function: setTabProperties,
          args: [data.name, data.icon]
        });
      }
    });
   }
});

function setTabProperties(newTitle, newIcon) {
  if(newTitle){
  document.title = newTitle;
  }
  if(!newIcon){
    return
  }
  const head = document.getElementsByTagName('head')[0]; // Get the head element
  const links = head.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    if(links[i].getAttribute('rel').includes('icon')){
          links[i].setAttribute('href', newIcon);
    }
  }
}

function saveNewIcon(newIconName){
  const head = document.getElementsByTagName('head')[0]; // Get the head element
  const links = head.getElementsByTagName('link');
  let iconHref;
  for (let i = 0; i < links.length; i++) {
    if(links[i].getAttribute('rel').includes('icon') && links[i].getAttribute('sizes') === "16x16"){
        iconHref=links[i].href
        break;
    }
  }
  // if(iconHref){
     chrome.storage.local.get(['icons'], function(result) {
      const icons=result.icons
      const newArray=[...icons, {text:newIconName, value:iconHref}]
       chrome.storage.local.set({icons:newArray},function(){
         const iconInput = document.getElementById('iconInput');
         let opt = document.createElement('option');
         opt.value = iconHref;
         opt.text = newIconName
         iconInput.appendChild(opt);
       });
    })
  // }

}