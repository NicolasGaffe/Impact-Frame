# Vérifications — 27 octobre 2026

## Tests automatiques

Les huit tests de `tests/store.test.cjs` ont réussi avec Node.js :

1. Ajout, quantités, limites, suppression et isolation des copies d'état.
2. Total de commande calculé en centimes, instantané des pièces et vidage du panier.
3. Persistance, favoris et pseudonyme.
4. Rejet ou normalisation des données corrompues et des références inconnues.
5. Fonctionnement en mémoire lorsque le stockage est bloqué.
6. Fonctionnement après dépassement du quota de stockage.
7. Historique limité à vingt simulations et remise à zéro.
8. Synchronisation entre onglets et validation des données reçues.

La syntaxe des quatre scripts a également été vérifiée. La présence des ressources locales et l'intégrité de la copie des sources sont contrôlées lors de l'assemblage de l'archive.

## Parcours vérifié dans Edge

- Ouverture de l'accueil et accès au catalogue via un aperçu HTTP local.
- Tri par prix croissant ; recherche de « equipage » sans accent et retour de la bonne pièce.
- Ouverture de la fiche L'Équipage, ajout de deux exemplaires, favori.
- Panier à 98,00 €, passage à trois exemplaires et récapitulatif à 147,00 €.
- Confirmation simulée, souvenir enregistré et panier vide.
- Pseudonyme, favori et historique conservés après rechargement.
- Filtre Figurines et fermeture du menu mobile après navigation.
- Affichage de l'accueil, de la fiche Luffy et du panier aux largeurs 390 et 320 pixels ; aucun débordement horizontal constaté sur les pages inspectées.
- Recherche sans résultat, affichage des questions fréquentes et remise à zéro du carnet de test.
- Aucun message d'erreur JavaScript capturé pendant le parcours inspecté.

## Limites de vérification

L'ouverture `file://` n'a pas pu être automatisée : l'outil de contrôle du navigateur autorise uniquement HTTP et HTTPS. Le site a été conçu et inspecté pour cette ouverture directe : scripts classiques, liens par fragments, ressources relatives, aucune requête `fetch`, module JavaScript, police distante ou base de données.

Les tests de sauvegarde bloquée sont automatisés, pas exécutés dans chaque navigateur. La restitution audio et le téléchargement du souvenir sont inclus mais n'ont pas fait l'objet d'un essai manuel sur tous les systèmes. Aucun contrôle de vente réelle n'est applicable à cette démonstration.
