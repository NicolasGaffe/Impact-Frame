# Impact Frame — Édition archive

Restauration finalisée le 27 octobre 2026.

Impact Frame est un projet de boutique autour de la culture manga et de One Piece : tableaux, figurines et katanas. Cette édition termine le parcours de visite pour conserver une archive agréable à consulter, sans dépendre d'un hébergement ni d'une base de données.

## Ouvrir le site

1. Extraire entièrement le fichier `Impact-Frame-archive.zip`.
2. Ouvrir le dossier `Impact-Frame`.
3. Double-cliquer sur **`index.html`** et l'ouvrir dans un navigateur récent (Edge, Chrome, Firefox ou Safari).

Il n'y a aucune dépendance à installer. Conserver le dossier complet : `assets/`, les trois scripts et la feuille de style accompagnent la page. Les liens internes utilisent des fragments `#` pour fonctionner sans configuration de serveur.

Si votre navigateur limite le stockage en ouverture directe, la visite fonctionne en mémoire et un message dans le carnet le précise. Le stockage des pages `file://` varie selon le navigateur ; déplacer le dossier ou changer de navigateur peut créer un carnet distinct. Les données du carnet ne sont pas incluses dans le ZIP.

### Aperçu local facultatif

Avec Node.js 18 ou plus récent : ouvrir un terminal dans ce dossier et lancer `npm start` (ou `node server.mjs`). Ouvrir ensuite `http://127.0.0.1:4173`. Arrêter avec `Ctrl+C`. Aucune installation de paquet n'est nécessaire. Le serveur écoute uniquement sur cet ordinateur. Le port peut être changé avec la variable `PORT`.

## Ce qui est terminé

- Accueil et identité visuelle crème, noir et rouge, inspirée du manga.
- Mise en page pour ordinateur, tablette et téléphone.
- Trois catégories et cinq articles de démonstration.
- Recherche insensible aux accents et à la casse ; tri par prix ou par nom.
- Fiches produits avec description, origine du visuel et informations explicites sur la démonstration.
- Favoris, panier, quantités de 1 à 20 par article et calculs en centimes.
- Simulation de commande avec récapitulatif et souvenir téléchargeable au format texte.
- Carnet local avec pseudonyme facultatif, favoris et vingt dernières simulations.
- Pages histoire, questions fréquentes, crédits et informations sur l'archive.
- Musique d'origine facultative, désactivée par défaut.
- Navigation au clavier, lien d'évitement, libellés accessibles, dialogues fermables avec Échap et prise en compte des mouvements réduits.
- Sauvegarde locale avec fonctionnement en mémoire si le navigateur la bloque ; synchronisation entre onglets de même origine.

## Ce qui a été reconstitué

Aucun export de la base MySQL initiale n'accompagnait le projet. Les noms, prix et présentations du catalogue sont donc des exemples créés pour la démonstration. Aucun stock, dimension physique, agrément ou statut de produit officiel n'est garanti.

Les tableaux sont des mises en scène des images d'origine. Le katana utilise la seule photographie produit retrouvée. La figurine Luffy est un visuel concept généré pour compléter la catégorie, sans correspondre à une référence commerciale réelle.

Cette archive ne crée pas de compte distant et ne demande ni adresse e-mail, ni mot de passe, ni coordonnées bancaires. Elle ne transmet aucune commande et ne réalise aucune vente ni expédition. Elle n'est pas une boutique de production : un véritable service commercial demanderait un catalogue vérifié, un serveur, la gestion des commandes, des paiements et les informations légales adaptées.

## Préservation des sources initiales

Le fichier **`Impact-Frame-original.zip`**, à côté de ce dossier dans l'archive complète, contient la copie des fichiers reçus. Le dossier original dans Téléchargements n'a pas été modifié.

Les problèmes rencontrés étaient notamment : accueil `.html` contenant du PHP, liens vers `index.php` absent, panier manquant, catalogue vide sans sa base, piste audio incorrecte sur la page Katana, comptes inachevés et documentation vide. L'authentification initiale comparait les mots de passe en clair ; elle a été remplacée dans cette édition par un carnet sans mot de passe, adapté à l'archive.

## Données du navigateur

Le stockage local utilise uniquement la clé `impact-frame-archive-v1`. Il contient panier, favoris, pseudonyme et simulations. Ces informations ne quittent pas ce navigateur. Dans **Mon carnet**, cliquer **Effacer mon carnet**, puis **Confirmer l'effacement**, pour remettre la visite à zéro. Aucun fichier du projet n'est effacé.

Pour conserver un souvenir hors du navigateur, utiliser **Télécharger le souvenir** après une simulation. Le ZIP du site ne contient pas les données de vos visites.

## Fichiers à modifier

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure générale, navigation, pied de page et dialogues |
| `style.css` | Identité visuelle et mise en page adaptative |
| `data.js` | Catalogue et catégories ; prix en centimes |
| `app.js` | Affichage des pages et interactions |
| `store.js` | État local, validation, panier et simulations |
| `assets/` | Visuels, icône et musique inclus dans l'archive |
| `server.mjs` | Aperçu HTTP local facultatif |
| `tests/store.test.cjs` | Tests autonomes du panier et de la sauvegarde |
| `CREDITS.md` | Provenance des images, musique et visuel généré |
| `VERIFICATIONS.md` | Vérifications réellement effectuées |

Pour ajouter un article, lui donner un identifiant unique stable dans `data.js` et copier son image dans `assets/`. Les prix sont des entiers en centimes : `4900` représente `49,00 €`. Aucun appel réseau ni compilation n'est nécessaire.

## Tests

Avec Node.js : `npm test` (ou `node tests/store.test.cjs`). Huit tests couvrent les quantités, les totaux, les favoris, la persistance, les données corrompues, le stockage bloqué, la limite d'historique et la synchronisation entre onglets.

## Crédits

Les images et la musique fournies avec le projet sont conservées pour cette archive. Les droits ne sont pas documentés dans les sources. Le crédit visible `zzyzzyy.deviantart.com` est conservé sur l'illustration océanique. One Piece et ses personnages appartiennent à leurs ayants droit. La restauration n'accorde aucun droit d'exploitation commerciale de ces ressources. Voir `CREDITS.md`.
