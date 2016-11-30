WebGL学习整理
====

# 操作步骤
+ 获取 canvas
+ 获取上下文 var gl = canvas.getContext('expeimental-webgl') || canvas.getContext("webgl");
+ 设置清屏颜色 gl.clearColor(0,0,0,1);
+ 清屏 gl.clear(gl.COLOR_BUFFER_BIT);  COLOR_BUFFER_BIT DEPTH_BUFFER_BIT

# 绘制一个点
+ 设置 顶点着色
+ 设置 片元着色
+ 创建着色器
+ 绑定着色器
+ 绘制点
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>WebGL入门第一节课</title>
    <meta name="viewport" content="width=device-width,initial-scale = 1,user-scalable= no">
    <style media="screen">
      html,body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      * {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" width="300" height="300"></canvas>
  </body>
  <script type="text/javascript">
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var gl = canvas.getContext("expeimental-webgl") || canvas.getContext("webgl");
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    /*绘制一个平面*/
    //顶点着色器
    var VSHADER_SOURCE = 'void main(){\n'+
    'gl_Position = vec4(0.0,0.0,0.0,1.0);\n'+
    'gl_PointSize=100.0;\n'+
    '}\n';

    //片元着色器
    var FSHADER_SOURCE = 'void main(){\n'+
    'gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+
    '}\n';

    //初始化着色器
    var vshader = gl.createShader(gl.VERTEX_SHADER);
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vshader,VSHADER_SOURCE);
    gl.compileShader(vshader);
    gl.shaderSource(fshader,FSHADER_SOURCE);
    gl.compileShader(fshader);

    var program = gl.createProgram();
    gl.attachShader(program,vshader);
    gl.attachShader(program,fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    //绘制点
    gl.drawArrays(gl.POINTS,0,1);
  </script>
</html>
```
