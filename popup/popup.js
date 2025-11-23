
document.addEventListener("DOMContentLoaded", (e) => {
    chrome.storage.local.set({ listening: false });
    let indication = document.getElementById('keybindIndicator');

    chrome.storage.local.get('listenKey').then((result) => {
        indication.textContent = 'Current keybind: ' + result.listenKey;
    });
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
    let indication = document.getElementById('keybindIndicator');

    chrome.storage.local.get('listenKey').then((result) => {
        console.log(`New listen key: ${result.listenKey}`);
        indication.textContent = 'Current keybind: ' + result.listenKey;
    });


    document.removeEventListener('keydown', setNewSimonButton);
};

function listenButtonClicked() {
    let button = document.getElementById('toggleListenButton');
    let indication = document.getElementById('indicator');
    chrome.storage.local.get('listening', function (result) {
        const currentValue = result.listening;
        const newValue = !currentValue; // Toggle the value
        console.log(newValue);
        // Set the new boolean value
        chrome.storage.local.set({ listening: newValue });
        if (newValue == true) {
            button.setAttribute('aria-pressed', 'false');
            indication.textContent= "Simon IS Listening";
            indication.style.color = "green";
        } else {
            button.setAttribute('aria-pressed', 'true');
            indication.textContent= "Simon is NOT Listening";
            indication.style.color = "red";
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
const input = document.getElementById("prompt");
const mirror = document.getElementById("mirror");

function resizeInput() {
    mirror.textContent = input.value || input.placeholder;
    input.style.width = mirror.offsetWidth + 12 + "px";
}

input.addEventListener("input", resizeInput);
resizeInput();
});