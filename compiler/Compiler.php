<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/1
 * Time: 16:42
 */
class Compiler{
  public $delimiter_left = '{';
  public $delimiter_right = '}';
  public function __construct(){
  }
  public function compile($source_file,$compile_file,$cache_file,$data){
    if(file_exists($cache_file)){
      include_once $cache_file;
    }else{
      ob_start();
      if(!is_file($compile_file) || filemtime($compile_file)<filemtime($source_file)){
        $content = file_get_contents($source_file);
        $content= preg_replace("#\{\\$([a-zA-Z_\x7f-\xff][a-zA-Z_\7f-\xff]*)\}#","<?php echo \"\\$\\1\";?>",$content);
        file_put_contents($compile_file,$content);
      }
      extract($data,EXTR_OVERWRITE);
      include $compile_file;
      $message=ob_get_contents();
      file_put_contents($cache_file,$message);
    }

  }

}