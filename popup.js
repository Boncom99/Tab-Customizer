
document.addEventListener('DOMContentLoaded', function() {
    //get tab opened from session storage and activate it
    chrome.storage.session.get(['tabOpen'], function(result) {
        if(result.tabOpen){
            openTab("", result.tabOpen);
        }
    });
    var tabButtons = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener("click", function(event) {
            openTab(event, this.getAttribute("name"));
        });
    }
    const changeTabPropertiesBtn = document.getElementById('changeTabPropertiesBtn');
    const tabEmulatorTitle= document.getElementById('tab-emulator-title');
    const tabEmulatorEmoji= document.getElementById('tab-emulator-emoji');
    const tabEmulatorCross= document.getElementById('tab-emulator-cross');
    const resetIconBtn= document.getElementById('resetIconBtn')
    const randomTabBtn= document.getElementById('randomTabBtn')


    const randomDefaultTitle=[
      'fun','Docs', 'Games', 'ChatGPT','F*ck','sh*t',"daaaaaamn",'YouTube', 'work','LOL','LMFAO','XD','NOT SUS',"PH","420","TODO","TL;DR","404" ,"IDK", 'Later', 'Music', "Happy Place","Sweet","personal","Love","pill","Wiki","Paris",'Travel','wedding','family'

    ]
    const randomDefaultEmoji=[
        "❤️","🔥","🎨","💡","📆","🍺","🍻" ,"💼", "😴", "👀", "🫠" ,"💀","💩", "🫦" ,"🌝","🌚","🍆","🍑","🍾","🌿","😮‍💨","🤤","🎱","💸","❌","✅","🔝","🚀"
    ]

  

    function getOperationSystemOfUser() {
        //get if it's a IOS or Windows
        var OSName = "Unknown OS";
        if (navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
        if (navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
        const OSElement= document.getElementById('OSOpenEmojiInstructions');
        if(!OSElement) return
        if(OSName==="Windows") {
            OSElement.innerHTML = "(Press <b>Win</b> + <b>.</b> to open the emoji picker)"
        }
        else if(OSName==="MacOS"){
            OSElement.innerHTML = "(Press <b>Cmd</b> + <b>Ctrl</b> + <b>Space</b> to open the emoji picker)"
        }
        else{
            OSElement.innerHTML = "Press <b>Win</b> + <b>.</b> or <b>Cmd</b> + <b>Ctrl</b> + <b>Space</b> to open the emoji picker"
        }


    }
    getOperationSystemOfUser()
    
    function generateRandomTab(){
        const randomTitle = randomDefaultTitle[Math.floor(Math.random()*randomDefaultTitle.length)]
        const randomEmoji=randomDefaultEmoji[Math.floor(Math.random()*randomDefaultEmoji.length)]
        tabEmulatorTitle.textContent= randomTitle;
        tabEmulatorEmoji.textContent=  randomEmoji;
    }
    //set Default values
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tabId = tabs[0].id;
        chrome.storage.local.get([`${tabId}`], function(data) {
            if (data[tabId]?.name && data[tabId]?.emojiText) {
                tabEmulatorTitle.textContent= data[tabId].name ;
                tabEmulatorEmoji.textContent= data[tabId].emojiText;
            }
            else{
                submitRandomTab()
            }
        });
    })

    const emojiRegex = /\p{Emoji}/u;
    
    tabEmulatorEmoji.addEventListener("input", (event) => {
        console.log('input',event)
        console.log('event.data',event.data)
        // this.textContent=event.data
        // return;
        const text= event.data
        if(!text || text.length<1) {
            handleSubmit()
            return
        }
        let oneCharacter=text.substring(text.length - 2).toUpperCase();
        if(oneCharacter.length>1 && !oneCharacter.match(emojiRegex)){
            oneCharacter=text.substring(text.length-1)
        }
        event.target.textContent=oneCharacter
        
       handleSubmit()
    });
    tabEmulatorTitle.addEventListener("input", (event) => {
        handleSubmit()
    });
    tabEmulatorCross.addEventListener('click',(event)=>{
             tabEmulatorEmoji.textContent=""
            tabEmulatorTitle.textContent=""
    })
    function checkChangesAreCorrect(tabId, title,emojiBase64){
        //check the current title and favicons are the same as the props
        //get chrome tab by id
        chrome.tabs.get(tabId, (tab)=>{
            const realIcon= tab.favIconUrl;
            const realTitle=document.title
            const errorTag= document.getElementById('errorMessage')
            const errorMessage ="I couldn't update the Tab 🥲 properly"
            console.log('realTitle', realTitle)
            console.log('realicon', realIcon)
            console.log('title', title)
            console.log('emoji', emojiBase64)
            if(realTitle !== title ||realIcon !== emojiBase64 ){
                errorTag.innerText=errorMessage
            }else{
                errorTag.innerText=""
            }
        });

       

    }
    // Function to handle form submission
    function handleSubmit() {
        document.getElementById('errorMessage').innerText=""
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            const newTitle = tabEmulatorTitle.textContent;
            // let newIcon = iconSelector.value;
            const newEmojiText=tabEmulatorEmoji.textContent;
            //get only first element of string
            let newEmojiBase64="";
            if(newEmojiText){
                newEmojiBase64=createEmojiBase64(newEmojiText.trim())
            }
                chrome.storage.local.set({[tabId]:{name: newTitle , icon: "", emoji:newEmojiBase64, emojiText:newEmojiText}});
                chrome.runtime.sendMessage({type: "changeTabProperties", tabId: tabId, newTitle: newTitle, newIcon:"", newEmoji: newEmojiBase64},()=>{
                    // checkChangesAreCorrect(tabId,newTitle,newEmojiBase64)
                });
        });
    }
  

    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    function isLightMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    function createEmojiBase64(emoji){
        let oneCharacter=emoji.substring(0,2);
        const emojiRegex = /\p{Emoji}/u;
        if(oneCharacter.length>1 && !emoji.match(emojiRegex)){
                oneCharacter=emoji.substring(0,1)
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = 32;
        canvas.height = 32;
        const fontSize = 30;
        let color="#888"
      /*  if(isDarkMode()){
            color ="#ddd"
        }
        else if(isLightMode()){
            color="#222"
        }*/
        context.font = `bold ${fontSize}px Arial`; // You can choose any font that supports emojis
        context.textAlign = "center";
        context.textBaseline = 'middle';
        
        context.fillStyle = color; 
        context.fillText(oneCharacter, 16,18); // Adjust position as needed
        const base64Image = canvas.toDataURL("image/png");
        return `${base64Image}`
    }

    function handleResetIcon(){
        //refresh witout rewriting the icon or the tile
        //get current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            chrome.storage.local.set({[tabId]:{name: "", icon: "" , emoji:"", emojiText:""}},()=>{
               chrome.tabs.reload(tabId)
            });
        })
       
        
    }
    function submitRandomTab(){
        generateRandomTab()
        handleSubmit()
    }



    // Listen for click events on the button
    changeTabPropertiesBtn?.addEventListener('click', handleSubmit);
    resetIconBtn?.addEventListener('click', handleResetIcon)
    randomTabBtn?.addEventListener('click', submitRandomTab)
    // removeCurrentIconBtn.addEventListener('click', handleEmojiAsIcon)
});
