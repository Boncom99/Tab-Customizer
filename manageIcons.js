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
            li.addEventListener('click', function() {
                    // Find the corresponding title of the clicked button
                    //get button's name
                    handleDeleteIcon(name);
                });
            
        });
    })
}
function tab2IsVisible(){
    
    displayListOfIcons()
}
tab2IsVisible()



