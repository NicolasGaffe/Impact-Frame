<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>L'Entreprise - Impact Frame</title>
    <link rel="stylesheet" href="style.css">
</head>
<body> 

<nav class="navbar">
    <div class="nav-container">
        <div class="menu-left">
            <div class="nav-item">
                <a href="index.php">Accueil</a>
            </div>
            <div class="nav-item">
                <a href="Tableau.php">Tableau</a>
                <ul class="dropdown">
                    <li><a href="Tableau_Manga.html">Par Manga</a></li>
                    <li><a href="Tableau_Nouveau.html">Nouveautés</a></li>
                </ul>
            </div>
            <div class="nav-item">
                <a href="Figurine.php">Figurine</a>
                <ul class="dropdown">
                    <li><a href="Figurine_Manga.html">Par Manga</a></li>
                    <li><a href="Figurine_Nouveau.html">Nouveautés</a></li>
                </ul>
            </div>
            <div class="nav-item">
                <a href="Katana.php">Katana</a>
                <ul class="dropdown">
                    <li><a href="Katana_Manga.html">Par Manga</a></li>
                    <li><a href="katana_Nouveau.html">Nouveautés</a></li>
                </ul>
            </div>
        </div>

        <div class="nav-auth">
            <?php if (isset($_SESSION['pseudo'])): ?>
                <a href="MonCompte.php">Compte (<?php echo htmlspecialchars($_SESSION['pseudo']); ?>)</a>
                <a href="logout.php" class="logout">Se déconnecter</a>
            <?php else: ?>
                <a href="Login.html">Connexion</a>
            <?php endif; ?>
            <a href="Panier.html" class="cart">🛒 Panier</a>
        </div>
    </div>
</nav>

<main class="content">
    <div class="form-container" style="max-width: 800px;"> <h2>À propos d'Impact Frame</h2>
        <p style="text-align: justify; line-height: 1.6; color: #666;">
            Bienvenue chez <strong>Impact Frame</strong>. Nous sommes spécialisés dans la vente d'objets de collection pour les passionnés de culture japonaise. 
            Que vous cherchiez des tableaux dynamiques, des figurines détaillées ou des katanas d'exception, notre mission est de vous fournir la meilleure qualité possible.
        </p>
        
        <div style="display: flex; gap: 20px; margin-top: 30px; text-align: left;">
            <div style="flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #2c3e50;">Notre Vision</h3>
                <p>Devenir la référence pour les fans de mangas en proposant des produits exclusifs et un service client irréprochable.</p>
            </div>
            <div style="flex: 1; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #e67e22;">Engagement</h3>
                <p>Tous nos produits sont sélectionnés avec soin pour garantir une authenticité et une satisfaction totale.</p>
            </div>
        </div>
    </div>
</main>

</body>
</html>