// FONCTION PRINCIPALE : récupérer le mot sélectionné
var selection = window.getSelection().toString().toLowerCase();

if (selection){
    (async () => {

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
        
        // envoyer la sélection vers le background script pour ouvrir un onglet
        const responsea = await chrome.runtime.sendMessage({type: "toBeSearched", searchWord: selection});        

        // transmettre le mot à la sidebar pour l'lafficher
        const responseb = await chrome.runtime.sendMessage({type: "updateList", wordToBeSaved: selection});

        })();
}

