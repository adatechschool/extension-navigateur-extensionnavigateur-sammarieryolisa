// A lancer à l'ouverture de la page
document.addEventListener("DOMContentLoaded", function () {

  // récupérer les éléments du DOM
  const wordsListDOM = document.querySelector(".wordsList");
  const wordInputDOM = document.querySelector("#newWordInput");
  const addNewWordBtn = document.querySelector("#addNewWordBtn");
  
  // récupérer la liste des mots sauvegardés
  chrome.storage.local.get({ pastResearches: [] }, function (storageData) {
    updatePanelList(storageData.pastResearches);
  });
  
  // Add click event listener to the "Add" button
  addNewWordBtn.addEventListener("click", function () {
    manuallyAddNewWordToList()
  });
  
  // Add click event listener to each saved word for deletion
  wordsListDOM.addEventListener("click", function (event) {
    if (event.target.className === "delete") {
      deleteWord(event)
    } else if (event.target.className === "saveTranslation") {
      saveTranslation(event) // TODO
    }
    else if (event.target.className === "launchSearch") {
      lookupWord(event.target.dataset.word)
    }
  });
  
  // Listen for messages from background.js to update the list
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "updateList") {
      chrome.storage.local.get({ pastResearches: [] }, function (storageData) {
        // storageData.pastResearches.push(request.wordToBeSaved);
        // chrome.storage.local.set(
        //   { pastResearches: storageData.pastResearches },
        //   function () {
            // console.log("Word saved:", request.wordToBeSaved);
            updatePanelList(storageData.pastResearches);
        //   }
        // );
      });
    }
  });

  // function to add new woord to list from input
  function manuallyAddNewWordToList(){
    const newWord = wordInputDOM.value.trim();
    if (newWord) {

      // Save the new word to storage
      chrome.storage.local.get({ pastResearches: [] }, function (storageData) {
        // ajouter le nouveau mot au storage
        storageData.pastResearches.push(newWord);
        
        // mettre à jour la liste des mot affichée
        chrome.storage.local.set(
          { pastResearches: storageData.pastResearches },
          function () {
            console.log("Word saved:", newWord);
            updatePanelList(storageData.pastResearches);

            // Trigger API lookup for the newly added word
            chrome.tabs.query({ active: true, currentWindow: true }, function (
              tabs
            ) {
              const activeTab = tabs[0];
              chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: lookupWord,
                args: [newWord],
              });
            });
          }
        );
      });
  
      chrome.runtime.sendMessage({ type: "updateList", wordToBeSaved: newWord });
      wordInputDOM.value = ""; // Clear the input field
    }
  }

  // supprimer un mot
  function deleteWord(event) {
    const wordToDelete = event.target.dataset.word;
    chrome.storage.local.get({ pastResearches: [] }, function (storageData) {
      storageData.pastResearches = storageData.pastResearches.filter(
        (word) => word !== wordToDelete
        );
        chrome.storage.local.set(
          { pastResearches: storageData.pastResearches },
          function () {
            console.log("Word deleted:", wordToDelete);
            updatePanelList(storageData.pastResearches);
          }
          );
        });
  }

  function saveTranslation(event) {
    // TODO
  }

  // Function to look up a word on WordReference
  function lookupWord(word) {
    chrome.runtime.sendMessage({ type: "toBeSearched", searchWord: word });
  }

  function deleteList() {
    // TODO
    // etape 1 : vider le storage

    // etape 2 : updater la liste affichée à l'écran

  }

  function exportList() {
    // TODO
    // permettre à l'utilisateur d'imprimer/de copier la liste dans son presse-papiers/clipboard
      // juste avec le click d'un bouton
  }
  

  // Function to update the UI with the list of saved words
  function updatePanelList(pastResearches) {
    wordsListDOM.innerHTML = ""; // Clear the list
    pastResearches.forEach(function (word) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>${word}</span> 
                            <button class="delete" data-word="${word}">Effacer</button>
                            <input type="text" class="translationInput" data-word="${word}" placeholder="Entrez la traduction">
                            <button class="saveTranslation" data-word="${word}">Sauvegarder la traduction</button>
                            <button class="launchSearch" data-word="${word}"><a href="https://www.wordreference.com/enfr/${word}" target="_blank">Relancer une recherche</a></button>`;
      wordsListDOM.appendChild(listItem);
    });
  }
    

});
