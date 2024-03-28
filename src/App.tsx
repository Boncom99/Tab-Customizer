/*global chrome*/
import "./App.css"
import {useCallback, useEffect, useRef, useState} from "react";
import {EmojiPicker} from "./EmojiPicker";



function App() {

useEffect(()=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tabId = tabs[0].id;
        if(!tabId) return
        chrome.storage.local.get([`${tabId}`], function(data) {
            if (data[tabId]?.name && data[tabId]?.emojiText) {
                setTitle(data[tabId].name);
                setEmoji(data[tabId].emojiText);
            }
            else{
                submitRandomTab()
            }
        });
    })
    getOperationSystemOfUser()
},[])
    const [emoji, setEmoji] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(true);
  
    const emojiRegex = /\p{Emoji}/u;
    const writeEmoji=(event:any)=>{
        const newText= event.target.value
        console.log(newText.length)
        if(!newText || newText.length<1) {
            setEmoji("")
            return
        }
        let oneCharacter=newText.substring(newText.length - 2).toUpperCase();
        if(oneCharacter.length>1 && !oneCharacter.match(emojiRegex)){
            oneCharacter=newText.substring(newText.length-1)
        }
        setEmoji(oneCharacter.toUpperCase())
    }
    
    useEffect(() => {
        handleSubmit();
    }, [emoji, title]);



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
                OSElement.innerHTML = "(Press <b>Cmd</b> + <b>Ctrl</b> + <b>Space</b>  to open<br/> the emoji picker)"
            }
            else{
                OSElement.innerHTML = "Press <b>Win</b> + <b>.</b> or <b>Cmd</b> + <b>Ctrl</b> + <b>Space</b> to open the emoji picker"
            }


        }

        function generateRandomTab(){
            const randomTitle = randomDefaultTitle[Math.floor(Math.random()*randomDefaultTitle.length)]
            const randomEmoji=randomDefaultEmoji[Math.floor(Math.random()*randomDefaultEmoji.length)]
            setTitle(randomTitle)
            setEmoji(randomEmoji)
        }
        //set Default values



      
     
        // Function to handle form submission
        function handleSubmit() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const tabId = tabs[0].id;
                if(!tabId) return
                let newEmojiBase64:string="";
                if(emoji){
                    newEmojiBase64=createEmojiBase64(emoji.trim())??"";
                }               
                chrome.storage.local.set({[tabId]:{name: title , icon: "", emoji:newEmojiBase64, emojiText:emoji}});
                chrome.runtime.sendMessage({type: "changeTabProperties", tabId: tabId, newTitle: title, newIcon:"", newEmoji: newEmojiBase64},()=>{
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
        
        function createEmojiBase64(emoji:string){
            let oneCharacter=emoji.substring(0,2);
            const emojiRegex = /\p{Emoji}/u;
            if(oneCharacter.length>1 && !emoji.match(emojiRegex)){
                oneCharacter=emoji.substring(0,1)
            }
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (!context) return;
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

        function handleReset(){
            //refresh witout rewriting the icon or the tile
            //get current tab
            setTitle("")
            setEmoji("")
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const tabId = tabs[0].id;
                if(!tabId) return
                chrome.storage.local.set({[tabId]:{name: "", icon: "" , emoji:"", emojiText:""}},()=>{
                    chrome.tabs.reload(tabId)
                });
            })


        }
        function submitRandomTab(){
            generateRandomTab()
            handleSubmit()
        }
        const handleChooseEmoji=(em:any)=>{
            // const generated=String.fromCodePoint(parseInt(em.unified, 16));
            setEmoji(em.native)
            setShowEmojiPicker(false)
        }
         const handleToggleEmojiPicker =(e:any)=>{
                      e.stopPropagation()
        console.log('clicked');

        setShowEmojiPicker(true)
             console.log(showEmojiPicker)
        }

    return (
        <div className="container">
            <h2>Customise your tab 🎨</h2>
            {/*<p className="openEmojiInstructionsText">
                <em id="OSOpenEmojiInstructions">(Press <b>Win</b> + <b>.</b> or <b>Cmd</b> + <b>Ctrl</b> + <b>Space</b><br/> to
                    open the emoji picker)</em>
            </p>*/}
            <div className="row-of-tab-emulators">
                <div className="tab-emulator tab-emulator-aux left">
                </div>
                <div className="tab-emulator">
                    <input type='text' style={{position: 'relative'}} className="icon" contentEditable="true" size={1}
                           value={emoji} onChange={writeEmoji} onClick={handleToggleEmojiPicker} />
                    <input type='text' className="title-input" contentEditable="true" value={title}
                           onChange={(e) => setTitle(e.target.value)}/>
                    <div className="cross" onClick={handleReset}>✕
                        <span className="tooltiptext">reset</span>
                    </div>
                </div>
                <div className="tab-emulator tab-emulator-aux right">
                </div>
            </div>
            <div className="tab-emulator-footer"></div>
            <div className="submitButtonDiv">
                <button id="randomTabBtn" className="randomTabBtn" onClick={submitRandomTab}>🔀</button>
            </div>            {
            showEmojiPicker &&(
            <EmojiPicker onSelectedEmoji={handleChooseEmoji} close={() =>{
                console.log('close')
                setShowEmojiPicker(false)
                }
            }
            isVisible={showEmojiPicker}
            />
            )}

        </div>
    );
}

export default App;
