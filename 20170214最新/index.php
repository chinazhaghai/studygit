<?php
/**
 * Created by PhpStorm.
 * User: warmy
 * Date: 17/2/9
 * Time: 下午3:38
 */

include_once("../config.php");
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>结婚照</title>
    <meta name="viewport" content="width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="full-screen" content="true" />
    <meta name="screen-orientation" content="portrait" />
    <meta name="x5-fullscreen" content="true" />
    <meta name="360-fullscreen" content="true" />
    <link rel="stylesheet" type="text/css" href="http://event.yindudigital.com/public/weui.css">
    <link rel="stylesheet" href="./css/mode.css"/>
    <script src="./js/resizeRoot.js"></script>
    <script src="//event.yindudigital.com/public/js/vconsole.min.js"></script>
    <script src="//wximg.qq.com/wxp/libs/wxmoment/0.0.4/wxmoment.min.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>
  <div class="loading"></div>
  <div class="wrapper">
    <!--第一屏-->
    <div class="page page1 bg" data-src="page1-bg.jpg">
      <img data-src="page1-wallpic.png" class="wall-pic"/>
      <div class="human-right">
        <img data-src="page1-human-right.png" class="human-right-pic"/>
        <img data-src="page1-human-right-head.png" class="human-right-head"/>
      </div>
      <div class="human-left">
        <img data-src="page1-human-left.png" class="human-left-pic"/>
        <img data-src="page1-human-left-head.png" class="human-left-head"/>
      </div>
      <img data-src="page1-flower.png" class="flower"/>
      <img data-src="curtain-left.png" class="curtain-left"/>
      <img data-src="curtain-right.png" class="curtain-right"/>
      <img data-src="page1-angle-left.png" class="angle-left"/>
      <img data-src="page1-angle-right.png" class="angle-right"/>
      <div class="title-box">
        <img data-src="page1-title.png" class="title"/>
        <img data-src="page1-xi.png" class="xi"/>
        <img data-src="page1-flow-left.gif" class="flow-left"/>
        <img data-src="page1-flow-right.gif" class="flow-right"/>
      </div>
      <img data-src="page1-light.png" class="light"/>

      <img data-src="page1-camera.png" class="camera"/>
      <img data-src="page1-btn.png" class="btn" id="page1-btn"/>
    </div>
    <!--第二屏-->
    <div class="page page2 bg" data-src="page2-bg.jpg">
      <img data-src="page2-light.png" class="light"/>
      <img data-src="page2-title.png" class="title"/>
      <img data-src="page2-camera.png" class="camera"/>
      <img data-src="page2-angle-left.png" class="angle-left"/>
      <img data-src="page2-angle-right.png" class="angle-right"/>
      <img data-src="curtain-left.png" class="curtain-left"/>
      <img data-src="curtain-right.png" class="curtain-right"/>
      <img data-src="page2-flower.png" class="flower"/>
      <img data-src="page2-btn1.png" class="btn btn1" id="uniform-btn"/>
      <img data-src="page2-btn2.png" class="btn btn2" id="shirt-btn"/>
    </div>

    <!--第三屏-->
    <div class="page page3" >

      <div class="uniform-box" id="uniform-box">
        <img data-src="page3-unifom-bg.jpg" class="unifom-bg need-make" data-order="1"/>
        <div class="frame">
          <img data-src="page3-unifom-frame.png" class="frame-pic need-make" data-order="4"/>
          <canvas id="uniform-left-canvas" class="need-make" data-order="5"></canvas>
          <canvas id="uniform-right-canvas" class="need-make" data-order="6"></canvas>
          <img data-src="page3-unifom-mask1.png" class="mask1" id="uniform-mask1"/>
          <img data-src="page3-unifom-mask2.png" class="mask2"  id="uniform-mask2"/>
          <img data-src="page3-unifom-person.png" class="person need-make" data-order="7"/>
          <div class="camera-left camera" id="uniform-camera-left">
            <img data-src="page3-camera.png" />
          </div>
          <div class="camera-right camera" id="uniform-camera-right">
            <img data-src="page3-camera.png" />
          </div>
        </div>
        <img data-src="page1-flower.png" class="flower need-make" data-order="3"/>
      </div>

      <div class="shirt-box" id="shirt-box">
        <img data-src="page3-shirt-bg.jpg" class="shirt-bg need-make" data-order="1"/>
        <div class="frame">
          <img data-src="page3-shirt-frame.jpg" class="shirt-frame need-make" data-order="3"/>
          <canvas id="shirt-left-canvas" class="need-make" data-order="4"></canvas>
          <canvas id="shirt-right-canvas" class="need-make" data-order="5"></canvas>
          <img data-src="page3-shirt-mask1.png" class="mask1" id="shirt-mask1"/>
          <img data-src="page3-shirt-mask2.png" class="mask2" id="shirt-mask2"/>
          <img data-src="page3-shirt-person.png" class="person need-make" data-order="6"/>
          <div class="camera-left camera" id="shirt-camera-left">
            <img data-src="page3-camera2.png" />
          </div>
          <div class="camera-right camera" id="shirt-camera-right">
            <img data-src="page3-camera2.png" />
          </div>
        </div>
      </div>


      <img data-src="page3-piaodai.png" class="piaodai need-make" data-order="2">
      <img data-src="curtain-left.png" class="curtain-left need-make" data-order="8"/>
      <img data-src="curtain-right.png" class="curtain-right need-make" data-order="9"/>
      <img data-src="page3-tips.png" class="tips "/>
      <img data-src="page3-save-tips.png" class="save-tips" id="save-tips" />
      <img data-src="page3-btn.png" class="make-photo" id="make-photo"/>

      <img data-src="page3-share-btn.png" class="share-btn" id="share-btn"/>


    </div>

    <img data-src="logo.png" class="logo" data-order="20"/>
  </div>
  <div class="share-tips">
    <img data-src="share-tips.png" class="share-tips-pic"/>
  </div>
  <script src="./js/UploadFile.js"></script>
  <script src="./js/control.js"></script>
  <script type="text/javascript" src="./js/web.js"></script>
</body>
</html>
