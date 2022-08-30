// on consigne un numéro de version. Ca permet aussi que tant qu'on ne met pas à jour manuellement ce numéro, on ne demande pas au navigateur de changer le service worker. Si on change la version, le navigateur sait qu'il doit "réinstaller le service worker"
const version = '2.00'
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


/* simple fetch général pour l'install button
self.addEventListener('fetch', ev => {
  //on se met en écoute d'un fetch (n'impporte lequel) sur le SW et on capture l'url
  const requestedUrl = new URL(
    ev.request.url)
}) 
*/

/* ces 3 events sur self install/activate/fetch en combinaison avec le if service worker in navigator permettent de rendre l'app installable

Ensuite si on veut on le pousse sur github, on le lie à netlify, du coup si on veut tester ça bosiquement on va sur l'adresse de l'url netlify on peut l'installer sur notre mobile!


*/

// définition d'un cache pour les assets (on pourrait en avoir un pour les scripts, un pour les htmls, ...)
const ASSETS_CACHE_NAME = "assets"

// création de 2 méthodes: une getter pour récup le cache et une setter pour mettre dans le cache. Attention ici on les défini seulement, faudra les utiliser plus tard
// le getter
const getResponseFromCache = ( // on passe deux param, 
  cacheName, //on  lui dit quel cache on veut aller chercher dans le cache. S'il y a quelque chose de ce nom la, alors on va la chercher dans le cache, sinon on va la chercher sur le serveur
  request 
  ) => {
    //return 
    return caches.open(cacheName) // ceci est une promesse
    .then (cache => {
      return cache.match(request)
    })
}

const setResponseCache = (// on psse 3 param
  cacheName,
  request,
  response //réponse du serveur
) => {
  //on ouvre le bon cache (pourpouvoir travailler dans un cache faut d'abord l'ouvrir)
  return caches.open(cacheName) // retourne une promesse
  .then(cache => {
    return cache.put(request, response) //on pousse dans le cache la requête et la réponse du serveur
  })
}

//Stratégies de cache
//Méthode de strat cacheFirst => si un fichier est dans le cache, alors je vais le chercher. On donne prio au cache
const fromCacheFirst = (
  cacheName, // dans quel cache je veux aller lire?
  request
) => {
  const response = getResponseFromCache(cacheName, request) // on appelle le getter et on lui repasse les mêmes param
  .then(response => { // quand on reçoit la réponse 
    if (response) { //si on reçoit une réponse valide 
      return response // alors c'est que le fichier est bien dans le cache, donc on peut le retourner au navigateur
    }
    else { //si pas de response valide, c'est que le fichier n'existe pas dans le cache
      // alors on envoie la requête sur le serveur
      return fetch(request)
      .then(response => {
        // on pourrait se contenter de faire simplement un return response, mais tant qu'a faire autant la mettre en cache (et on fait ça avant de la retourner)!
        setResponseCache(
          cacheName, 
          request, 
          response.clone() //on utilise une COPIE de la réponse, sinon il l'envoie dans le cache et elle n'est plus dispo pour envoyer au navigateur
          )
        return response //on renvoie la réponse à getResponseFromCache
      })
    }
  }) 
  return response // on re-renvoie la réponse au fetch
}

self.addEventListener("fetch", ev => {
  //c'est ce qu'on faisait dans le simple fetch en ligne ~20, sauf qu'on ne faisait rien de particulier. Ici on se met en écoute mais on utilise notre requête!
  // chaque fois que le navigateur fait une requête on récupère cette url
  const requestedUrl = new URL(
    ev.request.url 
  )
  console.log(requestedUrl.pathname)
  //on intercepte cette requête et on applique la strat fromCacheFirst
  if(requestedUrl.pathname.startsWith('/assets')) { // si le chemin de l'url de la requête commence par assets
    //alors l'ev de la requête doit répondre avec le résultat de la méthode fromCacheFirst
      ev.respondWith(fromCacheFirst(ASSETS_CACHE_NAME, ev.request))
      //du coup ICI on renvoie au navigateur avec le résultat de la stratégie
  }
})