<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/1
 * Time: 16:12
 */

//判断数组是否为关联数组
function is_assoc_array($arr){
  return array_diff_assoc(array_keys($arr),range(0,sizeof($arr)))?true:false;
}
function loadClass($className){
  $file = "./".$className.".class.php";
  if(!file_exists($file)) die("文件不存在");
  include_once $file;
}
spl_autoload_register('loadClass',true,true);