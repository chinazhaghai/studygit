<?php
  /*
  *工厂模式
  *在编写程序的时候，并不能确定在生成对象的时候其确切的对象类型，只有程序运行的时候才能确定，在动态的应用程序的时候，这种情况是最常见的
  */
  class Factory{
    static function Create($type){
      switch ($type) {
        case 'value':
          # code...
          break;

        default:
          # code...
          break;
      }
      return new SomeClassType();
    }
  }
?>
