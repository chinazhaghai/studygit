<?php
  function class_loader($className){
    require("../../classes/".$className.".class.php");
  }
  spl_autoload_register("class_loader");
  $msg = array();
  $db = ZMySql::getInstance();
  $db->connect("localhost","root","");
  $db->selectDb("blog");
  $db->query("set names utf8");


  $res = $db->getAll("select * from article");
  foreach ($res as $key => $value) {
    $arr = array();
    $arr['title'] = $value['title'];
    $arr['time'] = $value['time'];
    $arr['link'] = '/category/'.$value['category'].'/'.$value['id'];
    $arr['author'] = $value['author'];
    $desc = strip_tags($value['content']);
    $arr['desc'] = mb_substr($desc,0,200,'utf-8');

    $msg[] = $arr;
  }

  echo json_encode($msg);
  exit;
  $cmd = $_POST['cmd'];
  switch($cmd){
    case 'getArticle':
        $res = $db->getAll("select * from article");
        foreach ($res as $key => $value) {
          $arr = array();
          $arr['title'] = $value['title'];
          $arr['time'] = $value['time'];
          $arr['link'] = '/category/'.$value['category'].'/'.$value['id'];
          $arr['author'] = $value['author'];
          $arr['desc'] = substr(strip_tags($value['content']),0,180);
          $msg[] = $arr;
        }
      break;
    default:
      break;
  }

  echo json_encode($msg);

?>
