// SIDEPANEL : ouvrir le sidePanel au clic sur l'icône
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

// MENU CONTEXTUEL : à déclencher au lancement de chrome/de l'extension
chrome.runtime.onInstalled.addListener(function () {
  createContextMenuOptions();
});
// si je fais clic droit, des options sont proposées (ouvrir le sidepanel, lancer une recherche...)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  ContextualMenuClick(info, tab);
});

function createContextMenuOptions() {
  chrome.contextMenus.create({
    // lancer une recherche avec le clic droit
    id: "search",
    title: "Obtenir la traduction",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    // ouvrir la sidebar depuis le clic droit
    id: "openSidePanel",
    title: "Ouvrir le panneau latéral",
    contexts: ["all"],
  });
}

async function ContextualMenuClick(info, tab) {
  switch (info.menuItemId) {
    case "search":
      getTextSelection(tab);
      await chrome.sidePanel.open({ windowId: tab.windowId }); // doit être ouvert là sinon le script ne se déclenche pas)
      break;
    case "openSidePanel":
      chrome.sidePanel.open({ windowId: tab.windowId });
      break;
    default:
  }
}

// RACCOURCI : déclenche la recherche de traduction & ouvre le sidepanel
chrome.commands.onCommand.addListener(async (command) => {
  await chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.sidePanel.open({ tabId: tab.id });
    getTextSelection(tab);
  });
  console.log(`Command "${command}" triggered`);
});

const getTextSelection = (tab) => {
  // lancer le content script
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["scripts/content.js"],
  });
};

// (F) RECHERCHER TRADUCTION : récupérer le mot à rechercher & ouvrir automatiquement le dictionnaire dans on onglet
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "toBeSearched") {
    // ouvrir un nouvel onglet avec le mot souhaité
    chrome.tabs.create({
      url: `https://www.wordreference.com/enfr/${request.searchWord}`,
    });
  }
});
