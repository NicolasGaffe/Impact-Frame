<?php
session_start();
require 'config.php';

$pseudo = $_POST['pseudo'];
$email  = $_POST['email'];
$mdp    = $_POST['mot_de_passe'];

$req = $pdo->prepare("SELECT * FROM Utilisateurs WHERE pseudo = ? AND email = ? AND mot_de_passe = ?");
$req->execute([$pseudo, $email, $mdp]);
$user = $req->fetch();

if ($user) {
    $_SESSION['pseudo'] = $user['pseudo'];
    $_SESSION['email']  = $user['email'];
    header('Location: index.html');
} else {
    header('Location: Login.html');
    }
?>

