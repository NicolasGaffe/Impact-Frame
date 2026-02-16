<?php
$pdo = new PDO("mysql:host=localhost;dbname=Impact-Frame;charset=utf8", "nicolas", "1234");

$pseudo = $_POST['pseudo'];
$email  = $_POST['email'];
$mdp    = $_POST['mot_de_passe'];

$ins = $pdo->prepare("INSERT INTO Utilisateurs (pseudo, email, mot_de_passe) VALUES (?, ?, ?)");
$ins->execute([$pseudo, $email, $mdp]);
header('Location: Login.html?success=1');
header('Location: Login.html');

?>

