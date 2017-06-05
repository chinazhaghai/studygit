;(function(){
  function Page(){
    /*if(!Detector.webgl){
      alert("your bowser does not support webgl,please use chrome ");
      return false;
    }*/
    var self = this;
    self.selectIndex = 0;
    self.texture = new THREE.ImageUtils.loadTexture("./img/texture1.png",null,function(){
      self.init();
    });
    self.title = new THREE.ImageUtils.loadTexture("./img/title.png",null,null);
    self.subTitle = new THREE.ImageUtils.loadTexture("./img/subTitle.png",null,null);



  }
  var proto = Page.prototype;
  proto.now = (
		(window.performance && window.performance.now && window.performance.now.bind(window.performance)) ||
		Date.now.bind(Date)
	);
  proto.init = function(){
    this.initData();
    this.initWebGL();
    this.initLoading();
    //this.start();
  }
  proto.start = function(){
    this.toolBar3Ds = []
    this.initAxis();
    this.tick = this.tick.bind(this);
    this.initEvent();
    this.makeObject();
    this.tick();
  }
  proto.initLoading = function(){
    var self = this;
    this.loadScene.position.z =-1*this.camera.position.z;
    this.loadingGroup = new THREE.Object3D();
    this.loadScene.add(this.loadingGroup);

    // 创建 文字

    /*var title = document.createElement("canvas");
    title.width = 400;
    title.height = 40;
    var tctx = title.getContext("2d");
    tctx.font = "lighter 38px lato,sans-serif";
    tctx.fillStyle = "#B5B5B5";
    tctx.fillText("Claude Debussy",(title.width-tctx.measureText("Claude Debussy").width)/2,30);*/
    /*var textGeo = new THREE.PlaneBufferGeometry(1000/50, 100/50);
    var ttex = new THREE.Texture(title);
    ttex.minFilter = THREE.LinearFilter;
    ttex.needsUpdate = true;*/
    var textGeo = new THREE.PlaneBufferGeometry(487/50, 73/50);
    var mat = new THREE.MeshBasicMaterial({transparent:true,/*map:ttex*/map:this.title,side:THREE.DoubleSide})
    var text = new THREE.Mesh(textGeo,mat);
    text.scale.set(2,2,1);
    text.material.opacity = 0;
    this.loadingGroup.add(text);
    this.title = text;







    /*var size = 400/50;
    var color = 0xcbcbcc;
    var box = new THREE.Object3D();

    box.position.y = -size/2;

    this.loadingBox = box;
    var leftBox = new THREE.Object3D();
    leftBox.position.x = -size/2;
    box.add(leftBox);
    var leftPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(size,size),new THREE.MeshBasicMaterial({transparent:true,color:color,side:THREE.DoubleSide}));
    leftPlane.rotation.y = Math.PI/2;
    leftPlane.position.y = size/2;
    leftBox.add(leftPlane);
    this.leftBox = leftBox;
    var rightBox = new THREE.Object3D();
    rightBox.position.x = size/2;
    box.add(rightBox);
    var rightPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(size,size),new THREE.MeshBasicMaterial({transparent:true,color:color,side:THREE.DoubleSide}));
    rightPlane.rotation.y = -Math.PI/2;
    rightPlane.position.y = size/2;
    rightBox.add(rightPlane);
    this.rightBox = rightBox;
    var backBox = new THREE.Object3D();
    backBox.position.z = -size/2;
    var backPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(size,size),new THREE.MeshBasicMaterial({transparent:true,color:color,side:THREE.DoubleSide}));
    backBox.add(backPlane);
    backPlane.position.y = size/2;
    box.add(backBox);
    this.backBox = backBox;
    var frontBox = new THREE.Object3D();
    frontBox.position.z = size/2;
    box.add(frontBox);
    var frontPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(size,size),new THREE.MeshBasicMaterial({transparent:true,color:color,side:THREE.DoubleSide}));
    frontPlane.position.y = size/2;
    frontBox.add(frontPlane);
    this.frontBox = frontBox;

    var bottomBox = new THREE.Object3D();
    box.add(bottomBox);
    var bottomPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(size,size),new THREE.MeshBasicMaterial({transparent:true,color:color,side:THREE.DoubleSide}));
    bottomPlane.rotation.x = -Math.PI/2;
    bottomBox.add(bottomPlane)
    this.bottomBox = bottomBox;*/

    //盒子中的文字
    /*var boxGeo = new THREE.PlaneBufferGeometry(600/50, 200/50);
    var boxText = document.createElement("canvas");
    boxText.width = 300;
    boxText.height = 100;
    var boxTtex = new THREE.Texture(boxText);
    boxTtex.minFilter = THREE.LinearFilter;
    var boxCtx = boxText.getContext("2d");
    boxCtx.fillStyle = '#B5B5B5';
    boxCtx.font = "lighter 30px lato,sans-serif";
    boxCtx.fillText("SUIT",(boxText.width-boxCtx.measureText("SUIT").width)/2,28);
    boxCtx.fillText("EBERGAMASQUE",(boxText.width-boxCtx.measureText("EBERGAMASQUE").width)/2,58);
    boxTtex.needsUpdate = true;*/
    var boxGeo = new THREE.PlaneBufferGeometry(439/25, 145/25);
    var boxMat = new THREE.MeshBasicMaterial({map:this.subTitle,side:THREE.DoubleSide})
    boxMat.transparent = true;
    boxMat.depthWrite = false;
    boxMat.depthTest = false;
    var boxText = new THREE.Mesh(boxGeo,boxMat);
    boxText.position.set(0,0,0);
    this.loadingGroup.add(boxText);
    boxText.material.opacity= 0;
    //box.add(boxText);
    //boxText.material.opacity = 0;
    //boxText.scale.set(0,0,1);
    this.boxText = boxText;

    this.loadingTime = 0;
    this.currentTime = this.now();
    this.loadTick = this.loadTick.bind(this);
    this.loadingFirst = false;
    this.particalGroup = new THREE.Object3D();
    var geom = new THREE.Geometry();
    var bg = document.createElement("canvas");
    bg.style.backgroundColor="transparent";
    bg.width = 40;
    bg.height = 40;
    var bgCtx = bg.getContext("2d");
    bgCtx.clearRect(0,0,40,40);
    bgCtx.fillStyle = "#B5B5B5";
    bgCtx.beginPath();
    bgCtx.arc(bg.width/2,bg.height/2,bg.width/2,0,Math.PI*2);
    bgCtx.closePath();
    bgCtx.fill();
    var texture = new THREE.Texture(bg);
    texture.needsUpdate = true;
    var cloud = new THREE.Object3D();
    this.cloud = cloud;
    var range = 500;
    var range2 = 80;
    for(var i=0,len=1000;i<len;i++){
      (function(i){
        var material = new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:1});
        var particle = new THREE.Vector3(Math.random() * range - range / 2,
                          Math.random() * range - range / 2, Math.random() * range - range );

        var geo = new THREE.CircleGeometry(Math.random()*2,32);
        var mesh = new THREE.Mesh(geo,material);
        mesh.finalPosition = particle;
        mesh.index = i;
        mesh.position.set(0,0,0);
        mesh.tick = function(){
          this.position.x += (this.finalPosition.x-this.position.x)*.02;
          this.position.y += (this.finalPosition.y-this.position.y)*.02;
          this.position.z += (this.finalPosition.z-this.position.z)*.02;
          this.material.opacity -=.003;
        }
        cloud.add(mesh);
      })(i)

    }

    this.firstPartical = false;
    this.cloud.tick = function(){
      for(var i=0,len=this.children.length;i<len;i++){
        this.children[i].tick();
      }
    }
    this.loadTick();

  }
  proto.loadTick = function(){
    var now = this.now();
    this.loadingTime += now-this.currentTime;
    this.currentTime = now;
    if(this.loadingTime<1000){
      this.title.material.opacity +=.06;
    }
    if(this.loadingTime >2000 ){
      this.title.material.opacity -=.1;
    }
    if(this.loadingTime>3000){
      this.boxText.material.opacity +=.1;
    }
    if(this.loadingTime>5000 && !this.firstPartical){
      this.boxText.material.opacity =0;
      this.firstPartical = true;
      this.loadingGroup.remove(this.loadingBox);
      this.loadScene.add(this.cloud);
      this.cloud.tick();
    }
    if(this.loadingTime>3000 && this.firstPartical){
      this.boxText.material.opacity =0;
      this.loadingGroup.remove(this.boxText);
      this.loadingGroup.remove(this.title);
      this.cloud.position.z +=1;
      this.cloud.tick();
    }
    if(this.cloud.position.z>=300){
      this.loadScene.remove(this.cloud);
      this.start();
    }else {
      requestAnimationFrame(this.loadTick);
    }

    /*if(this.loadingTime>2000 && !this.loadingFirst){
      this.loadingFirst = true;
      this.loadingGroup.add(this.loadingBox);
      this.loadingGroup.remove(this.title);
    }
    if(this.loadingTime<6000 && this.loadingFirst){
      this.loadingBox.position.y-=.06;
      this.leftBox.rotation.z+=.01;
      this.rightBox.rotation.z-=.01;
      this.backBox.rotation.x-=.01;
      this.frontBox.rotation.x+=.01;
      this.leftBox.children[0].material.opacity -=.005;
      this.rightBox.children[0].material.opacity -=.005;
      this.backBox.children[0].material.opacity -=.005;
      this.bottomBox.children[0].material.opacity -=.005;
      this.frontBox.children[0].material.opacity -=.005;
      this.loadingBox.rotation.y -=.01;
      this.boxText.rotation.y +=.01;
      this.boxText.position.y +=.08;
      this.boxText.material.opacity += .005;
      this.boxText.scale.x +=.008
      this.boxText.scale.y +=.008
    }
    if(this.loadingTime>7000 && !this.firstPartical){
      this.firstPartical = true;
      this.loadingGroup.remove(this.loadingBox);
      this.loadScene.add(this.cloud);
    }
    if(this.loadingTime>7000 && this.firstPartical){
      this.cloud.position.z +=1;
      this.cloud.tick();
    }
    if(this.cloud.position.z>=300){
      this.loadScene.remove(this.cloud);
      this.start();
    }else {
      requestAnimationFrame(this.loadTick);
    }*/


    this.loadRender();
  }
  proto.loadRender = function(){
    this.renderer.autoClear = false;
		this.renderer.clear();
    this.renderer.render(this.loadScene,this.camera);
  }
  proto.initData = function(){
    this.lineShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: [
        'varying float fog;',
        'void main() {',
        '  vec4 p = modelViewMatrix * vec4(position, 1.0);',
        '  fog = pow(min(1.0, max(0.0, -(p.z+100.0) / 300.0)), 2.0);',
        '  gl_Position = projectionMatrix * p;',
        '}'
      ].join("\n"),
      fragmentShader: [
        'uniform vec3 color;',
        'varying float fog;',
        'void main() {',
        '  gl_FragColor = vec4(mix(color, vec3(0.4, 0.408, 0.365), fog), 1.0);',
        '}'
      ].join("\n"),
      uniforms: {
        color: {type: 'v3', value: null}
      },
      transparent: false,
      depthWrite: true
    });
    this.canvasShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: [
        'varying vec2 vUv;',
        'varying float fog;',
        'void main() {',
        '  vUv = uv;',
        '  vec4 p = modelViewMatrix * vec4(position, 1.0);',
        '  fog = pow(min(1.0, max(0.0, -(p.z+100.0) / 300.0)), 2.0);',
        '  gl_Position = projectionMatrix * p;',
        '}'
      ].join("\n"),
      fragmentShader: [
        'uniform sampler2D map;',
        'uniform vec3 color;',
        'varying vec2 vUv;',
        'varying float fog;',
        'void main() {',
        '  gl_FragColor = vec4(mix(color, vec3(0.4, 0.408, 0.365), fog), pow(texture2D(map, vUv).a, 2.0));',
        '}'
      ].join("\n"),
      uniforms: {
        map: {type: 't', value: null},
        color: {type: 'v3', value: null}
      },
      transparent: true,
      depthWrite: false
    });
    this.colors = ([
      0x456058, 0x628059, 0x88a352, 0xafcd44, 0xa2cf80, 0xcbe3b6,
      0x834a6b, 0xa95476, 0xcc577d, 0xe86783, 0xe2978a, 0xe2978a,
      0x314993, 0x436dad, 0x5993c9, 0x76a3d4, 0x95a7d1, 0xb1aace,
      0xea5840, 0xf08241, 0xf6ab4c, 0xf5c44a, 0xecd760, 0xe1e879
    ]).map(function(c){return new THREE.Color(c);});

    this.labelColors = [0xA5C066,0xDA8DAB,0x474BAC,0xF74D2F];
    this.geographies = [' Prelude', 'Menuet', 'Clair de lune', 'Passepied'];
    this.introTime = 0;
  	this.cameraY = 0;
  	this.cameraZMotion = 0;
  	this.cameraZTarget = null;
  	this.cameraXOffset = 0;
  	this.cameraYOffset = 0.5;
    this.introLength = 1000;
    this.overlaysEl = document.getElementById("overlays");
  }
  proto.initWebGL = function(){
    var width = window.innerWidth , height = window.innerHeight;
    this.width = width;
    this.height = height;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);
		renderer.setClearColor(0xF1F2ED, 1.0);
    this.renderer = renderer;

    renderer.domElement.id = "three";
    document.body.appendChild(renderer.domElement);
    this.initScene();
  }
  proto.initScene = function(){
    var scene = new THREE.Scene();
    scene.frustumCulled = false;
    var camera = new THREE.PerspectiveCamera(50, this.width/this.height, 1, 3000);
		camera.position.z = 60;
		camera.position.y = 10;
		camera.target = new THREE.Vector3();
		camera.target.copy(camera.position);
		scene.fog = new THREE.Fog(0x66685D, 100, 4000);
		window.camera = camera;
    this.cameraVelocity = new THREE.Vector3();
		scene.add(camera);
    this.scene = scene;
    this.camera = camera;
    this.labelScene = new THREE.Scene();
		this.labelScene.fog = scene.fog;

    this.objScene = new THREE.Scene();
    this.objScene.fog = scene.fog;

    this.loadScene = new THREE.Scene();
    this.loadScene.fog = scene.fog;

    this.objScene.tick = function() {
			for (var i=0; i<this.children.length; i++) {
				if (this.children[i].tick) {
					this.children[i].tick();
				}
			}
		};

  }
  proto.makeLine = function(geo,mat){
    var smat = this.lineShaderMaterial.clone();
    smat.uniforms = {
      color:{type:'v3',value:new THREE.Vector3(mat.color.r,mat.color.g,mat.color.b)}
    };
    return new THREE.Line(geo,mat);
  }
  proto.makeBlob = function(color){
    var self = this;
    var geo = new THREE.PlaneBufferGeometry(1,1);
    var mat = self.canvasShaderMaterial.clone();
    mat.uniforms = {
      map:{type:"t",value:self.texture},
      color:{type:"v3",value:new THREE.Vector3(color.r,color.g,color.b)}
    }
    var plane = new THREE.Mesh(geo,mat);
    plane.scale.multiplyScalar(5/3);
    return plane;
  }
  proto.makeLabelGroup = function(index,geo,smat){
    var obj = new THREE.Object3D();
    var len = 5;
    var bg = new THREE.Mesh(
      new THREE.PlaneBufferGeometry((6/5)*6, 2),
      new THREE.MeshBasicMaterial({color: this.labelColors[index]})
    );
    bg.position.set(0,.5,0);
    obj.add(bg);
    bg.index = index;
    this.toolBar3Ds.push(bg);
    var textGeo = new THREE.PlaneBufferGeometry(320/50, 32/50);
    var textCanvas = document.createElement('canvas');
    textCanvas.width = 256;
    textCanvas.height = 30;
    var tex = new THREE.Texture(textCanvas);
    tex.minFilter = THREE.LinearFilter;
    var ctx = textCanvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = 'bold 38px Athelas';
    ctx.fillStyle = '#FFFFFF';

    var w = ctx.measureText(this.geographies[index]).width;
    ctx.fillText(this.geographies[index], (ctx.canvas.width-w)/2, 28);
    tex.needsUpdate = true;
    var mat = new THREE.MeshBasicMaterial( { map: tex, side: THREE.DoubleSide, blending: THREE.AdditiveBlending } );
    mat.transparent = true;
    mat.depthWrite = false;
    mat.depthTest = false;
    var text = new THREE.Mesh( textGeo, mat );
    text.position.copy(bg.position);
    obj.add(text);
    text.position.z = 0.01;
    for(var i=0;i<len;i++){
      var line = this.makeLine(geo,smat);
      line.position.set((6/5)*(6/4)*(i-(len-1)/2),0,0);
      obj.add(line);
    }
    return obj;
  }
  proto.initAxis = function(){
    var timelineGeometry = new THREE.Geometry();
		timelineGeometry.vertices.push(new THREE.Vector3( -1, 0, 0 ));
		timelineGeometry.vertices.push(new THREE.Vector3( 1, 0, 0 ));
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0xDCDCDD, fog: true });
    for (var i=0; i<10; i++) {
			var lineContainer = new THREE.Object3D();
			var line = this.makeLine( timelineGeometry, lineMaterial );
			line.scale.set(30, 1, 1);
			lineContainer.position.set( 0, -10, -1*i*40 );
			lineContainer.add(line);
      this.scene.add(lineContainer)
		}
    var lineGeometry = new THREE.Geometry();
		for (var i=0; i<=1000; i+=5) {
			lineGeometry.vertices.push(new THREE.Vector3( 0, 0, -i ));
		}
    var lines = new THREE.Object3D();
    var itemLanes = this.geographies.length;
    for (var i=0; i<itemLanes; i++) {
      var labelGroup = this.makeLabelGroup(i,lineGeometry,lineMaterial);
      labelGroup.position.set(45/itemLanes*(i-itemLanes/2)+4,-10,0);
      lines.add(labelGroup);
		}
    this.lines = lines;
    this.labelScene.add(lines);


  }
  proto.initEvent = function() {
    var self = this;
    window.onresize = function() {
      self.windowHalfX = window.innerWidth / 2;
      self.windowHalfY = window.innerHeight / 2;
      self.width = window.innerWidth;
      self.height = window.innerHeight;
      self.camera.aspect = self.width / self.height;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize( self.width, self.height );
    };

    var down = false;
    var clickActive = true;
    var lastX = 0;
    var lastY = 0;
    var downY = 0;
    var downX = 0;
    self.mouseCurrent = {clientX: 0, clientY: 0};
    var ongoingTouches = {};
    var activeTouch = null;
    self.touchMode = false;
    self.active = true;
    window.addEventListener('touchstart', function(ev) {
      if (ev.target.id !== 'overlays') return;
      var touches = ev.changedTouches;
      for (var i=0; i<touches.length; i++) {
        ongoingTouches[touches[i].identifier] = touches[i];
      }

      if (activeTouch === null) {
        self.touchMode = true;
        window.onmousedown(touches[0]);
        activeTouch = touches[0].identifier;
      }
      ev.preventDefault();
    }, false);
    window.addEventListener('touchend', function(ev) {
      if (ev.target.id !== 'overlays') return;
      var touches = ev.changedTouches;
      for (var i=0; i<touches.length; i++) {
        delete ongoingTouches[touches[i].identifier];
        if (touches[i].identifier === activeTouch) {
          window.onmouseup(touches[i]);
          activeTouch = null;
          self.touchMode = false;
        }
      }
      ev.preventDefault();
    }, false);
    window.addEventListener('touchcancel', function(ev) {
      if (ev.target.id !== 'overlays') return;
      var touches = ev.changedTouches;
      for (var i=0; i<touches.length; i++) {
        delete ongoingTouches[touches[i].identifier];
        if (touches[i].identifier === activeTouch) {
          window.onmouseup(touches[i]);
          activeTouch = null;
          self.touchMode = false;
        }
      }
      ev.preventDefault();
    }, false);


    this.overlaysEl = document.getElementById('overlays');
		this.overlaysEl.addEventListener('mousemove', function(ev) {
			self.mouseCurrent.clientX = ev.clientX;
			self.mouseCurrent.clientY = ev.clientY;
		}, false);
    this.overlaysEl.addEventListener('click', function(ev) {
			self.mouseCurrent.clientX = ev.clientX;
			self.mouseCurrent.clientY = ev.clientY;
      self.mouseCurrent.flag = "click";

		}, false);


    window.addEventListener('touchmove', function(ev) {
      if (ev.target.id !== 'overlays') return;
      var touches = ev.changedTouches;
      for (var i=0; i<touches.length; i++) {
        delete ongoingTouches[touches[i].identifier];
        if (touches[i].identifier === activeTouch) {
          window.onmousemove(touches[i]);
        }
      }
      ev.preventDefault();
    }, false);
    window.onmousedown = function(ev) {
      if (!self.active) return;
      down = true;
      downX = lastX = ev.clientX;
      downY = lastY = ev.clientY;
      self.cameraVelocity.multiplyScalar(0);
      clickActive = true;
      if (ev.preventDefault) {
        ev.preventDefault();
      }
    };

    window.onmousemove = function(ev) {

      if (self.active && down) {
        var dy = ev.clientY - lastY;
        var dx = ev.clientX - lastX;
        self.cameraVelocity.z = (
          self.touchMode
          ? self.cameraVelocity.z/2 + (-dy/3)/2
          : self.cameraVelocity.z/2 + -dy
        );
        lastY = ev.clientY;
        lastX = ev.clientX;
        if (Math.abs(downY - lastY) > 5 || Math.abs(downX - lastX) > 5) {
          clickActive = false;
        }
        if (self.touchMode) {
          self.cameraVelocity.x = self.cameraVelocity.x/2 + (-4*dx / window.innerWidth)/2;
          if (dx*dx > dy*dy) {
            self.cameraVelocity.z = 0;
          } else {
            self.cameraVelocity.x = 0;
          }
          if (self.cameraXOffset > 1) {
            self.cameraXOffset = 1;
            self.cameraVelocity.x = 0;
          }
          if (self.cameraXOffset < -1) {
            self.cameraXOffset = -1;
            self.cameraVelocity.x = 0;
          }
        }
      }
      var mouse3D = new THREE.Vector3(
        ( ev.clientX / self.width ) * 2 - 1,
        -( ev.clientY / self.height ) * 2 + 1,
        0.5
      );
      if (self.introTime > self.introLength) {
        self.cameraXOffset = self.touchMode ? self.cameraXOffset : mouse3D.x;
        self.cameraYOffset = self.touchMode ? (self.width > self.height ? 1 : 0.5) : mouse3D.y;
      }
      if (ev.preventDefault) {
        ev.preventDefault();
      }
    };

    window.onmouseup = function(ev) {
      if (!self.active) return;
      down = false;
      self.cameraZMotion = 0;
      self.cameraZTarget = null;
      if (ev.preventDefault) {
        ev.preventDefault();
      }


    };

    window.onkeydown = function(ev) {
      if (!self.active) return;
      if (this.introState < 4) {
      } else if (self.introTime >= self.introLength + 16) {
        if (ev.keyCode === 38) {
          self.moveCameraUp();
        } else if (ev.keyCode === 40) {
          self.moveCameraDown();
        }
      }
    };
    var self = this;
    window.onkeyup = function(ev) {
      if (!self.active) return;
      if (self.introTime >= self.introLength + 16) {
        if (ev.keyCode === 38 || ev.keyCode === 40) {
          self.stopCameraMotion();
        }
      }
    };

    window.onmousewheel = function(ev) {
      if (!self.active) return;
      if (this.introState < 4) {
      } else if (self.introTime >= self.introLength + 16) {
        self.cameraZTarget = (
          self.cameraZTarget || self.camera.position.z
        ) - ev.wheelDelta * 0.15;
      }
    };

    var tmpMat4 = new THREE.Matrix4();
    var tmpMat4B = new THREE.Matrix4();
    this.mouseX = -1;
    this.mouseY = -1;
    this.f = 0;
    this.findToolbarUnderEvent = function(ev) {
      this.mouseX = ev.clientX;
      this.mouseY = ev.clientY;
      var mouse3D = new THREE.Vector3(
        ( ev.clientX / self.width ) * 2 - 1,
        -( ev.clientY / self.height ) * 2 + 1,
        0.5
      );
      mouse3D.unproject( self.camera );
      mouse3D.sub( self.camera.position );
      mouse3D.normalize();

      if(!this.f){
          this.f = 1;
          self.camera.position.z = 100;
      }
      var camera3D = new THREE.Vector3(0,0,0);
      var raycaster = new THREE.Raycaster(this.camera.position,mouse3D);
			var intersects = raycaster.intersectObjects(this.toolBar3Ds,true);
			if ( intersects.length > 0 ) {
				var obj = intersects[0].object;
        if(ev.flag){
          this.openDialog(obj.index);
          ev.flag = null;
        }
				return obj;
			}



    };
    $("#indicater").click(function(ev){
      self.stopCameraMotion();
      if($(this).hasClass("active")){
        $(".note-box").removeClass("active");
        $(this).removeClass("active");
      }else {
        $(".note-box").addClass("active");
        $(this).addClass("active");
      }
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    });
    $(".note").click(function(ev){
      self.stopCameraMotion();
      var index = $(this).index();
      if($(".note-show").eq(index).hasClass("active")){
      	self.selectIndex = 0;
      	$(".note-show").eq(index).removeClass("active");
      }else{
      	self.selectIndex = index+1;
      	$(".note-show").removeClass("active").eq(index).addClass("active");
      }
      
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    });
    $("#overlays").click(function(ev){
      self.selectIndex = 0;
      $(".note-box,#indicater,.note-show").removeClass("active");
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    })
    var currentAudio = null;
    $(".dialog .play-audio").each(function(){
      $(this).on("click touchend",function(){
        var index = $(this).index('.play-audio');
        if($(this).hasClass("playing")){
          $(this).removeClass("playing")
          currentAudio.pause();
        }else {
          currentAudio = ($("audio").eq(index))[0];
          currentAudio.play();
          $(this).addClass("playing");
        }

      })
    })
    $(".dialog .close").on("click touchend",function(){
      $(".wrapper,.wrapper .dialog-box").hide().find(".play-audio").removeClass("playing");
      if(currentAudio){
        currentAudio.pause();
      }
      currentAudio = null;
    })
  };
  proto.openDialog = function(index){
    this.stopCameraMotion();
    if($(".wrapper").css("display")=="block") return;
    $(".wrapper,.wrapper .dialog-box:eq("+index+")").fadeIn(1000);
  }
  proto.makeObject = function(){
    var blobs = new THREE.Object3D();
    blobs.tick = this.objScene.tick;
    var itemLanes = this.geographies.length;
    for(var i=0;i<itemLanes;i++){
      for(var j=0,d=data[i],n=d.length;j<n;j++){
        var obj = this.makeBlob(this.colors[i*6+d[j].zIndex-1]);
        obj.frustumCulled = false;
        obj.selfIndex = d[j].zIndex;
        obj.selected = false;

        obj.material.color = this.colors[i*6+d[j].zIndex-1];
  			obj.material.colorChangeSpeed = 0.25;

        obj.originalPosition = -10+d[j].y;
        obj.originalOpacity = 1;
        obj.visible = true;
        obj.position.set(45/itemLanes*(i-itemLanes/2)+4+d[j].x*(6/5)*(6/4),-10*(-10+d[j].y),d[j].z);
        blobs.add(obj);
        var self = this;
        obj.tick = function(){
          this.position.y -= (this.position.y - this.originalPosition)*Math.random()*.1;
          if(this.selfIndex != self.selectIndex && !!self.selectIndex){
            var gray = new THREE.Color(0xcccccc);
            this.material.uniforms.color.value.set(gray.r,gray.g,gray.b);
          }else {
            this.material.uniforms.color.value.set(this.material.color.r,this.material.color.g,this.material.color.b);
          }
        };
      }
    }
    blobs.name = "blobs";
    this.objScene.add(blobs);
  }
  proto.tick = function(t, el, secondTick) {
    //return ;
    var cameraMinZ = -300;
    var cameraMaxZ = 60;
    var scene = this.scene;
    var camera = this.camera;
    var introTime = this.introTime;
    var cameraY = this.cameraY;
    var cameraZMotion = this.cameraZMotion;
    var cameraZTarget = this.cameraZTarget;
    var introState = this.introState;

    if (this.introTime < this.introLength + 16) {
      introTime = Math.max(0, this.introTime - (this.introLength - 3000));
      camera.position.y = Math.max(cameraY, cameraY + 20 * Math.pow(Math.max(0, 1-introTime/3000), 3.0));
      camera.position.z = ( 30+ -600 * Math.max(0, 1-Math.pow(introTime/3000, 2)));
      camera.target.x = 0;
      camera.target.y = camera.position.y + 40 * (1-introTime/3000) - 10;
      camera.target.z = camera.position.z - 50;
      this.labelScene.position.z = this.camera.position.z;
      camera.lookAt(camera.target);
      this.introTime += 16;
      $("#indicater").show();
    }
    this.objScene.tick();
    camera.position.z += cameraZMotion * 0.1;
    if (cameraZMotion > 0 && cameraZMotion < 20) {
      cameraZMotion += 0.25;
    } else if (cameraZMotion < 0 && cameraZMotion > -20) {
      cameraZMotion -= 0.25;
    }
    if (cameraZMotion === 0) {
      if (cameraZTarget && Math.abs(cameraZTarget-camera.position.z) < 0.001) {
        cameraZTarget = null;
      }
      if (cameraZTarget !== null) {
        camera.position.z += (cameraZTarget - camera.position.z) * 0.05;
      }
    }
    this.cameraZMotion = cameraZMotion;
    this.cameraZTarget = cameraZTarget;

    if (this.introTime >= this.introLength + 16) {
      camera.position.z += this.cameraVelocity.z;

      if (Math.abs(this.cameraVelocity.z) < 1) {
        this.cameraVelocity.z *= 0.9;
      } else {
        this.cameraVelocity.z *= 0.95;
      }

      if (Math.abs(this.cameraVelocity.z) < 0.01) {
        this.cameraVelocity.z = 0;
      }

      this.cameraXOffset += this.cameraVelocity.x;
      if (this.cameraXOffset > 1) this.cameraXOffset = 1;
      if (this.cameraXOffset < -1) this.cameraXOffset = -1;
      this.cameraVelocity.x *= 0.9;

      camera.position.x += (this.cameraXOffset * 10 - camera.position.x) * 0.05;
      camera.position.y += (cameraY + 8 + this.cameraYOffset * 3 - camera.position.y) * 0.05;

      camera.target.x += (Math.sin(this.cameraXOffset * 0.5) * 30 - camera.target.x) * 0.1;
      camera.target.y += (cameraY + 8 - 20 + this.cameraYOffset * 5 - camera.target.y) * 0.1;
      camera.target.z = camera.position.z - Math.cos(this.cameraXOffset * 0.5) * 50;

      camera.lookAt(camera.target);

      camera.updateProjectionMatrix();
      camera.updateMatrix();
      this.labelScene.position.z = camera.position.z - 25;
      if (camera.position.z > cameraMaxZ) {
        camera.position.z += (cameraMaxZ - camera.position.z) * 0.1;
      } else if (camera.position.z < cameraMinZ) {
        camera.position.z += (cameraMinZ - camera.position.z) * 0.1;
      }

      if (this.cameraZTarget > cameraMaxZ) {
        this.cameraZTarget += (cameraMaxZ - this.cameraZTarget) * 0.1;
      } else if (this.cameraZTarget < cameraMinZ) {
        this.cameraZTarget += (cameraMinZ - this.cameraZTarget) * 0.1;
      }

    }

    if (this.frameElapsed > 25 && (!secondTick || secondTick < 4)) {
      this.frameElapsed -= 25;
      this.tick(time, undefined, (secondTick || 0) + 1);
    } else {
      var time = this.now();
      this.frameElapsed = time - this.lastFrameTime;
      this.lastFrameTime = time;
      this.render();
      if ( this.findToolbarUnderEvent(this.mouseCurrent)  ) {
        this.overlaysEl.style.cursor = 'pointer';
      } else {
        this.overlaysEl.style.cursor = 'default';
      }

      window.requestAnimationFrame(this.tick);
    }
  };
  proto.render = function(){
    this.renderer.autoClear = false;
		this.renderer.clear();
    this.renderer.render(this.labelScene, this.camera);
		this.renderer.render(this.scene, this.camera);
    this.renderer.render(this.objScene, this.camera);
  }
  proto.moveCameraUp = function() {
    var self = this;
    if (self.cameraZMotion === 0) {
      self.cameraZTarget = null;
      self.cameraZMotion = -1;
    }
  };
  proto.moveCameraDown = function() {
    var self = this;
    if (self.cameraZMotion === 0) {
      self.cameraZTarget = null;
      self.cameraZMotion = 1;
    }
  };
  proto.stopCameraMotion = function() {
    var self = this;
    self.cameraZTarget = null;
    self.cameraZMotion = 0;
  };
  new Page();
})()
