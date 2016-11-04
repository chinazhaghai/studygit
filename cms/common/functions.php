<?php
/*通用函数*/

//获取IP地址
function getIp(){
  if(!empty($_SERVER['REMOTE_ADD'])){
    $ip = 
  }else if(!empty($_SERVER['HTTP_X_FORWARD_FOR'])){

  }else if(!empty($_SERVER['CLIENT_IP'])){

  }else {

  }
}
