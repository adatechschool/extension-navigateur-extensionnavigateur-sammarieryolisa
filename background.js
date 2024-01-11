

// condition : si l'utilisateur clique sur un raccourci
// action : créer un nouvel onglet
chrome.action.onClicked.addListener(async () => { // si on clique sur l'icône de l'extension (à chancher si nécessaire)
    
    // // récupérer le contenu du presse-papier
    // let textSearch = await navigator.clipboard.readText()
	// console.log(textSearch)
    // // alternative : récupérer le texte sélectionné sur une page => il faudra peut-être déplacer ce bout de code dans un content_script
    // var selection = window.getSelection();
    
    
    // pour ouvrir un nouvel onglet
    chrome.tabs.create(
        {
            url: "https://www.wordreference.com/enfr/live"
        }
      )
});
