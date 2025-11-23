const createNewTabFunctionDeclaration = {
    name: 'createNewTab',
    description: 'Creates a new tab with given URL',
    parameters: {
        type: Type.OBJECT,
        properties: {
            url: {
                type: Type.STRING,
                description: 'The URL to visit'
            }
        },
        required: ['url']
    }
}

/**
 * Calls chrome's new tab function
 * 
 * @param {String} url 
 */
function createNewTab(url) {
    chrome.tabs.create({ url: url });
}