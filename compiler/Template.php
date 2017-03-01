<?php

/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/2/28
 * Time: 14:54
 */
include_once './functions.php';
class Quako{
  private $_vars = [];
  public $template_suffix = ".tpl";
  public $template_dir = "./template/";
  public $compile_dir = "./compile/";
  public $cache_dir = "./cache/";
  public $cache_suffix = ".html";

  public function __construct(){
  }

  /*
   * @function:分配值
   * @params:$key $value
   * @params: $key string|array(key=>value|0=>$key)
   * */
  public function setItem($key,$value=null){
    if(is_null($key)) return;
    if(is_array($key)){
      if(is_assoc_array($key)){
        foreach($key as $k=>$v){
          $this->_vars[$k] = $v;
        }
      }else {
        foreach($key as $k=>$v){
          $this->_vars[$v] = $value;
        }
      }

    }else {
      $this->_vars[$key] = $value;
    }
  }

  /*
   * @function:删除铁定值
   * @params:$key string|array
   * */
  public function delItem($key){
    if(is_array($key)){
      foreach($key as $v){
        if(array_key_exists($v,$this->_vars)){
          unset($this->_vars[$v]);
        }
      }
    }else{
      if(array_key_exists($key,$this->_vars)){
        unset($this->_vars[$key]);
      }
    }

  }
  /*
   * @function:获取值
   * @params:$key null|string|array
   * */
  public function getItem($key=null){
    $resArr = [];
    if(empty($key)){
      $resArr = $this->_vars;
    }else{
      if(is_array($key)){
        foreach($key as $v){
          $resArr[$v] = array_key_exists($v,$this->_vars)?$this->_vars[$v]:"";
        }
      }else{
        $resArr[$key]=array_key_exists($key,$this->_vars)?$this->_vars[$key]:"";
      }

    }
    return $resArr;
  }

  /*
   * @function:编译文件
   * @params:$file:string
   * */
  public function show($file=''){
    if(empty($file)) die('请传入文件名称');
    $source_file = $this->template_dir.$file.$this->template_suffix;
    $compile_file = $this->compile_dir.$file.md5($file).".php";
    $cache_file = $this->cache_dir.$file.md5($file).$this->cache_suffix;
    if(!file_exists($source_file)) exit("模板不存在");
    if(!file_exists($this->compile_dir)) mkdir($this->compile_dir);
    if(!file_exists($this->cache_dir)) mkdir($this->cache_dir);
    include_once './Compiler.php';
    $compiler = new Compiler();
    $compiler->compile($source_file,$compile_file,$cache_file,$this->_vars);
  }
}
$t = new Quako();
$t->setItem('name','测试');
$t->setItem(array('id','hheda'),'测试');
$t->setItem(array('address'=>'测试','tel'=>'1815856489','title'=>'我就是我','demo'=>'demo'));
$t->show('index');