<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<link rel="stylesheet" href="style.css">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Impact Frame</title>
</head>
<nav class="navbar">
    <div class="nav-links">
        <div class="dropdown">
            <a href="Tableau.html" class="main-link">Tableaux</a>
            <div class="dropdown-content">
                <a href="Tableau_Manga.html">Par Manga</a>
                <a href="Tableau_Nouveau.html">Nouveautés</a>
            </div>
        </div>

        <div class="dropdown">
            <a href="Figurine.html" class="main-link">Figurines</a>
            <div class="dropdown-content">
                <a href="Figurine_Manga.html">Par Manga</a>
                <a href="Figurine_Nouveau.html">Nouveautés</a>
            </div>
        </div>

        <a href="Katana.html" class="main-link">Katanas</a>
        <a href="Entreprise.html" class="main-link">L'entreprise</a>
    </div>

    <div class="nav-auth">
        <?php if (isset($_SESSION['pseudo'])): ?>
            <a href="MonCompte.php">Compte (<?php echo htmlspecialchars($_SESSION['pseudo']); ?>)</a>
            <a href="logout.php" style="color: #ff4d4d;">Déconnexion</a>
        <?php else: ?>
            <a href="Login.html">Connexion</a>
        <?php endif; ?>
        <a href="Panier.html" class="cart-btn">🛒 Panier</a>
    </div>
</nav>
</html>





