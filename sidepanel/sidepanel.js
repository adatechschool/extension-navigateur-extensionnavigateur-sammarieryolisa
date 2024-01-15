//chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log("message :", request, "envoyeur :", sender, "réponse à envoyer:", sendResponse)
    //if (request.type === "toBeSaved") {
        //document.querySelector(".list").innerHTML += `<li>${request.wordToBeSaved}</li>`
    //}

    // sendResponse({ response: "mot sauvegardé" });
//})
document.addEventListener("DOMContentLoaded", function() {
chrome.storage.local.get({ pastResearches: [] }, function(result) {
    updateListUI(result.pastResearches);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "toBeSaved") {
        chrome.storage.local.get({ pastResearches: [] }, function(result) {
            result.pastResearches.push(request.wordToBeSaved);
            chrome.storage.local.set({ pastResearches: result.pastResearches }, function() {
                console.log('Word saved:', request.wordToBeSaved);
            });
            updateListUI(result.pastResearches);
        });
    }
});

function updateListUI(data) {
    const listElement = document.querySelector(".list");
    listElement.innerHTML = ""; // Clear the list

    data.forEach(function(word) {
        listElement.innerHTML += `<li>${word}</li>`;
    });
}

});

