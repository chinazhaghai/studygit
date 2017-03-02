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
      $T_P =array(
        "#\{\\$([a-zA-Z_][a-zA-Z_]*)\}#",
        "#\{loop \\$([a-zA-Z_][a-zA-Z_]*)\}#",
        "#\{\/(loop|if)\}#",
        "#\{\$(k|v)\}#",
        "#\{if\s*(.*?)\s*\}#i",
        "#\{else\}#",
        "#\{(elseif|else if)(.*?)\}#i"
      );
      $T_R = array(
        "<?php echo \"\\$\\1\";?>",
        "<?php foreach((array)\$\\1 as \$k=>\$v){?>",
        "<?php }?>",
        "<?php echo \$\\1;?>",
        "<?php if(\\1){?>",
        "<?php }else{?>",
        "<?php }else if(\\2){?>"
      );
      if(!is_file($compile_file) || filemtime($compile_file)<filemtime($source_file)){
        $content = file_get_contents($source_file);
        $content= preg_replace($T_P,$T_R,$content);
        file_put_contents($compile_file,$content);
      }
      extract($data,EXTR_OVERWRITE);
      include $compile_file;
      $message=ob_get_contents();
      file_put_contents($cache_file,$message);
    }

  }

}