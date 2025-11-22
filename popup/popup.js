document.addEventListener("DOMContentLoaded", (e) => {
    console.log("Loaded")
    document.getElementById('keybindListener').addEventListener('click', (e) => {
        console.log("Listening for user input");
        document.addEventListener('keydown', setNewSimonButton);
    });
})


/**
 * Sets the hotkey
 * 
 * @param {Event} e 
 */
function setNewSimonButton(e) {
    chrome.storage.local.set({listenKey: e.key});

    chrome.storage.local.get('listenKey').then((result) => {
        console.log(`New listen key: ${result.listenKey}`);
    });

    document.removeEventListener('keydown', setNewSimonButton);
}

function ButtonClicked() {
    
};