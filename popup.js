document.addEventListener('DOMContentLoaded', function() {
    const changeTitleBtn = document.getElementById('changeTitleBtn');
    const titleInput = document.getElementById('titleInput');

    changeTitleBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            const newTitle = titleInput.value;
            chrome.runtime.sendMessage({type: "changeTitle", tabId: tabId, newTitle: newTitle});
        });
    });
});
