<?php
session_start();

if (!isset($_SESSION['pseudo'])) {
    header('Location: Login.html');
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mon Compte</title>
</head>
<body>
    <h1>Bienvenue, <?php echo $_SESSION['pseudo']; ?> !</h1>
    
    <p><strong>Email :</strong> <?php echo $_SESSION['email']; ?></p>
    
    <br>
    <a href="index.php">Retour à l'accueil</a>
    <br><br>
    <a href="logout.php" style="color: red;">Se déconnecter</a>
</body>
</html>