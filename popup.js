document.addEventListener('DOMContentLoaded', function() {
    const changeTabPropertiesBtn = document.getElementById('changeTabPropertiesBtn');
    const titleInput = document.getElementById('titleInput');
    const iconInput = document.getElementById('iconInput');

    //get stored values
    chrome.storage.local.get(['selectedName', 'selectedURL'], function(data) {
        if (data.selectedName && data.selectedURL) {
            titleInput.value = data.selectedName;
            iconSelect.value = data.selectedURL;
        }
    });

    // Function to handle form submission
    function handleSubmit() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            const newTitle = titleInput.value;
            // Set newIcon to an empty string to remove the icon
            const newIcon = iconInput.value;
            chrome.runtime.sendMessage({type: "changeTabProperties", tabId: tabId, newTitle: newTitle, newIcon: newIcon});
            chrome.storage.local.set({selectedName: newTitle, selectedURL: newIcon});
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
});
