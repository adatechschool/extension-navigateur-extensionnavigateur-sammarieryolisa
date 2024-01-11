// alternative : récupérer le texte sélectionné sur une page => il faudra peut-être déplacer ce bout de code dans un content_script
var selection = window.getSelection().toString().toLowerCase();

// condition : si la sélection n'est pas vide
if (selection){
    // envoyer la sélection vers le background script
    (async () => {
        const response = await chrome.runtime.sendMessage({searchWord: selection});
        // gérer la réponse : est-ce que j'en ai besoin ? ou bien est-ce que c'est plutôt à envoyer vers la sidebar ?
        console.log(response);
    })();
}