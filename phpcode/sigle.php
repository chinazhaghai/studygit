<?php
  /*单例模式*/
  /*
  * 单例模式
  * 创建和管理一个单独的单一对象
  */
  class SomeClass{
    static private $_instance = null;
    public static function getInstance(){
      if(self::$_instance==null){
        self:$_instance = new SomeClass();
      }
      return slef::$_instance;
    }
    private function __clone(){}
    private function __construct(){}
  }

  $obj = SomeClass::getInstance();
?>
