// on consigne un numéro de version. Ca permet aussi que tant qu'on ne met pas à jour manuellement ce numéro, on ne demande pas au navigateur de changer le service worker. Si on change la version, le navigateur sait qu'il doit "réinstaller le service worker"
const version = '1.04'
// c'est mieux que ça corresponde au numero de version config dans le service worker

//la première fois qu'on lance le fichier il va s'installer, et on écoute cet évènement pour afficher un message dans la console (uniquement à l'installation du SW)
self.addEventListener('install', () => {
  console.log('Log from event \'INSTALL\' in SW (Service Worker): ' + version)
  //et on dit de retourner l'installation du SW avant qu'il ne se soit installé
  return self.skipWaiting()
})

//ensuitre on regarde si il est activé (ndlr il s'active dès installation)
self.addEventListener('activate', () => {
  console.log('Log from event \'ACTIVATION\' in SW version ' + version)
  //on active une methode qui permet de controler les interractions entre le navigateur et le SW
  return self.clients.claim()
})

self.addEventListener('fetch', ev => {
  //on se met en écoute d'un fetch (n'impporte lequel) sur le SW et on capture l'url
  const requestedUrl = new URL(
    ev.request.url)
})

/* ces 3 events sur self install/activate/fetch en combinaison avec le if service worker in navigator permettent de rendre l'app installable

Ensuite si on veut on le pousse sur github, on le lie à netlify, du coup si on veut tester ça bosiquement on va sur l'adresse de l'url netlify on peut l'installer sur notre mobile!


*/

