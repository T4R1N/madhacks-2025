document.addEventListener('keydown', (e) => {
    chrome.storage.local.get('listenKey').then((result) => {
        if (e.key === result.listenKey) {
            alert("Simon is listening");
            console.log(`you pressed ${result.listenKey}`);
        }
    });
});