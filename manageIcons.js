function handleDeleteIcon(title) {
    chrome.storage.local.get(['icons'], function(result) {
        const icons=result.icons
        const newObj={...icons}
        //delete key that the value is iconToDelete
        Object.entries(icons).forEach(([text, value])=> {
            if(text===title){
                delete newObj[text]
            }
        })
        chrome.storage.local.set({icons:newObj},()=>location.reload());
        // location.reload()
    })
    // chrome.runtime.sendMessage({type: "deleteIcon", tabId: tabId, iconToDelete:title},/*()=> location.reload()*/);
}

function addListeners(){
    const buttons = document.querySelectorAll('.deleteIconBtn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the corresponding title of the clicked button
            //get button's name
            const title = this.getAttribute('name');
            handleDeleteIcon(title);
        });
    });
}
function displayListOfIcons() {
    //get if it's a IOS or Windows
    const ul= document.getElementById('listOfIcons');
    if(!ul){
        return
    }
    ul.innerHTML=""
    displayIconToSave(ul)
    chrome.storage.local.get(['icons'], function(result) {
        const icons=result.icons
        if(!icons || Object.keys(icons).length ===0){
            return
        }
        Object.entries(icons).forEach(([name, value])=> {
            //clone original li
            const li =  document.createElement('li');
            li.innerHTML = `<div class="li-icon">
            <img src="${value}" rel="icon" class="iconImage" />
                ${name} <button class="deleteIconBtn" name="${name}">⌫</button>
            </div>`
            ul.appendChild(li);
            const btn= li.querySelector('.deleteIconBtn')
            btn.addEventListener('click', function() {
                    // Find the corresponding title of the clicked button
                    //get button's name
                    handleDeleteIcon(name);
                });
            
        });
    })
}
function displayIconToSave(parent){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const favIconUrl = tabs[0].favIconUrl;
        const li =  document.createElement('li');
        li.innerHTML = `<div>
            <label>add current Icon to the library</label>
        <div class="li-icon">
            <img src="${favIconUrl}" rel="icon" class="iconImage" />
                <input class="inListInput" id="addNewIconInput" placeholder="Icon's name"> <button id="addNewIconBtn" class="submitBtn deleteIconBtn"> + </ibutton>
        </div>
            </div>`
        parent.appendChild(li);
        const btn= li.querySelector('#addNewIconBtn')
        btn.addEventListener('click', ()=>handleSaveIcon());
    });
}

function handleSaveIcon() {
    const addNewIconInput= document.getElementById('addNewIconInput');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tabId = tabs[0].id;
        const favIconUrl = tabs[0].favIconUrl;
        const newIconName = addNewIconInput.value;
        chrome.runtime.sendMessage({type: "saveNewIcon", tabId: tabId, newIconName,  favIconUrl}, ()=> location.reload());
    });
}
function tab2IsVisible(){
    
    displayListOfIcons()
}
tab2IsVisible()



