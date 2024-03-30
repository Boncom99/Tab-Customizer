/*global chrome*/
import "./App.css"
import { useEffect,  useState} from "react";
import {EmojiPicker} from "./EmojiPicker";
import amplitude from"./amplitude";

export const App=()=> {

    const [mode, setMode] = useState<'dark'|'light'>('light')
    useEffect(()=>{
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
        const changeMode = (e:any)=>{
            if(e.matches()){
                setMode('dark')
                amplitude.track("Mode", {status: "dark"})
            }
            else {
                amplitude.track("Mode", {status: "light"})
                setMode('light')
            }
        }
        darkMode.addEventListener('change', changeMode);
        return ()=>{
            darkMode.removeEventListener('change', changeMode);
        }
    },[])
useEffect(()=>{

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tabId = tabs[0].id;

        if(!tabId){
            amplitude.track("Error", {status: "no tabId found", tab:tabs[0]})
        return
        }
        amplitude.track("Opened", {tab: tabs[0]})

        chrome.storage.local.get([`${tabId}`], function(data) {
            if (data[tabId]?.name && data[tabId]?.emojiText) {
                setTitle(data[tabId].name);
                setEmoji(data[tabId].emojiText);
                amplitude.track("Opened", {title: data[tabId].name, emoji: data[tabId].emojiText, status: "existing Tab"})
            }
            else{
                amplitude.track("Opened", {status: "new Tab"})
                amplitude.track("RandomTab", {status: "default"})
                submitRandomTab()
            }
        });
    })
},[])

    const [emoji, setEmoji] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(true);
  
    const emojiRegex = /^\p{Emoji}$/u;
    const handleWriteEmoji=(event:any)=>{
        const newText= event.target.value
        amplitude.track("EmojiWriteInput", {status: "typed", value: newText})
        if(!newText || newText.length<1) {
            setEmoji("")
            return
        }
        let oneCharacter=newText.substring(newText.length - 3).toUpperCase();
        if(oneCharacter.length>1 && !oneCharacter.match(emojiRegex)){
            oneCharacter=newText.substring(newText.length-1)
        }
        setEmoji(oneCharacter.toUpperCase())
    }
    const handleWriteTitle= (e:any) =>{
        //fire amplitude event after 3 seconds of not typing with a timeout
        //debounce




        amplitude.track("TitleWriteInput", {status: "typed", value: e.target.value})
        setTitle(e.target.value)
    }
    
    useEffect(() => {
        const timeoutId = setTimeout(() =>
            amplitude.track("Submit", {status: "debounce", title: title, emoji: emoji})
            , 1000);
        handleSubmit();
        return () => clearTimeout(timeoutId);
    }, [emoji, title]);



        const randomDefaultTitle=[
            'fun','Docs', 'Games', 'ChatGPT','F*ck','sh*t',"daaaaaamn",'YouTube', 'work','LOL','LMFAO','XD','NOT SUS',"PH","420","TODO","TL;DR","404" ,"IDK", 'Later', 'Music', "Happy Place","Sweet","personal","Love","pill","Wiki","Paris",'Travel','wedding','family'

        ]
        const randomDefaultEmoji=[
            "❤️","🔥","🎨","💡","📆","🍺","🍻" ,"💼", "😴", "👀", "🫠" ,"💀","💩", "🫦" ,"🌝","🌚","🍆","🍑","🍾","🌿","😮‍💨","🤤","🎱","💸","❌","✅","🔝","🚀"
        ]

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
                amplitude.track("Submit", {status: "send", title: title, emoji: emoji, tabUrl: tabs[0].url, tab: tabs[0]})
                chrome.storage.local.set({[tabId]:{name: title , icon: "", emoji:newEmojiBase64, emojiText:emoji}});
                chrome.runtime.sendMessage({type: "changeTabProperties", tabId: tabId, newTitle: title, newIcon:"", newEmoji: newEmojiBase64},()=>{
                    // checkChangesAreCorrect(tabId,newTitle,newEmojiBase64)
                });
            });
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
            // let color= mode==='dark'? "#ddd": mode==="light"?"#222":"#888";
            let color= "#888";

            context.font = `bold ${fontSize}px Arial`; // You can choose any font that supports emojis
            context.textAlign = "center";
            context.textBaseline = 'middle';

            context.fillStyle = color;
            context.fillText(oneCharacter, 16,18); // Adjust position as needed
            const base64Image = canvas.toDataURL("image/png");
            return `${base64Image}`
        }

        function handleReset(){
            amplitude.track("Reset", {status: "clicked"})
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
        }
        const handleChooseEmoji=(em:any)=>{
            amplitude.track("EmojiPicker", {status: "selected", emoji: em.native})
            // const generated=String.fromCodePoint(parseInt(em.unified, 16));
            setEmoji(em.native)
            setShowEmojiPicker(false)
        }
         const handleToggleEmojiPicker =(e:any)=>{
            amplitude.track("EmojiInput", {status: "clicked"})
            e.stopPropagation()
            setShowEmojiPicker(v=>!v)
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
                           value={emoji} onChange={handleWriteEmoji} onClick={handleToggleEmojiPicker} />
                    <input type='text' className="title-input" contentEditable="true" value={title}
                           onChange={handleWriteTitle}/>
                    <div className="cross" onClick={handleReset}>✕
                        <span className="tooltiptext">reset</span>
                    </div>
                </div>
                <div className="tab-emulator tab-emulator-aux right">
                </div>
            </div>
            <div className="tab-emulator-footer"></div>
            <div className="submitButtonDiv">
                <button id="randomTabBtn" className="randomTabBtn" onClick={()=>{
                    amplitude.track("RandomTab", {status: "clicked"})
                    submitRandomTab()
                }
                }>🔀</button>
            </div>            {
            showEmojiPicker &&(
            <EmojiPicker onSelectedEmoji={handleChooseEmoji} close={() =>{
                amplitude.track("EmojiPicker", {status: "closed"})
                setShowEmojiPicker(false)
                }
            }
            isVisible={showEmojiPicker}
            />
            )}

        </div>
    );
}

