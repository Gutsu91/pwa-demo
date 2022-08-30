 // On fait un test pour vérifier que le navigateur gère le principe du service worker
 if('serviceWorker' in navigator) {
  //est-ce que cette méthode existe dans le navigateur
  //nb: navigator contient window par exemple, ou document
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
    // au chargement de la fenetre, on enregistre service-worker.js dans serviceWorker
    // c'est plutot lent et ça renvoie une promise :
    .then((reg) => {
      console.log('Notify', 'service worker is started @ scope ' + reg.scope)
    })
    .catch((e) => {console.log('alert','Service worker registration failed with ' + e)})
  })
}

// afficher le btn d'installation custom
const installBtn = document.querySelector('.install')
let deferredPrompt; // on déclare une propriété vide qui est GLOBALE pour qu'on puisse la nourrir dans un eventListener scopé
//on ajoute un écouteur d'évènement sur la window en entier
window.addEventListener('beforeinstallprompt', ev => {
ev.preventDefault() //désactive le bouton d'installation SUR NAVIGATEUR MOBILE, pas dans chrome browser
deferredPrompt = ev
// on stock l'évènement de window dans deferredPrompt
installBtn.classList.remove('hidden')
})

installBtn.addEventListener('click', ev => {
installBtn.classList.add('hidden')
deferredPrompt.prompt() // on déclenche l'évènement qu'on avait prevent dans le eventListenner. On prend la main
installBtn.classList.add('remove')
deferredPrompt.userChoice.then(choice => {
// on ajoute une promesse sur l'userchoice de deferredprompt
if (choice === 'accepted') { //si l'utilisateur accepte l'installation
console.log("Installation acceptée")
} else if (choice === 'cancelled') {
console.log("Installation refusée")
}
defferedPrompt = null
})


})