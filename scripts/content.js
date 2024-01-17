// alternative : récupérer le texte sélectionné sur une page => il faudra peut-être déplacer ce bout de code dans un content_script
var selection = window.getSelection().toString().toLowerCase();

// condition : si la sélection n'est pas vide
if (selection){
    (async () => {
        // envoyer la sélection vers le background script
        const responsea = await chrome.runtime.sendMessage({type: "toBeSearched", searchWord: selection});
        // gérer la réponse : est-ce que j'en ai besoin ? ou bien est-ce que c'est plutôt à envoyer vers la sidebar ?
        console.log(responsea);
        
        // sauvegarder le mot
        await chrome.storage.local.get({ pastResearches: [] }, function (storageData) {
            storageData.pastResearches.push({word:selection, translation:""});
            console.log(storageData.pastResearches[0]);
            chrome.storage.local.set(
                { pastResearches: storageData.pastResearches },
                function () {
                    console.log("Word saved:", selection);
                }
                );
            });

            // transmettre le mot à la sidebar
            const responseb = await chrome.runtime.sendMessage({type: "updateList", wordToBeSaved: selection});
            // gérer la réponse : est-ce que j'en ai besoin ? ou bien est-ce que c'est plutôt à envoyer vers la sidebar ?
            console.log(responseb);
        })();

}

