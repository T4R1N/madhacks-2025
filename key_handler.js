let simonIsListening = false;
document.addEventListener('keydown', (e) => {
    chrome.storage.local.get('listenKey').then((result) => {
        if (e.key === result.listenKey) {
            chrome.storage.local.get('listening', function (result) {
                const currentValue = result.listening;
                const newValue = !currentValue; // Toggle the value
                // Set the new boolean value
                chrome.storage.local.set({ listening: newValue });
                if (newValue) {
                    simonIsListening = true;
                    recordAudio();
                    console.log("Simon is listening");
                }
                else {
                    recordAudio();
                    simonisListening = false;
                    console.log("Simon is not listening");
                }
            });
            console.log(`you pressed ${result.listenKey}`);
        }
    });
});