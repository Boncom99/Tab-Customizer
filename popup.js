document.addEventListener('DOMContentLoaded', function() {
    const changeTabPropertiesBtn = document.getElementById('changeTabPropertiesBtn');
    const titleInput = document.getElementById('titleInput');
    const iconInput = document.getElementById('iconInput');
    //save icon
    const saveIconBtn= document.getElementById('saveIconBtn')
    const saveIconName= document.getElementById('NameOfIcon')
    const deleteIconBtn= document.getElementById('deleteIconBtn')
    const iconToDeleteInput= document.getElementById('iconToDeleteInput');

    const options = {
        'Stack Overflow':   'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196',
        'Google Docs': 'https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico',
        'Google':
             'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAw1BMVEVHcEz////////9/f39/f79/f33+Pj////b3d74+fny8/P19vYAAAD////w8fH////////9/f3///8+fu7ZRCpBmEtNnVXaTDbbUz79/Pz0uCtIm1EqdO2FqPJplvDqpJ282MDifG87l0DW4fvXOBWqzrDvurbt8v55oPLkjIH00Mx0sHuRvpVpq3BrrHL2wEn51Y/4zHbw6eP4uBf86MP0sw6EpvJEhdRSie50prrFrCrsrqfqkSrssavxrDPP48yyx/Yvv4yqAAAAEnRSTlMAWZFT48ytmAumbmsCSV/Uv52LM4rJAAABN0lEQVQokY2SiXKCMBCGEUHBW5qQhGgRKopn7zq9ff+n6mZLNIAz7T/OZDdf8rO7xrL+p749Gg5Hdv8CsoOT7ApqBCU1TNYOKmrX2DpereJ1hf56LhhhjBHCFqazh0lCOOeMwW8e44Z3Nk0Y52TO+ZyQxDRGT7hH3kUQiDjRRSnWVMEH4+ShUnGzcH16/CKfl9pxYb2LomehNvLp9AWULyF2ATqw3kfRLZ6eXKEmNxA7f0Fti/BaCaC2HWNBUTjThRwBqnWsW3mTIS1aWYJtrlvBIWQ0DCne/T4Un8QhWL6K9hIo3e1pKg+TqdrxjcHv4G4o4YhMX43BW11MspRKKSlNM0y7+g9tYSpm281mO8NJBa3zU2hV52owy+oIE4lO+fl5/gkL36s93N7Adx3H9Qe9GioOlNMflcoty3IDwqwAAAAASUVORK5CYII'
    }
    
   chrome.storage.local.get(['icons'], function(result) {
       const icons=result.icons
    if(!icons || Object.keys(icons).length ===0){
        chrome.storage.local.set({icons:options})
    }
    Object.entries(icons).forEach(([text, value])=> {
        let opt = document.createElement('option');
        opt.value = value;
        opt.text = text;
        iconInput.appendChild(opt);
        iconToDeleteInput.appendChild(opt.cloneNode(true));
    });
   })


    //set Default values
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tabId = tabs[0].id;
        chrome.storage.local.get([`${tabId}`], function(data) {
            if (data[tabId]) {
                titleInput.value = data[tabId].name;
                iconInput.value = data[tabId].icon;
            }
        });
    })
  

    // Function to handle form submission
    function handleSubmit() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            const newTitle = titleInput.value;
            // Set newIcon to an empty string to remove the icon
            const newIcon = iconInput.value;
            chrome.runtime.sendMessage({type: "changeTabProperties", tabId: tabId, newTitle: newTitle, newIcon: newIcon});
            chrome.storage.local.set({[tabId]:{name: newTitle, icon: newIcon}});
        });
    }
    function handleSaveIcon() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            const newIconName = saveIconName.value;
            chrome.runtime.sendMessage({type: "saveNewIcon", tabId: tabId, newIconName});
        });
    }
    function handleDeleteIcon() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            const iconToDelete = iconToDeleteInput.value;
            chrome.runtime.sendMessage({type: "deleteIcon", tabId: tabId, iconToDelete});
        });
    }

    // Listen for keypress events on the input fields
    titleInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });

    iconInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    });

    // Listen for click events on the button
    changeTabPropertiesBtn.addEventListener('click', handleSubmit);
    saveIconBtn.addEventListener('click', handleSaveIcon)
    deleteIconBtn.addEventListener('click', handleDeleteIcon)
});
