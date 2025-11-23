/**
 * Calls chrome's new tab function
 * 
 * @param {String} url 
 */
const createNewTabFunctionDeclaration = {
    name: 'createNewTab',
    description: 'Creates a new tab with given URL',
    parameters: {
        type: "object",
        properties: {
            url: {
                type: "string",
                description: 'The URL to visit'
            },
            active: {
                type: "boolean",
                description: 'Whether it should be made the current tab or not (true by default)',
                default: true
            }
        },
        required: ['url']
    }
};

function createNewTab( url, active = true ) {
    chrome.tabs.create({ url: url , active: active });
};

/**
 * Closes the active tab
 */
const closeActiveTabFunctionDeclaration = {
    name: 'closeActiveTab',
    description: 'Closes active tab (user might say "this")'
};

function closeActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.remove(tabs[0].id, function() {
            console.log('Active tab closed');
        });
    });
};


/**
 * Mutes the active tab 
 */
const muteActiveTabFunctionDeclaration = {
    name: 'muteActiveTab',
    description: 'Mutes active tab '
}

function muteActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.update(tabs[0].id, { muted: true }, function(tab) {
            console.log(`Tab ${tab.id} muted`);
        });
    });
};

/**
 * Mutes the active tab 
 */
const unmuteActiveTabFunctionDeclaration = {
    name: 'unmuteActiveTab',
    description: 'Unmutes active tab '
}

function unmuteActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.update(tabs[0].id, { muted: false }, function(tab) {
            console.log(`Tab ${tab.id} unmuted`);
        });
    });
};


/**
 * Pins the active tab
 */
const pinActiveTabFunctionDeclaration = {
    name: 'pinActiveTab',
    description: 'Pins active tab'
};

function pinActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.update(tabs[0].id, { pinned: true }, function(tab) {
            console.log(`Tab ${tab.id} pinned`);
        });
    });
};


/**
 * Unpins the active tab
 */
const unpinActiveTabFunctionDeclaration = {
    name: 'unpinActiveTab',
    description: 'Unpins active tab'
};

function unpinActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.update(tabs[0].id, { pinned: false }, function(tab) {
            console.log(`Tab ${tab.id} unpinned`);
        });
    });
};

/**
 * 
 */
const closeCertainTabFunctionDeclaration = {
    name: 'closeCertainTab',
    description: 'Closes active tab (user might say "this")'
}


/**
 * 
 */
const mutePlayingTabFunctionDeclaration = {

}

/**
 * 
 */
const muteCertainTabFunctionDeclaration = {

}

/**
 * 
 */
const setActiveTabFunctionDeclaration = {

}

export const functionDeclarations = [
    createNewTabFunctionDeclaration,
    closeActiveTabFunctionDeclaration,
    muteActiveTabFunctionDeclaration,
    unmuteActiveTabFunctionDeclaration,
    pinActiveTabFunctionDeclaration,
    unpinActiveTabFunctionDeclaration,
]

export const functionImplementations = {
    "createNewTab": createNewTab,
    "closeActiveTab": closeActiveTab,
    "muteActiveTab": muteActiveTab,
    "unmuteActiveTab": unmuteActiveTab,
    "pinActiveTab": pinActiveTab,
    "unpinActiveTab": unpinActiveTab,
}