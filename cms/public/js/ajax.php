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
  function POSTD($val){
    return (isset($_POST[$val]) && ereg("^[0-9]+$",$_POST[$val]))?$val:0;
  }
  $cmd = $_POST['cmd'];
  switch($cmd){
    // 前台获取 菜单栏
    case 'getMenu':
      $res = $db->getAll("query * from category");
      foreach ($res as $key => $value) {
        $arr = array();
        $arr['link'] = '/category/'.$value['id']."/";
        $arr['name'] = $value['name'];
        $msg[] = $arr;
      }
      break;
    // 前台获取文章列表
    case 'getList':
      $sql = "select * from article";
      if(($cid = POSTD('cid'))!=0){
        $sql.= " where category='{$cid}'";
      }
      $res = $db->getAll();
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
      break;
    case 'getArticle':
      $cid = $_POST['cid'];
      $id = $_POST['id'];
      $res = $db->getOne("select * from article where category='{$cid}' and id='{$id}'");
      foreach ($res as $key => $value) {
        $arr = array();
        $arr['title'] = $value['title'];
        $arr['time'] = $value['time'];
        $arr['link'] = '/category/'.$value['category'].'/'.$value['id'];
        $arr['author'] = $value['author'];
        $arr['content'] = $value['content'];
        $arr['sql'] = "select * from article where category='{$cid}' and id='{$id}'";
        $msg = $arr;
      }
      break;
    case '':
      break;
    default:
      break;
  }

echo json_encode($msg);

?>
