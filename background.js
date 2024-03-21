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
  else if(message.type === 'deleteIcon'){
    chrome.scripting.executeScript({
      target: {tabId: message.tabId},
      function: deleteIcon,
      args: [message.iconToDelete]
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId ,changeInfo,_tab) => {
  const numberTabId=parseInt(tabId)
   if (changeInfo.status === 'complete') {
    chrome.storage.local.get([`${tabId}`], function(response) {
      const data=response[tabId]
        if(!data){
          return
        }
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
    if(links[i].getAttribute('rel').includes('icon') && links[i].getAttribute('sizes') === "32x32"){
        iconHref=links[i].href
        break;
    }
  }
  if(!iconHref){
    //same search without the size filter
    for (let i = 0; i < links.length; i++) {
      if(links[i].getAttribute('rel').includes('icon')){
          iconHref=links[i].href
          break;
      }
    }
  }
  // if(iconHref){
     chrome.storage.local.get(['icons'], function(result) {
      const icons=result.icons
      const newObj={...icons, [newIconName]: iconHref}
       chrome.storage.local.set({icons:newObj});
    })
  // }

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
      chrome.storage.local.set({icons:newObj},
  /*        function(){
        //empty both selects
        const iconInput = document.getElementById('iconInput');
        iconInput.innerHTML = '';
        const iconToDeleteInput = document.getElementById('iconToDeleteInput');
        iconToDeleteInput.innerHTML = '';
        let emptyOpt = document.createElement('option');
        emptyOpt.value = '';
        emptyOpt.text = ''
        iconInput.appendChild(emptyOpt);
        iconToDeleteInput.appendChild(emptyOpt.cloneNode(true));
        Object.entries(newObj).forEach(([text, value])=> {
          let opt = document.createElement('option');
          opt.value = text;
          opt.text = value
          iconToDeleteInput.appendChild(opt);
          iconToDeleteInput.appendChild(opt.cloneNode(true));
        })
      }*/
      );
    })
  }
