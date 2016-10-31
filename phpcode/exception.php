<?php
  try{
    throw new Exception('error');
  }catch(Exception $e){
    echo $e;
  }
?>
