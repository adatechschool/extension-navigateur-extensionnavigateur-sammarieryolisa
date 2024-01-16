document.addEventListener("DOMContentLoaded", function () {
    const listElement = document.querySelector(".list");
    const inputElement = document.querySelector("#newWordInput");
    const addButton = document.querySelector("#addButton");
  
    // Load saved words on sidebar initialization
    chrome.storage.local.get({ pastResearches: [] }, function (result) {
      updateListUI(result.pastResearches);
    });
  
    // Add click event listener to the "Add" button
    addButton.addEventListener("click", function () {
      const newWord = inputElement.value.trim();
      if (newWord) {
        // Save the new word to storage
        chrome.storage.local.get({ pastResearches: [] }, function (result) {
          result.pastResearches.push(newWord);
          chrome.storage.local.set(
            { pastResearches: result.pastResearches },
            function () {
              console.log("Word saved:", newWord);
              updateListUI(result.pastResearches);
  
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
  
        chrome.runtime.sendMessage({ type: "toBeSaved", wordToBeSaved: newWord });
        inputElement.value = ""; // Clear the input field
      }
    });
  
    // Add click event listener to each saved word for deletion
    listElement.addEventListener("click", function (event) {
        console.log(event.target)
      if (event.target.tagName === "BUTTON") {
        const wordToDelete = event.target.dataset.word;
        chrome.storage.local.get({ pastResearches: [] }, function (result) {
          result.pastResearches = result.pastResearches.filter(
            (word) => word !== wordToDelete
          );
          chrome.storage.local.set(
            { pastResearches: result.pastResearches },
            function () {
              console.log("Word deleted:", wordToDelete);
              updateListUI(result.pastResearches);
            }
          );
        });
      }
    });
  
    // Listen for messages from background.js to update the list
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.type === "toBeSaved") {
        chrome.storage.local.get({ pastResearches: [] }, function (result) {
          result.pastResearches.push(request.wordToBeSaved);
          chrome.storage.local.set(
            { pastResearches: result.pastResearches },
            function () {
              console.log("Word saved:", request.wordToBeSaved);
              updateListUI(result.pastResearches);
            }
          );
        });
      }
    });
  
    // Function to update the UI with the list of saved words
    function updateListUI(data) {
      listElement.innerHTML = ""; // Clear the list
  
      data.forEach(function (word) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${word}</span> <button data-word="${word}">Effacer</button>
        <input type="text" class="translationInput" data-word="${word}" placeholder="Entrez la traduction">
        <button class="saveBtn" data-word="${word}">Sauvgarder</button>`;
        listElement.appendChild(listItem);
      });
    }
  
    // Function to look up a word on WordReference
    function lookupWord(word) {
      chrome.runtime.sendMessage({ type: "toBeSearched", searchWord: word });
    }
  });
  