

// condition : si l'utilisateur clique sur un raccourci
chrome.action.onClicked.addListener((tab) => { // si on clique sur l'icône de l'extension (à chancher si nécessaire)
    console.log("lancement du script")
    // lancer le content-script pour récupérer la sélection
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['scripts/content.js']
    });
});

// écouter le message du content script pour récupérer le mot
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("message reçu")
    if (request.type === "toBeSearched") {
        console.log("action activée")
        // ouvrir un nouvel onglet avec le mot souhaité
        chrome.tabs.create(
            {
                url: `https://www.wordreference.com/enfr/${request.searchWord}`
            }
            )
            
            // retourner la traduction
            sendResponse({ response: "bien reçu" });
        }
    });
    
    
    // récupérer la sélection envoyée par message depuis le content-script
    
// ouvrir le sidePanel au clic sur l'icône
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
