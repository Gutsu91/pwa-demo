# Service Worker
Le service worker s'abonne au systeme de notif => le service envoie une notif à toutes les services workers qui sont abonnés => le service worker envoie la notif.
Ca permet de ne pas toujours consulter le serveur

Il est lancé par le JavaScript du site, mais une fois qu'il est lancé, il s'exécute dans un thread de processeur différent que celui du site.
Ca veut aussi dire que si on ouvre plusieurs onglet, on ne garde qu'un seul service worker