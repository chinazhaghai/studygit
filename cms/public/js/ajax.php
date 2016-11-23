<?php
  function class_loader($className){
    require("../../classes/".$className.".class.php");
  }
  spl_autoload_register("class_loader");
  $db = ZMySql::getInstance();
  $db->connect("localhost","root","");
  $db->selectDb("blog");
  $db->query("set names utf8");


exit;
  $cmd = $_POST['cmd'];
  switch($cmd){
    case 'getArticle':
        $res = $db->getAll("select * from article");
        foreach ($res as $key => $value) {
          $msg[]['title'] = $value['title'];
          $msg[]['author'] = $value['author'];
          $msg[]['desc'] = substr($value['content'],0,200);
          $msg[]['time'] = $value['time'];
          $msg[]['link'] = "/category/{$value['category']}/{$value['id']}";
        }
      break;
    default:
      break;
  }
  header("Content-Type:text/html;charset=utf-8");

  echo json_encode($msg);

?>
