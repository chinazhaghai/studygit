<?php
namespace cms\classes;
class ZMySql{
  private static $_instance = null;
  private static $_conn = null;
  private function __construct(){}
  public  function getInstance(){
    if($_instance==null){
      self::$_instance = new ZMySql();
    }
    return self::$_instance;
  }
  public function connect($host,$username,$password,$port = 3306){
    self::$_conn = mysql_connect($host,$username,$password,$port);
    return $this;
  }
  public function selectDb($db){
    mysql_select_db($db);
    return $this;
  }
  public function query($sql){
    $res = mysql_query(mysql_escape_string($sql));
    return $res;
  }
  public function getAll($sql,$mode = MYSQL_ASSOC){
    $res = $this->query($sql);
    $arr = array();
    while($row = mysql_fetch_array($res,$mode)){
      array_push($arr,$row);
    }
    return $arr;
  }

  public function getOne($sql,$mode = MYSQL_ASSOC){
    $res = $this->query($sql);
    $arr = array();
    $row = mysql_fetch_array($res,$mode);
    array_push($arr,$row);
    return $arr;
  }
}
