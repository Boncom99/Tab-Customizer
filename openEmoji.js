
function getOperationSystemOfUser() {
    //get if it's a IOS or Windows
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    const OSElement= document.getElementById('OSOpenEmojiInstructions');
    if(!OSElement){
        return
    }
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
// getOperationSystemOfUser()