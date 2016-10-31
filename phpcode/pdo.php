<?php
  print_r(PDO::getAvailableDrivers());

  $pdo = new PDO("mysql:dbname=study;host=localhost",'root','');
  print_r($pdo);
?>
