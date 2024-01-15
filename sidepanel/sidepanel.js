chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // console.log("message :", request, "envoyeur :", sender, "réponse à envoyer:", sendResponse)
    if (request.type === "toBeSaved") {
        document.querySelector(".list").innerHTML += `<li>${request.wordToBeSaved}</li>`
    }

    // sendResponse({ response: "mot sauvegardé" });
})