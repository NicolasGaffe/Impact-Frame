<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Impact Frame</title>
    <link rel="stylesheet" href="style.css">
</head>
<body> 
<nav class="navbar">
    <div class="nav-container">
        <div class="menu-left">
            <div class="nav-item">
                <a href="Tableau.html">Tableau</a>
                <ul class="dropdown">
                    <li><a href="Tableau_Manga.html">Par Manga</a></li>
                    <li><a href="Tableau_Nouveau.html">Nouveautés</a></li>
                </ul>
            </div>

            <div class="nav-item">
                <a href="Figurine.html">Figurine</a>
                <ul class="dropdown">
                    <li><a href="Figurine_Manga.html">Par Manga</a></li>
                    <li><a href="Figurine_Nouveau.html">Nouveautés</a></li>
                </ul>
            </div>

            <div class="nav-item">
                <a href="Katana.html">Katana</a>
                <ul class="dropdown">
                    <li><a href="Katana_Manga.html">Par Manga</a></li>
                    <li><a href="katana_Nouveau.html">Nouveautés</a></li>
                </ul>
            </div>
            </div>
            
            <div class="nav-item">
                <a href="Entreprise.html">L'entreprise</a>
                <ul class="dropdown">
                    <li><a href="Magasin.html">Notre Magasin</a></li>
                    <li><a href="Service_Client.html">Service Client</a></li>
                    <li><a href="FAQ">FAQ</a></li>
                    <li><a href="Politique de Confidentialité.html">Politique de Confidentialité</a></li>
                </ul>
            </div>
        </div>

        <div class="nav-auth">
            <?php if (isset($_SESSION['pseudo'])): ?>
                <a href="MonCompte.php">Compte (<?php echo htmlspecialchars($_SESSION['pseudo']); ?>)</a>
                <a href="logout.php" class="logout">Quitter</a>
            <?php else: ?>
                <a href="Login.html">Connexion</a>
            <?php endif; ?>
            <a href="Panier.html" class="cart">🛒 Panier</a>
        </div>
    </div>
</nav>
<?php
include('config.php'); 

function afficherRoulette($categorie, $titre, $bdd) {
    echo '<section class="article-row">';
    echo '<h2>' . $titre . '</h2>';
    echo '<div class="scrolling-wrapper">';

    $query = $bdd->prepare("SELECT * FROM produits WHERE categorie = ?");
    $query->execute([$categorie]);
    $produits = $query->fetchAll();

    foreach ($produits as $produit) {
        echo '<div class="card">';
        echo '    <img src="img/' . htmlspecialchars($produit['image']) . '" alt="' . htmlspecialchars($produit['nom']) . '">';
        echo '    <h3>' . htmlspecialchars($produit['nom']) . '</h3>';
        echo '    <p>' . number_format($produit['prix'], 2) . '€</p>';
        echo '    <button class="btn-buy">Ajouter</button>';
        echo '</div>';
    }

    echo '</div>';
    echo '</section>';
}
?>

<main class="content">
    <?php 
    afficherRoulette('tableau', 'Nos Tableaux', $pdo);
    afficherRoulette('figurine', 'Nos Figurines', $pdo);
    afficherRoulette('katana', 'Nos Katanas', $pdo);
    ?>
</main>
</body>
</html>











