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
                <a href="index.php">Accueil</a>
            </div>
            <div class="nav-item">
                <a href="Tableau.php">Tableau</a>
            </div>
            <div class="nav-item">
                <a href="Figurine.php">Figurine</a>
            </div>
            <div class="nav-item">
                <a href="Katana.php">Katana</a>
            </div>
            <div class="nav-item">
                <a href="Entreprise.php">L'entreprise</a>
            </div>
        </div>

        <div class="nav-auth">
            <?php if (isset($_SESSION['pseudo'])): ?>
                <a href="MonCompte.php">Compte (<?php echo htmlspecialchars($_SESSION['pseudo']); ?>)</a>
                <a href="logout.php" class="logout">Se déconnecter</a>
            <?php else: ?>
                <a href="Login.html">Connexion</a>
                <a href="Register.html">S'inscrire</a>
            <?php endif; ?>
            	<a href="Panier.html" class="cart">🛒 Panier</a>
		<button id="music-btn" class="nav-item-btn" onclick="toggleMusic()">🔈 Musique</button>		
		<audio id="bg-music" loop>
        	<source src="audio/one-piece-theme.mp3" type="audio/mpeg">
        	Votre navigateur ne supporte pas l'élément audio.
    		</audio>
        </div>
    </div>

</nav>
<?php
include('config.php'); 

function afficherRoulette($categorie, $titre, $pdo) {
    echo '<section class="article-row">';
    echo '<h2>' . $titre . '</h2>';
    echo '<div class="scrolling-wrapper">';

    $query = $pdo->prepare("SELECT * FROM produits WHERE categorie = ?");
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
    afficherRoulette('katana', 'Nos Katanas', $pdo);
    ?>
<script>
function toggleMusic() {
    var music = document.getElementById("bg-music");
    var btn = document.getElementById("music-btn");

    if (music.paused) {
        music.play();
        btn.innerHTML = "🔊 Musique"; // Icône quand le son joue
        btn.style.backgroundColor = "#e67e22"; // On change la couleur pour montrer que c'est actif
    } else {
        music.pause();
        btn.innerHTML = "🔈 Musique"; // Icône quand c'est coupé
        btn.style.backgroundColor = "transparent";
    }
}
</script>
</main>
</body>
</html>
