const OPEN_SIDE_PANEL_ID = "OPEN_SIDE_PANEL_ID";
const SEARCH_ID = "SEARCH_ID";

// SIDEPANEL : ouvrir le sidePanel au clic sur l'icône
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

// MENU CONTEXTUEL : à déclencher au lancement de chrome/de l'extension
chrome.runtime.onInstalled.addListener(createContextMenuOptions);

// si je fais clic droit, des options sont proposées (ouvrir le sidepanel, lancer une recherche...)
chrome.contextMenus.onClicked.addListener(contextualMenuClick);

function createContextMenuOptions() {
  chrome.contextMenus.create({
    // lancer une recherche avec le clic droit
    id: SEARCH_ID,
    title: "Obtenir la traduction",
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    // ouvrir la sidebar depuis le clic droit
    id: OPEN_SIDE_PANEL_ID,
    title: "Ouvrir le panneau latéral",
    contexts: ["all"],
  });
}

function contextualMenuClick(info, tab) {
  switch (info.menuItemId) {
    case SEARCH_ID:
      getTextSelection(tab);
      chrome.sidePanel.open({ windowId: tab.windowId }); // doit être ouvert là sinon le script ne se déclenche pas)
      break;
    case OPEN_SIDE_PANEL_ID:
      chrome.sidePanel.open({ windowId: tab.windowId });
      break;
    default:
      throw new Error("????");
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
