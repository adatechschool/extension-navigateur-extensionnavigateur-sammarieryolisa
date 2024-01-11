

// condition : si l'utilisateur clique sur un raccourci
chrome.action.onClicked.addListener((tab) => { // si on clique sur l'icône de l'extension (à chancher si nécessaire)

    // lancer le content-script pour récupérer la sélection
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['scripts/content.js']
    });
});

// écouter le message du content script pour récupérer le mot
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message reçu du content script : ", request.searchWord);
    
    // ouvrir un nouvel onglet avec le mot souhaité
    chrome.tabs.create(
        {
            url: `https://www.wordreference.com/enfr/${request.searchWord}`
        }
        )

        // retourner la traduction
        sendResponse({ response: "bien reçu" });

    });


    // récupérer la sélection envoyée par message depuis le content-script
    
