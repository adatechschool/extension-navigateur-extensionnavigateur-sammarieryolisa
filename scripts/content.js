function saveWord(storageData) {
  const word = window.getSelection().toString().toLowerCase();
  const newResearches = [...storageData.pastResearches, { word, translation: "" }]
  chrome.storage.local.set({ pastResearches: newResearches });
}

// recupere l'array de mots sauvegarés et on y ajoute la recherche
async function saveWordAndSendMessages(selection) {
  await chrome.storage.local.get({ pastResearches: [] }, saveWord);

  // envoyer la sélection vers le background script pour ouvrir un onglet
  await chrome.runtime.sendMessage({
    type: "toBeSearched",
    searchWord: selection,
  });

  // transmettre le mot à la sidebar pour l'lafficher
  await chrome.runtime.sendMessage({
    type: "updateList",
    wordToBeSaved: selection,
  });
}

// FONCTION PRINCIPALE : récupérer le mot sélectionné
let selection = window.getSelection().toString().toLowerCase();

if (selection) {
  saveWordAndSendMessages(selection);
}
