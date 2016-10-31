<?php
  class SomeClass{
    static private $_instance = null;
    public static function getInstance(){
      if(self::$_instance==null){
        self:$_instance = new SomeClass();
      }
      return slef::$_instance;
    }
  }

  $obj = SomeClass::getInstance();
?>
