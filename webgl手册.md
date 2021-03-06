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
+ 创建程序对象
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

    //创建程序对象
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

# 存储限定符 attribute 顶点着色器
+ attribute vec4 variable
+ gl.getArributeLocation(gl.program,variable);
+ 赋值 gl.vertexAttrib3f(variable,0.0,0.0,0.0); 或者 gl.vertexAttrib4f(variable,0.0,0.0,0.0,0.0);
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
    var VSHADER_SOURCE = 'attribute vec4 a_Position ;\n'+'attribute float a_PointSize;\n'+'void main(){\n'+
    'gl_Position = a_Position;\n'+
    'gl_PointSize= a_PointSize ;\n'+
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

    var a_Position  = gl.getAttribLocation(program,"a_Position");
    var a_PointSize = gl.getAttribLocation(program,"a_PointSize");

    gl.vertexAttrib1f(a_PointSize,20.0);
    var mouse = [];
    canvas.addEventListener("touchmove",function(e){
      e.preventDefault();
      var x = e.changedTouches[0].clientX;
      var y = e.changedTouches[0].clientY;
      mouse.push({x:x,y:y});
      gl.clear(gl.COLOR_BUFFER_BIT);
      for(var i=0,len=mouse.length;i<len;i++){
        gl.vertexAttrib3f(a_Position,2*mouse[i].x/canvas.width-1,1-2*mouse[i].y/canvas.height,0.0);
        gl.drawArrays(gl.POINTS,0,1);
      }


      console.log()
    });

  </script>
</html>


```

# 片元着色器 uniform
+ uniform vec4 u_uniform
+ var u_uniform = gl.getUniformLocation(program,"u_uniform");
+ gl.uniform4f(u_uniform,1,1,1,1);

# 创建多边形
+ 知识点 缓冲区
+ 创建缓冲区 gl.createBuffer();
+ 绑定缓存区 gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
+ 写入数据   gl.bufferData(gl.ARRAY_BUFFER,vertices);
+ 将缓冲器数据分配给a_Position对象 gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
+ 连接a_Position变量与分配给她的缓冲区对象 gl.enableVertexAttribArray(a_Position);
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>webGL 学习教程三</title>
    <style media="screen">
      * {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas"></canvas>
  </body>
  <script type="text/javascript">
    var canvas  = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var gl = canvas.getContext("expeimental-webgl") || canvas.getContext("webgl");
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var VSHADER_SOURCE ="attribute vec4 a_Position;attribute float a_PointSize;void main(){gl_Position = a_Position;/*gl_PointSize = a_PointSize;*/}";
    var FSHADER_SOURCE ="void main(){gl_FragColor = vec4(1.0,0.0,0.0,1.1);}" ;

    var vshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader,VSHADER_SOURCE);
    gl.compileShader(vshader);
    var fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader,FSHADER_SOURCE);
    gl.compileShader(fshader);


    var program = gl.createProgram();
    gl.attachShader(program,vshader);
    gl.attachShader(program,fshader);
    gl.linkProgram(program);
    gl.useProgram(program);


    var a_Position = gl.getAttribLocation(program,'a_Position');
    ///三角形
    var vertices = new Float32Array([0.0,0.5,-.5,-.5,.5,-.5]);
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES,0,3);
  </script>
</html>

```
