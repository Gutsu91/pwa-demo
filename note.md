# Service Worker
Le service worker s'abonne au systeme de notif => le service envoie une notif à toutes les services workers qui sont abonnés => le service worker envoie la notif.
Ca permet de ne pas toujours consulter le serveur

Il est lancé par le JavaScript du site, mais une fois qu'il est lancé, il s'exécute dans un thread de processeur différent que celui du site.
Ca veut aussi dire que si on ouvre plusieurs onglet, on ne garde qu'un seul service worker

A noter que le navigateur ne propose pas d'office le bouton natif pour activer le prompt d'installation natif, il regarde d'abord s'il n'y a pas un taux de rebond immédiat

On propose un bouton alternatif car le comportement d'installation depuis la barre d'url est très peu connu des utilisateurs