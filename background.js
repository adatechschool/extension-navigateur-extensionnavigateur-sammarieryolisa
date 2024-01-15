const getTextSelection = (tab) => {
    // lancer le content script
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['scripts/content.js']
    });
}


// condition : si l'utilisateur clique sur un raccourci
chrome.action.onClicked.addListener((tab) => { // si on clique sur l'icône de l'extension (à chancher si nécessaire)
    console.log("lancement du script")
    // lancer le content-script pour récupérer la sélection
    getTextSelection(tab)
});

// écouter le message du content script pour récupérer le mot
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "toBeSearched") {
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

    
    // FONCTION : déclencher action en fonction du menu contextuel sélectionné
async function ContextualMenuClick(info, tab) {
    switch (info.menuItemId) {
        case 'search':
            await chrome.sidePanel.open({ windowId: tab.windowId }); // doit être ouvert là sinon le script ne se déclenche pas)
            getTextSelection(tab);
            break;
        case 'openSidePanel':
            chrome.sidePanel.open({ windowId: tab.windowId });
            break;
      default:
        // Standard context menu item function
        console.log('Standard context menu item clicked.');
    }
  }
  
  // à déclencher au lancement de chrome/de l'extension
  chrome.runtime.onInstalled.addListener(function () {
// créer le menu contextuel
    chrome.contextMenus.create(
        { // lancer une recherche avec le clic droit
            id: 'search',
            title: 'Obtenir la traduction',
            contexts: ["selection"]
        });
    chrome.contextMenus.create(
        { // ouvrir la sidebar depuis le clic droit
            id: 'openSidePanel',
            title: 'Ouvrir le panneau latéral',
            contexts: ["all"]
        });      
});

// si je fais clic droit, des options sont proposées (ouvrir le sidepanel, lancer une recherche...)
chrome.contextMenus.onClicked.addListener((info, tab) => {ContextualMenuClick(info, tab)});