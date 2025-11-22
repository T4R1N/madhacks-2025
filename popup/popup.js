
document.addEventListener("DOMContentLoaded", (e) => {
    chrome.storage.local.set({ listening: false });
    console.log("Loaded");
    document.getElementById('keybindListener').addEventListener('click', (e) => {
        console.log("Listening for user input");
        document.addEventListener('keydown', setNewSimonButton);
    });
    document.getElementById('toggleListenButton').addEventListener('click', listenButtonClicked);
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
};

function toggleListening() {
    chrome.storage.local.get('listening', function (result) {
        console.log(result.listening);
        const currentValue = result.listening;
        const newValue = !currentValue; // Toggle the value
        console.log(newValue);
        // Set the new boolean value
        chrome.storage.local.set({ listening: newValue });
        return newValue;
    });
};


async function listenButtonClicked() {
    let button = document.getElementById('toggleListenButton');
    let indication = document.getElementById('indicator');
    let isListening = await toggleListening();
    console.log(isListening);
    if (isListening == 'true') {
        button.setAttribute('aria-pressed', 'false');
        indication.textContent= "Simon IS Listening";
        indication.style.color = "green";
    } else {
        button.setAttribute('aria-pressed', 'true');
        indication.textContent= "Simon is NOT Listening";
        indication.style.color = "red";
    }
};