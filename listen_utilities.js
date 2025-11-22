function startListening() {
};

function stopListening() {

};

function toggleListening() {
    chrome.storage.local.get('listening', function (result) {
        const currentValue = result.listening;
        const newValue = !currentValue; // Toggle the value
        // Set the new boolean value
        chrome.storage.local.set({ listening: newValue });
        return newValue;
    });
};
