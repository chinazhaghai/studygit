angular.module('motw').controller('mainController', function($scope, $sce, $location, $timeout, $http, Objects) {
	window.WebFontConfig = {
		google: { families: [ 'Lato:400,300,700,400italic:latin,latin-ext' ] },
		active: function(){ self.fontsLoaded = true; },
		inactive: function(){ self.fontsLoaded = true; }
	};

	window.resumeBGAudio = function() {
		if (self.audioManager && self.audioManager.mainVolume) {
			self.audioManager.masterVolume.gain.value = 1;
		}
	};

	window.stopBGAudio = function() {
		if (self.audioManager && self.audioManager.mainVolume) {
			self.audioManager.masterVolume.gain.value = 0;
		}
	};

	var self = this;

	$scope.shouldSkipIntro = ($location.path().replace("/","") !== "");

	var localStorage = window.localStorage || {};
	$scope.cookieWarningVisible = localStorage.cookieWarningVisible === 'false' ? false : true;

	$scope.categoryNames = [
		'Art and design',
		'Living and dying',
		'Power and identity',
		'Religion and belief',
		'Trade and conflict'
	];

	$scope.scrollHelp = false;
	$scope.showIntroHelp = (localStorage.showIntroHelp === 'false' ? false : true);

	$scope.hoverInfoObject = null;

	this.yearIntervals = [
		{start: 2100, end: -100, yearLength: 0.3},
		{start: -100, end: -500, yearLength: 0.2},
		{start: -500, end: -1000, yearLength: 0.1},
		{start: -1000, end: -5000, yearLength: 0.025},
		{start: -5000, end: -5e6, yearLength: 0.0002}
	];

	this.introLength = 14000;

	$scope.dismissCookieWarning = function() {
		$scope.cookieWarningVisible = false;
		localStorage.cookieWarningVisible = 'false';
	};

	$scope.dismissIntroHelp = function() {
		$scope.scrollHelp = false;
		localStorage.showIntroHelp = false;
	};

	$scope.share = function(mode){
		var share_url = "";
		if (mode === 'twitter') {
			share_url = 'https://twitter.com/intent/tweet?text='+encodeURIComponent("I'm exploring #MuseumOfTheWorld by @britishmuseum and @GoogleUK. See how our history is connected ")+'&url=';
		} else if (mode === "facebook") {
			share_url = "https://www.facebook.com/sharer/sharer.php?u=";
		} else if (mode === 'google') {
			share_url = "https://plus.google.com/share?url=";
		} else if (mode === 'email') {
			share_url = "mailto:info@example.com?subject=Museum%20of%20the%20World&body="+encodeURIComponent("I'm exploring #MuseumOfTheWorld by @britishmuseum and @GoogleUK. See how our history is connected ");
		} else {
			return;
		}
		share_url += encodeURIComponent($location.absUrl());
		var win = window.open(share_url, 'Share this', 'width=500,height=350');
    ga('send', {
      hitType: 'social',
      socialNetwork: mode,
      socialAction: 'like',
      socialTarget: $location.absUrl()
    });
	};

	$scope.toggle = function(key, value) {
		$scope[key] = ($scope[key] === value) ? null : value;
		$scope[key+'Toggled'] = $scope[key] === null ? false : true;
	};

	$scope.moveCameraUp = function() {
		if (self.cameraZMotion === 0) {
			self.cameraZTarget = null;
			self.cameraZMotion = -1;
		}
	};

	$scope.moveCameraDown = function() {
		if (self.cameraZMotion === 0) {
			self.cameraZTarget = null;
			self.cameraZMotion = 1;
		}
	};

	$scope.stopCameraMotion = function() {
		self.cameraZTarget = null;
		self.cameraZMotion = 0;
	};

	$scope.goToYear = function(year) {
		self.cameraZMotion = 0;
		self.cameraZTarget = self.mapYearToLandscapeZ(year) + 50;
	}

	$scope.advanceIntro = function(force) {
		$scope.introState = Math.min(4, $scope.introState + 1);
	};

	$scope.toggleMuted = function() {
		if (self.audioManager) {
			self.audioManager.toggleMuted();
		}
	};

	$scope.getMuted = function() {
		if (self.audioManager) {
			return self.audioManager.getMuted();
		}
		return true;
	};


	var xorgen = new xor4096('heabllo.');
	var loaderXorgen = new xor4096('alflog.');
	var objectXorgen = new xor4096('hello.');

	this.introTime = 0;
	this.cameraY = 0;
	this.cameraZMotion = 0;
	this.cameraZTarget = null;
	this.cameraXOffset = 0;
	this.cameraYOffset = 0.5;

	this.loadingPercentageMax = 0;

	this.init = function(skipChecks) {
		(function() {
			var wf = document.createElement('script');
			wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
			wf.type = 'text/javascript';
			wf.async = 'true';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(wf, s);
		})();

		$scope.screenSizeWarning = false;

		if (!skipChecks && (window.innerWidth < 770 || /mobile|iPad|iPhone|Android/i.test(navigator.userAgent))) {
			$scope.screenSizeWarning = true;
			return;
		}

		$scope.webgl = Detector.webgl;
		if (!Detector.webgl){
			return;
		}
		if (!this.initDone) {
			var self = this;
			this.geographies = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
			this.geoLane = {};
			this.geographies.forEach(function(e,i) { self.geoLane[e] = i; });
			this.colors = [
				0xFFBA0A, 0xF14F11, 0x8DC73C, 0x0071BC, 0x9E005D
			];

			var blobTextures = [];
			for (var i=0; i<16; i++) {
				var tex = new THREE.ImageUtils.loadTexture('./img/blob_'+ i +'.png', undefined, function() {
					self.loadingPercentageMax += 2;
				}, function() {
					self.loadingPercentageMax += 2;
				});
				tex.premultiplyAlpha = true;
				blobTextures.push(tex);
			}
			this.blobTextures = blobTextures;

			this.landscapeShaderMaterial = new THREE.ShaderMaterial({
				vertexShader: [
					'uniform float scale;',
					'uniform float time;',
					// 'varying float fog;',
					'varying vec3 vColor;',
					'void main() {',
					'	vColor = color;',
					'	vec4 p = modelViewMatrix * vec4(position, 1.0);',
					'	p.xyz += (0.1+0.00001*p.z*p.z)*vec3( sin(time+position.x+position.z), cos(time+position.y+position.z), sin(time+position.x+position.y+position.z) );',
					// '	fog = clamp(1.0 - pow(min(1.0, max(0.0, -(p.z+100.0) / 300.0)), 2.0), 0.0, 1.0);',
					'	gl_Position = projectionMatrix * p;',
					'	gl_PointSize = scale * 350.0 / length( p.xyz );',
					'}'
				].join("\n"),
				fragmentShader: [
					'uniform sampler2D map;',
					// 'varying float fog;',
					'varying vec3 vColor;',
					'void main() {',
					'  gl_FragColor = vec4(vColor.xyz, 0.25 * pow(texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y )).a, 2.0));',
					'}'
				].join("\n"),
				vertexColors: true,
				blending: THREE.AdditiveBlending,
				uniforms: {
					time: {type: 'f', value: 0},
					scale: {type: 'f', value: 1},
					map: {type: 't', value: null}
				},
				transparent: true,
				depthWrite: false
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
		}

		$scope.cameraMotionType = 'onlyTerrain';
		$scope.cameraMotionType = 'resizing2DToolBar';
		$scope.cameraMotionType = 'fixed2DToolBar';
		$scope.cameraMotionType = '3DToolBar';

		$scope.hoverInfoX = 0;
		$scope.hoverInfoY = 0;

		$scope.loadingPercentage = 0;

		if (!this.initDone) {
			this.initDone = true;

			this.initWebGL();
			this.initLandscape();
			this.setupEventListeners();
			this.initToolbar();
			this.initSounds();
			window.onresize();

			$http.get('js/landscapeCoords.json').then(function(object) {
				self.initTerrain(object.data);
				self.loadingPercentageMax += 50;
			}, function(err) {
				console.log("Failed to load terrain geometry.")
			});

			this.tick();
		}


		if ($scope.shouldSkipIntro) {

			this.skipIntro();

		} else {
			var loadSomeMore = function() {
				$scope.loadingPercentage = Math.min(self.loadingPercentageMax, $scope.loadingPercentage+1);
				if ($scope.loadingPercentage < 100) {
					$timeout(loadSomeMore, 60);
				} else {
					$scope.advanceIntro();
				}
			};

			if (self.fontsLoaded) {
				self.initIntro();
				$scope.introState = 0;
				$timeout(function(){
					$scope.advanceIntro();
					$timeout(loadSomeMore, 60);
				}, 2000);
			} else {
				window.WebFontConfig.active = window.WebFontConfig.inactive = function() {
					self.fontsLoaded = true;
					self.initIntro();
					$scope.introState = 0;
					$timeout(function(){
						$scope.advanceIntro();
						$timeout(loadSomeMore, 60);
					}, 2000);
					$scope.$digest();
				};
			}
		}
	};

	$scope.forceInit = function() {
		self.init(true);
	};





	this.now = (
		(window.performance && window.performance.now && window.performance.now.bind(window.performance)) ||
		Date.now.bind(Date)
	);
	this.lastFrameTime = this.now();
	this.render = function() {
		this.renderer.autoClear = false;
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		this.renderer.render(this.labelScene, this.camera);
	};
	this.tick = function(t, el, secondTick) {
		var cameraMinZ = this.mapYearToLandscapeZ(-2e6) + 40;
		var cameraMaxZ = this.mapYearToLandscapeZ(2015) + 40;
		this.active = ($location.path().replace("/","") === '');
		if (!this.objects || !this.active) {
			this.renderer.clear();
			window.requestAnimationFrame(this.tick);
			return;
		}
		var scene = this.scene;
		var camera = this.camera;
		var introState = $scope.introState;
		var introTime = this.introTime;
		var cameraY = this.cameraY;
		var cameraZMotion = this.cameraZMotion;
		var cameraZTarget = this.cameraZTarget;

		if (this.introTime > 3000 && this.audioManager) {
			this.audioManager.start();
		}

		if (this.introTime < this.introLength + 16) {
			introTime = Math.max(0, this.introTime - (this.introLength - 3000));

			if ($scope.introState < 3 && introTime > 0) {
				$scope.advanceIntro();
				$scope.$digest();
			}

			camera.position.y = Math.max(cameraY, cameraY + 40 * Math.pow(Math.max(0, 1-introTime/3000), 3.0));
			camera.position.z = (this.mapYearToLandscapeZ(2015)
				+ 28
				+ -800 * Math.max(0, 1-Math.pow(introTime/3000, 2))
			);

			camera.target.x = 0;
			camera.target.y = camera.position.y + 40 * (1-introTime/3000) - 10;
			camera.target.z = camera.position.z - 50;

			this.lines.position.z = this.camera.position.z;

			camera.lookAt(camera.target);

			if (introState >= 2) {
				this.introTime += 16;
			}
			if ($scope.showIntroHelp && this.introTime >= this.introLength + 16) {
				$scope.$apply(function(){
					$scope.scrollHelp = true;
				});
			}
			if (this.introBlobs) {
				this.introBlobs.position.copy(camera.target);
				this.introBlobs.lookAt(camera.position);
			}
		}

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
			if ($scope.introState < 4) {
				$scope.advanceIntro();
				$scope.$digest();
			}
			this.linesPlane.visible = false;

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

			this.labels.visible = true;
			this.toolBar3D.visible = true;
			this.labels.position.z = camera.position.z - 25;
			this.toolBar3D.position.z = camera.position.z - 25;

			this.lines.position.z = this.toolBar3D.position.z;

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

			if ($scope.hoverInfoObject) {
				var hoverInfoEl = document.getElementById('object-hover-info');
				scene.updateMatrixWorld();
				this.linesPlane.updateMatrixWorld();
				$scope.hoverInfoObject.hoverConnectionTarget.updateMatrixWorld();
				this.moveToScreenCoords( $scope.hoverInfoObject.hoverConnectionTarget, camera, hoverInfoEl.getBoundingClientRect() );
			}
		}

		this.landscapeShaderMaterial.uniforms.time.value += 0.016;

		scene.tick();

		if (this.frameElapsed > 25 && (!secondTick || secondTick < 4)) {
			this.frameElapsed -= 25;
			this.tick(time, undefined, (secondTick || 0) + 1);
		} else {
			var time = this.now();
			this.frameElapsed = time - this.lastFrameTime;
			this.lastFrameTime = time;
			this.render();

			if ( this.findToolbarUnderEvent(this.mouseCurrent) || this.findObjectUnderEvent(this.mouseCurrent) ) {
				this.overlaysEl.style.cursor = 'pointer';
			} else {
				this.overlaysEl.style.cursor = 'default';
			}

			window.requestAnimationFrame(this.tick);
		}
	};
	this.tick = this.tick.bind(this);
	this.active = ($location.path().replace("/","") === '');
	this.skipIntro = function() {
		$scope.introState = 4;
		this.introTime = this.introLength;
	};

	/*this.initWebGL();
	this.initLandscape();
	this.setupEventListeners();
	this.initToolbar();
	this.initSounds();*/

	this.initWebGL = function() {
		var renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio || 1);

		this.lastFrameTime = this.now();
		this.frameElapsed = 0;

		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer.setSize(width, height);

		renderer.setClearColor(0x66685D, 1.0);

		this.renderer = renderer;

		this.windowHalfX = width / 2;
		this.windowHalfY = height / 2;

		this.width = width;
		this.height = height;

		if (this.width > this.height) {
			this.cameraYOffset = 1;
		}

		renderer.domElement.id = 'main-canvas';
		document.body.appendChild(renderer.domElement);

		this.itemGeometry = new THREE.PlaneBufferGeometry(1, 1);
		this.initScene();

		return true;
	};
	this.initScene = function() {
		var scene = new THREE.Scene();
		scene.frustumCulled = false;
		var camera = new THREE.PerspectiveCamera(50, this.width/this.height, 1, 3000);
		camera.position.z = 100;
		camera.position.y = 2;

		camera.target = new THREE.Vector3();
		camera.target.copy(camera.position);

		scene.fog = new THREE.Fog(0x66685D, 100, 400);

		window.camera = camera;
		scene.add(camera);

		this.labelScene = new THREE.Scene();
		this.labelScene.fog = scene.fog;

		this.scene = scene;
		this.camera = camera;
		this.cameraVelocity = new THREE.Vector3();

		this.scene.tick = function() {
			for (var i=0; i<this.children.length; i++) {
				if (this.children[i].tick) {
					this.children[i].tick();
				}
			}
		};
	};



	/*创建地势*/
	this.initLandscape = function() {
		this.lanes = this.createLanes();
		this.dividers = this.lanes.dividers;
		this.lines = this.lanes.lines;
		this.linesPlane = this.lanes.linesPlane;
		this.scene.add(this.lanes);

		this.timeArrow = this.createTimeArrow();
		this.scene.add(this.timeArrow);
		var self = this;

		this.timeArrow.tick = function() {
			this.position.z = self.camera.position.z + this.zOffset;
		};

		var self = this;
		Objects.get(function(objectArray, objectIndex) {

			var i = 0;
			self.objectIndex = objectIndex;
			self.objects = self.createObjects(objectArray);
			self.objects.blobs.tick = self.scene.tick;
			self.objects.sticks.tick = self.scene.tick;

			self.scene.add(self.objects.blobs, self.objects.sticks);

			var blobs = self.objects.blobs;

			// console.time('blobs');

			var processBlobs = function(i) {
				var startTime = Date.now();
				for (; Date.now()-startTime < 12 && i<blobs.children.length; i++) {
					var blob = blobs.children[i];
					var obj = blob.objectData;
					var c = obj.dateCreated;
					var bullet = obj.bullet;
					obj.categoryObjects.sort(function(a, b) {
						return Math.abs(a.dateCreated - c) - Math.abs(b.dateCreated - c);
					});
					for (var j=0; j<obj.categoryObjects.length; j++) {
						var related = self.blobIndex[obj.categoryObjects[j].bullet];
						if (related && related.objectData.bullet !== bullet) {
							blob.addConnection(related);
						}
					}
				}
				return i;
			}

			var ival = setInterval(function() {
				// console.log(i);
				i = processBlobs(i);
				if (i === blobs.children.length) {
					// console.log('done');
					clearInterval(ival);
					self.loadingPercentageMax += 10;
					// console.timeEnd('blobs');
					return;
				}
			}, 16);

		});

	};
	this.initTerrain = function(LandscapeCoords) {
		this.landscapeCoords = LandscapeCoords;
		var verts = new Float32Array(LandscapeCoords[0].coords);
		var colors = new Float32Array(LandscapeCoords[0].colors);
		for (var i=0; i<verts.length; i++) {
			verts[i] = (verts[i] / 65535) * 447 - 227;
			colors[i] = (colors[i] / 16) * (0.63 - 0.365) + 0.365;
		}
		this.landscapeGeo1 = new THREE.BufferGeometry();
		this.landscapeGeo1.addAttribute( 'position', new THREE.BufferAttribute( verts, 3 ) );
		this.landscapeGeo1.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

		var verts = new Float32Array(LandscapeCoords[1].coords);
		var colors = new Float32Array(LandscapeCoords[1].colors);
		for (var i=0; i<verts.length; i++) {
			verts[i] = (verts[i] / 65535) * 447 - 216;
			colors[i] = (colors[i] / 16) * (0.63 - 0.365) + 0.365;
		}
		this.landscapeGeo2 = new THREE.BufferGeometry();
		this.landscapeGeo2.addAttribute( 'position', new THREE.BufferAttribute( verts, 3 ) );
		this.landscapeGeo2.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

		this.terrain = this.createTerrain();
		this.scene.add(this.terrain);

	};
	this.createTerrain = function() {
		var terrain = new THREE.Object3D();
		var mat1 = new THREE.PointCloudMaterial({
			vertexColors: true, sizeAttenuation: true,
			map: this.blobTextures[0], transparent: true,
			opacity: 0.25
		});
		mat1.blending = THREE.AdditiveBlending;
		var mat2 = new THREE.PointCloudMaterial({
			vertexColors: true, sizeAttenuation: true,
			map: this.blobTextures[0], transparent: true,
			opacity: 0.25
		});
		mat2.blending = THREE.AdditiveBlending;

		mat1 = mat2 = this.landscapeShaderMaterial;
		mat2.blending = THREE.AdditiveBlending;
		this.landscapeShaderMaterial.uniforms.map.value = this.blobTextures[0];

		terrain.add(
			new THREE.PointCloud(this.landscapeGeo1, mat1),
			new THREE.PointCloud(this.landscapeGeo2, mat2)
		);
		terrain.frustumCulled = false;

		terrain.scale.set(2,2,4.5);
		terrain.position.set(0, -20, 0);

		return terrain;
	};
	this.terrainGeometry = new THREE.SphereGeometry(1, 6, 16);
	this.terrainMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 });
	this.createTimeArrow = function() {
		var lineMaterial = new THREE.LineBasicMaterial({ color: 0xCCCCCC, fog: true });

		var upArrowGeo = new THREE.Geometry();
		upArrowGeo.vertices.push(new THREE.Vector3(-1, 1, -1));
		upArrowGeo.vertices.push(new THREE.Vector3(0, 0, 0));
		upArrowGeo.vertices.push(new THREE.Vector3(1, -1, -1));

		var downArrowGeo = new THREE.Geometry();
		downArrowGeo.vertices.push(new THREE.Vector3(-1, 1, 1));
		downArrowGeo.vertices.push(new THREE.Vector3(0, 0, 0));
		downArrowGeo.vertices.push(new THREE.Vector3(1, -1, 1));

		var arrowLineGeo = new THREE.Geometry();
		arrowLineGeo.vertices.push(new THREE.Vector3(0,0,0));
		arrowLineGeo.vertices.push(new THREE.Vector3(0,0,1));

		var arrowLineSeparatorGeo = new THREE.Geometry();
		arrowLineSeparatorGeo.vertices.push(new THREE.Vector3(0,0,0));
		arrowLineSeparatorGeo.vertices.push(new THREE.Vector3(1,0,0));

		var upSeparator = new THREE.Line(arrowLineSeparatorGeo, lineMaterial);
		var downSeparator = new THREE.Line(arrowLineSeparatorGeo, lineMaterial);

		var upArrow = new THREE.Line(upArrowGeo, lineMaterial);
		var downArrow = new THREE.Line(downArrowGeo, lineMaterial);

		var upArrowLine = new THREE.Line(arrowLineGeo, lineMaterial);
		var downArrowLine = new THREE.Line(arrowLineGeo, lineMaterial);

		var textCanvas = document.createElement('canvas');
		textCanvas.width = 128;
		textCanvas.height = 32;

		var ctx = textCanvas.getContext('2d');
		ctx.font = '30px Lato, Arial';
		ctx.fillStyle = '#FFFFFF';
		var textWidth = ctx.measureText("TIME").width;
		ctx.fillText("TIME", (textCanvas.width - textWidth) / 2, 28);

		var tex = new THREE.Texture(textCanvas);
		tex.needsUpdate = true;

		var mat = this.canvasShaderMaterial.clone();
		var color = new THREE.Color(0xCCCCCC);
		mat.uniforms = {
			map: {type: 't', value: tex},
			color: {type: 'v3', value: new THREE.Vector3(color.r, color.g, color.b)}
		};

		var text = new THREE.Mesh( new THREE.PlaneBufferGeometry(textCanvas.width/25, textCanvas.height/25), mat );
		text.position.set(64/25, 16/25, 0);
		text.rotation.x = -0.4;

		upSeparator.position.y = 16/25 - 16/25 * Math.cos(text.rotation.x);
		upSeparator.position.z = - 16/25 * Math.sin(text.rotation.x);
		downSeparator.position.y = 16/25 + 16/25 * Math.cos(text.rotation.x);
		downSeparator.position.z = + 16/25 * Math.sin(text.rotation.x);

		upSeparator.scale.set(128/25, 1, 1);
		downSeparator.scale.set(128/25, 1, 1);

		upArrowLine.position.set(64/25, upSeparator.position.y, upSeparator.position.z);
		upArrowLine.scale.set(1, 1, 20);
		downArrowLine.position.set(64/25, downSeparator.position.y, downSeparator.position.z);
		downArrowLine.scale.set(1, 1, -20);

		upArrow.position.copy(upArrowLine.position);
		upArrow.position.z += upArrowLine.scale.z;

		downArrow.position.copy(downArrowLine.position);
		downArrow.position.z += downArrowLine.scale.z;


		var timeLane = new THREE.Object3D();

		timeLane.position.set(-35, -5, 0);
		timeLane.zOffset = -60;

		timeLane.add(text);
		timeLane.add(upSeparator);
		timeLane.add(downSeparator);

		timeLane.add(upArrow);
		timeLane.add(upArrowLine);

		timeLane.add(downArrow);
		timeLane.add(downArrowLine);

		return timeLane;

	};
	this.makeLine = function(geo, mat) {
		var smat = this.lineShaderMaterial.clone();
		smat.uniforms =  {
			color: {type: 'v3', value: new THREE.Vector3(mat.color.r, mat.color.g, mat.color.b)}
		};
		return new THREE.Line(geo, smat);
	};
	this.createLanes = function() {
		var lineGeometry = new THREE.Geometry();
		for (var i=0; i<=1500; i+=5) {
			lineGeometry.vertices.push(new THREE.Vector3( 0, 0, -i ));

		}

		var timelineGeometry = new THREE.Geometry();
		timelineGeometry.vertices.push(new THREE.Vector3( -1, 0, 0 ));
		timelineGeometry.vertices.push(new THREE.Vector3( 1, 0, 0 ));

		var lineMaterial = new THREE.LineBasicMaterial({ color: 0xCCCCCC, fog: true });

		var lanes = new THREE.Object3D();
		var lines = new THREE.Object3D();
		var dividers = new THREE.Object3D();

		var linesPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(144, 144),
			new THREE.MeshBasicMaterial({ color: 0xff00ff })
		);
		linesPlane.material.side = THREE.DoubleSide;
		linesPlane.position.y = 0;
		linesPlane.position.z = 10;
		linesPlane.visible = false;
		lines.add(linesPlane);

		lanes.dividers = dividers;
		lanes.add(dividers);
		lanes.linesPlane = linesPlane;

		lines.position.z = 1000;

		var formatNumber = function(n) {
			var s = n.toString();
			var ss = "";
			for (var i = 0; i < s.length; i++) {
				var j = s.length - 1 - i;
				ss = s.charAt(j) + ss;
				if (i > 0 && i % 3 === 2 && j > 0) {
					ss = "," + ss;
				}
			}
			return ss;
		};


		var itemLanes = this.geographies.length;

		var yearTickGeometry = new THREE.Geometry();

		var lastYearZ = null;

		var years = [
			-2e6,
			-1e6,
			-500e3,
			-5e3, -4e3, -3e3, -2e3, -1e3,
			-500, -400, -300, -200, -100,
			0,
			100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000
		];

		for (var i=0; i<years.length; i++) {

			var year = years[i];
			var z = this.mapYearToLandscapeZ(year);
			var lineContainer = new THREE.Object3D();
			var line = this.makeLine( timelineGeometry, lineMaterial );
			line.scale.set(30, 1, 1);
			lineContainer.position.set( 0, -10, z );
			lineContainer.add(line);
			dividers.add(lineContainer);

			var textCanvas = document.createElement('canvas');
			textCanvas.width = 256;
			textCanvas.height = 32;

			var ctx = textCanvas.getContext('2d');
			ctx.font = 'bold 30px Lato, Arial';
			ctx.fillStyle = '#FFFFFF';
			ctx.fillText((year > 0) ? 'AD ' + year : ((year < 0) ? (year <= -10e3 ? formatNumber(-year) : -year) + ' BC' : 'BC / AD'), 2, 28);

			var tex = new THREE.Texture(textCanvas);
			tex.needsUpdate = true;

			var mat = this.canvasShaderMaterial.clone();
			var color = new THREE.Color(0xFFFFFF);
			mat.uniforms = {
				map: {type: 't', value: tex},
				color: {type: 'v3', value: new THREE.Vector3(color.r, color.g, color.b)}
			};

			var text = new THREE.Mesh( new THREE.PlaneBufferGeometry(textCanvas.width/25, textCanvas.height/25), mat );
			text.position.set( -30+5, -1, 0 );

			lineContainer.add(text);

			if (lastYearZ !== null) {
				for (var j=0; j<=10; j++) {
					var f = (j / 10)
					var tickZ = (1-f) * lastYearZ + f * z;
					yearTickGeometry.vertices.push(
						new THREE.Vector3(-18, -10, tickZ),
						new THREE.Vector3(-18 + (j===5 ? -2 : -1), -10, tickZ),
						new THREE.Vector3(-18, -10, tickZ)
					);
				}
			}
			lastYearZ = z;
		}


		for (var i=0; i<itemLanes; i++) {
			var line = this.makeLine( lineGeometry, lineMaterial );
			line.position.set( (6/5)*6*(i-(itemLanes-1)/2)-(6/5)*3,  -10,  0 );
			lines.add(line);
		}

		var line = this.makeLine( lineGeometry, lineMaterial );
		line.position.set( (6/5)*6*(i-(itemLanes-1)/2)-(6/5)*3,  -10,  0 );
		lines.add(line);


		var yearTicks = this.makeLine(yearTickGeometry, lineMaterial);
		lanes.add(yearTicks);

		lanes.add(lines);
		lanes.lines = lines;

		return lanes;
	};

	this.setupEventListeners = function() {
		window.onresize = function() {

			self.windowHalfX = window.innerWidth / 2;
			self.windowHalfY = window.innerHeight / 2;

			self.width = window.innerWidth;
			self.height = window.innerHeight;

			self.camera.aspect = self.width / self.height;
			self.camera.updateProjectionMatrix();

			self.renderer.setSize( self.width, self.height );

			self.landscapeShaderMaterial.uniforms.scale.value = self.renderer.domElement.width / 1000;
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

		this.overlaysEl = document.getElementById('overlays');
		this.overlaysEl.addEventListener('mousemove', function(ev) {
			self.mouseCurrent.clientX = ev.clientX;
			self.mouseCurrent.clientY = ev.clientY;
		}, false);

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
			} else if (self.active && ev.target === document.getElementById('overlays')) {
				var previousHovered = null;
				self.objects.blobs.children.forEach(function(c) {
					if (c.hovered) {
						previousHovered = c;
					}
					c.hovered = false;
				});
				var obj = self.findToolbarUnderEvent(ev);
				if (obj) {
					$scope.hoveredGeography = obj.geographyName;
				} else {
					$scope.hoveredGeography = null;
					obj = self.findObjectUnderEvent(ev);
					if (obj) {
						obj.hovered = true;
						if (obj !== previousHovered && (obj.soundLastPlayed == null || (Date.now() - obj.soundLastPlayed) > 200)) {
							obj.soundLastPlayed = Date.now()
							if (obj.soundIndex === undefined) {
								obj.soundIndex = -4*obj.position.y;
							}
							self.audioManager.playSoundEffect(obj.soundIndex);
						}
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
			// console.log(ev.target);
			if (clickActive && ev.target === document.getElementById('overlays')) {
				var obj = self.findToolbarUnderEvent(ev);
				if (obj) {
					if ($scope.selectedGeography === obj.geographyName) {
						$scope.selectedGeography = null;
					} else {
						$scope.selectedGeography = obj.geographyName;
					}
				} else {
					var obj = self.findObjectUnderEvent(ev);
					self.objects.blobs.children.forEach(function(c) {
						c.selected = false;
						c.connectionSelected = false;
					});
					var needDigest = false;
					if (obj) {
						obj.selected = true;
						if (!$scope.categoryToggled && $scope.category !== obj.objectData.categoryName) {
							$scope.category = (obj.objectData.categoryName + '').toLowerCase();
							needDigest = true;
						}
						obj.connections.forEach(function(c) {
							c.connectionSelected = true;
						});
					} else if (!$scope.categoryToggled && $scope.category !== null) {
						$scope.category = null;
						needDigest = true;
					}
					if ($scope.hoverInfoObject !== obj) {
						$scope.hoverInfoObject = obj;
						needDigest = true;
						if (needDigest) {
							$scope.$digest();
						}
						if ($scope.hoverInfoObject) {
							var hoverInfoEl = document.getElementById('object-hover-info');
							if (ev.clientX + 480 > window.innerWidth && ev.clientX - 480 < 0) {
								hoverInfoEl.style.left = window.innerWidth/2 - 460/2 + 'px';
								hoverInfoEl.style.right = 'auto';
							} else if (ev.clientX + 460 > window.innerWidth) {
								hoverInfoEl.style.right = window.innerWidth - (ev.clientX - 50) + 'px';
								hoverInfoEl.style.left = 'auto';
							} else {
								hoverInfoEl.style.right = 'auto';
								hoverInfoEl.style.left = ev.clientX + 50 + 'px';
							}
							if (ev.clientY + 200 > window.innerHeight) {
								hoverInfoEl.style.top = 'auto';
								hoverInfoEl.style.bottom = window.innerHeight - (ev.clientY - 30) + 'px';
							} else {
								hoverInfoEl.style.bottom = 'auto';
								hoverInfoEl.style.top = ev.clientY + 30 + 'px';
							}

							hoverInfoEl.style.backgroundColor = $scope.hoverInfoObject.objectData.backgroundColor;
						}
					} else if (obj && $scope.hoverInfoObject === obj) {
						self.objects.blobs.children.forEach(function(c) {
							c.selected = false;
							c.connectionSelected = false;
						});
						$scope.hoverInfoObject = null;
						$scope.$digest();
						if (obj.objectData) {
							self.active = false;
							$scope.$apply(function() {
								$location.path('/object/'+obj.objectData.bullet);
							});
						}
					} else {
						$scope.selectedGeography = null;
					}
				}
			}
		};

		window.onkeydown = function(ev) {
			if (!self.active) return;
			if ($scope.introState < 4) {
			} else if (self.introTime >= self.introLength + 16) {
				if (ev.keyCode === 38) {
					$scope.moveCameraUp();
				} else if (ev.keyCode === 40) {
					$scope.moveCameraDown();
				}
			}
		};

		window.onkeyup = function(ev) {
			if (!self.active) return;
			if (self.introTime >= self.introLength + 16) {
				if (ev.keyCode === 38 || ev.keyCode === 40) {
					$scope.stopCameraMotion();
				}
			}
		};

		window.onmousewheel = function(ev) {
			if (!self.active) return;
			if ($scope.introState < 4) {
				if (ev.wheelDelta < 0) {
					$scope.$digest();
				}
			} else if (self.introTime >= self.introLength + 16) {
				self.cameraZTarget = (
					self.cameraZTarget || self.camera.position.z
				) - ev.wheelDelta * 0.15;
			}
		};

		var tmpMat4 = new THREE.Matrix4();
		var tmpMat4B = new THREE.Matrix4();
		this.moveToScreenCoords = function( obj, camera, rect ) {
			var x = 2.0 * ((rect.left+10) / window.innerWidth) - 1;
			var y = -2.0 * ((rect.top+10) / window.innerHeight) + 1;

			var mouse3D = new THREE.Vector3( x, y, 0.5 );
			mouse3D.unproject( camera );
			mouse3D.sub( camera.position );
			mouse3D.normalize();

			var raycaster = new THREE.Raycaster( camera.position, mouse3D );
			var intersects = raycaster.intersectObjects( [self.linesPlane] );

			if (intersects.length > 0) {
				obj.position.copy(intersects[0].point);
			}
		};

		this.mouseX = -1;
		this.mouseY = -1;
		this.findObjectUnderEvent = function(ev) {
			if (!self.objects) {
				return;
			}
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
			var raycaster = new THREE.Raycaster( self.camera.position, mouse3D );
			var intersects = raycaster.intersectObjects( self.objects.blobs.children.filter(function(c) { return !c.disabled; }) );
			if ( intersects.length > 0 ) {
				var obj = intersects[ 0 ].object
				return obj;
			}
		};

		this.findToolbarUnderEvent = function(ev) {
			if (!self.toolBar3D) {
				return;
			}
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
			var raycaster = new THREE.Raycaster( self.camera.position, mouse3D );
			var intersects = raycaster.intersectObjects( self.toolBar3D.buttons );
			if ( intersects.length > 0 ) {
				var obj = intersects[ 0 ].object
				return obj;
			}
		};

	};

	this.objectIndex = {};
	this.blobIndex = {};
	this.toolbarTick = function() {
		if (
			($scope.selectedGeography && this.geographyName !== $scope.selectedGeography)
		) {
			if (this.originalColor === undefined) {
				this.originalColor = this.material.color.getHex();
			}
			this.material.color.setHex( 0x484946 );
		} else if (this.originalColor !== undefined) {
			this.material.color.setHex( this.originalColor );
		}

		if ($scope.hoveredGeography === this.geographyName) {
			this.position.y += ((+0.36/2) - this.position.y) * 0.1;
			this.scale.y += (1.36 - this.scale.y) * 0.1;
			this.label.scale.x += (1.2 - this.label.scale.x) * 0.1;
			var s = this.label.scale.x;
			this.label.scale.set(s,s,s);
			this.label.position.y = this.position.y - 10.5;
		} else {
			this.position.y += (0 - this.position.y) * 0.1;
			this.scale.y += (1 - this.scale.y) * 0.1;
			this.label.scale.x += (1 - this.label.scale.x) * 0.1;
			var s = this.label.scale.x;
			this.label.scale.set(s,s,s);
			this.label.position.y = this.position.y - 10.5;
		}
	};
	this.blobTick = function() {
		var blob = this;

		var largerZThanToolbar = (this.position.z > self.toolBar3D.position.z);

		if (this.largerZThanToolbar === null) {
			this.largerZThanToolbar = largerZThanToolbar;
		}

		if (this.largerZThanToolbar !== largerZThanToolbar) {
			this.largerZThanToolbar = largerZThanToolbar;
			if (self.audioManager && self.introTime > self.introLength && !this.disabled) {
				if (this.soundIndex === undefined) {
					this.soundIndex = -4*this.position.y;
				}
				self.audioManager.playSoundEffect(this.soundIndex);
			}
		}

		var idx = this.parent.children.indexOf(blob);
		var t = (Date.now() / (300*(1+idx%3)) + 4.8 * idx);

		if (
			($scope.selectedGeography && this.objectData.cultureName !== $scope.selectedGeography) ||
			($scope.category && this.objectData.categoryName !== $scope.category)
		) {
			if (this.originalColor === undefined) {
				this.originalColor = this.material.color.getHex();
			}
			if (!this.disabled) {
				this.material.colorChangeDelay = Math.max(0, -Math.floor((this.position.z - self.camera.position.z)/10 + 3 * Math.random()));
				this.material.color.setHex( 0x7B7E6D );
				this.disabled = true;
			}
		} else if (this.originalColor !== undefined) {
			if (this.disabled) {
				this.material.colorChangeDelay = Math.max(0, -Math.floor((this.position.z - self.camera.position.z)/10 + 3 * Math.random()));
				this.material.color.setHex( this.originalColor );
				this.disabled = false;
			}
		}

		blob.relativePos.x = 0;
		blob.relativePos.y = this.originalPosition.y - this.position.y;
		blob.relativePos.z = 0;

		blob.targetPos.addVectors(this.position, blob.relativePos);

		var posDeltaSpeed = 0.0001;

		if (self.introTime < self.introLength) {
			if (self.camera.position.z > blob.position.z) {
				blob.targetPos.copy(blob.originalPosition);
			} else {
				blob.targetPos.copy(blob.originalPosition);
				blob.targetPos.y += 40;
			}
			blob.velocity.multiplyScalar(0.7);
			posDeltaSpeed = 0.002;
		}

		blob.posDelta.subVectors(blob.targetPos, blob.position);

		var d = blob.posDelta.length();
		blob.posDelta.multiplyScalar(d * posDeltaSpeed);
		blob.velocity.add(blob.posDelta);

		blob.floatVec.set(Math.sin(1.3*t), Math.cos(t* ((idx % 2) - 0.5)*2), Math.sin(0.7*t));
		blob.floatVec.multiplyScalar(0.0001);
		blob.velocity.add(blob.floatVec);

		if (blob.material.colorChangeDelay === 0) {
			var s;
			if (blob.selected) {
				blob.velocity.multiplyScalar(0);
				s = blob.scale.x + (3*(1.25 * 0.75) - blob.scale.x) * 0.1;
			} else if (blob.connectionSelected) {
				s = blob.scale.x + (3*(1.0 * 0.75) - blob.scale.x) * 0.1;
			} else if (blob.disabled) {
				s = blob.scale.x + (3*(0.5 * 0.5) - blob.scale.x) * 0.1;
			} else if (blob.hovered) {
				s = blob.scale.x + (3*(1.15 * 0.75) - blob.scale.x) * 0.1;
			} else {
				s = blob.scale.x + (3*(0.75 * 0.75) - blob.scale.x) * 0.1;
			}
			blob.scale.set(s,s,s);
		}
		blob.velocity.z = 0;

		blob.position.add(blob.velocity);
		blob.velocity.multiplyScalar(0.95);

		if (this.selected) {
			if (!this.sticksContainer.parent) {
				self.objects.sticks.add(this.sticksContainer);
				this.sticksContainer.visible = true;
			}
		} else if (this.sticksContainer.parent) {
			this.sticksContainer.parent.remove(this.sticksContainer);
			this.sticksContainer.visible = false;
		}

		if (blob.material.colorChangeDelay === 0) {
			var c0 = blob.material.uniforms.color.value;
			var c1 = blob.material.color;
			blob.material.uniforms.color.value.set(
				c0.x + (c1.r - c0.x) * blob.material.colorChangeSpeed,
				c0.y + (c1.g - c0.y) * blob.material.colorChangeSpeed,
				c0.z + (c1.b - c0.z) * blob.material.colorChangeSpeed
			);
		} else {
			blob.material.colorChangeDelay--;
		}

	};
	this.stickTick = function() {
		this.position.set(
			(this.start.position.x + this.end.position.x) * 0.5,
			(this.start.position.y + this.end.position.y) * 0.5,
			(this.start.position.z + this.end.position.z) * 0.5
		);
		this.lookAt(this.start.position);
		var distance = this.start.position.distanceTo(this.end.position);
		if (distance === 0) {
			// console.log('something is broken in sticks')
		}
		this.stick.scale.set(0.1, 0.1, distance);

		var c1 = this.start.material.uniforms.color.value;
		this.stick.startColor.r = c1.x;
		this.stick.startColor.g = c1.y;
		this.stick.startColor.b = c1.z;

		var c2 = this.end.material.uniforms.color.value;
		this.stick.endColor.r = c2.x;
		this.stick.endColor.g = c2.y;
		this.stick.endColor.b = c2.z;

		this.stick.geometry.colorsNeedUpdate = true;
	};
	this.stickGeometry = new THREE.BoxGeometry(1,1,1);
	this.addBlobConnection = function(connection) {
		if (connection.objectData && this.objectData.bullet === connection.objectData.bullet) {
			// console.log("You're doing it wrong");
		}
		var stick = new THREE.Mesh(
			new THREE.BoxGeometry(1,1,1),
			new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
		);
		stick.frustumCulled = false;
		var stickContainer = new THREE.Object3D();
		stickContainer.tick = self.stickTick;
		stickContainer.stick = stick;
		stickContainer.start = this;
		stickContainer.end = connection;
		if (this.connections.length > 6) {
			var nearest = this.connections[1];
			var minLen = 1/0;
			for (var i=1; i<this.connections.length; i++) {
				var obj = this.connections[i];
				var len = obj.position.distanceTo(connection.position);
				if (minLen > len && obj.objectData.bullet !== connection.objectData.bullet) {
					minLen = len;
					nearest = obj;
				}
			}
			stickContainer.start = nearest;
		}
		this.connections.push(connection);
		var color1 = stickContainer.end.material.color.clone();
		var color2 = stickContainer.start.material.color.clone();
		stick.endColor = color1;
		stick.startColor = color2;
		var faceIndices = [ 'a', 'b', 'c' ];
		for ( var i = 0; i < stick.geometry.faces.length; i ++ ) {
			var f  = stick.geometry.faces[ i ];
			for( var j = 0; j < 3; j++ ) {
				var vertexIndex = f[ faceIndices[ j ] ];
				var p = stick.geometry.vertices[ vertexIndex ];
				f.vertexColors[ j ] = p.z < 0.0 ? color1 : color2;
			}
		}
		stick.geometry.colorsNeedUpdate = true;

		stickContainer.add(stick);

		this.sticks.push(stickContainer);
		this.sticksContainer.add(stickContainer);
	};
	this.createObjects = function(objectArray) {

		var blobs = new THREE.Object3D();
		blobs.frustumCulled = false;

		var sticks = new THREE.Object3D();
		sticks.frustumCulled = false;

		this.objects = {
			blobs: blobs,
			sticks: sticks
		};

		var geographies = this.geographies;
		var geoLane = this.geoLane;
		var colors = this.colors;

		var blobLayoutGrid = {};
		var fitBlob = function(v) {
			var vx = Math.floor(v.x/2);
			var vy = Math.floor(v.y/2);
			var vz = Math.floor(v.z/2);
			var k = [vx, vy, vz].join(":");
			if (!blobLayoutGrid[k]) {
				for (var x = -1; x <= 1; x++) {
					for (var y = -1; y <= 1; y++) {
						for (var z = -1; z <= 1; z++) {
							k = [vx+x, vy+y, vz+z].join(":");
							blobLayoutGrid[k] = true;
						}
					}
				}

				return true;
			}
			return false;
		};
		var blobShift = function(v) {
			var i = 0;
			while (!fitBlob(v)) {
				if (i === 0) { v.x += 2; }
				else if (i === 1) { v.x += -4; }
				else if (i === 2) { v.x += 2; v.y += 2; }
				else if (i === 3) { v.x += 0; v.y += -4; }
				else if (i === 4) { v.x += 2; v.y += 0; }
				else if (i === 5) { v.x += -4; v.y += 0; }
				else if (i === 6) { v.x += 0; v.y += 4; }
				else if (i === 7) { v.x += 4; v.y += 0; }
				else if (i === 8) { v.z += 4; break; }
				i++;
			}
		};

		var clamp = function(x) {
			return x > 1 ? 1 : (x < 0 ? 0 : x);
		};

		var shaderMaterial = this.canvasShaderMaterial;

		objectArray = objectArray.filter(function(obj) {
			return geoLane[obj.cultureName] !== undefined;
		});

		for (var i=0; i<objectArray.length; i++) {
			var obj = objectArray[i];
			var lane = geoLane[obj.cultureName];

			var color = new THREE.Color( colors[lane] || 0x0 );
			obj.backgroundColor = color.getStyle();

			color.r = clamp(color.r * (1+(Math.random() - 0.5) * 0.2));
			color.g = clamp(color.g * (1+(Math.random() - 0.5) * 0.2));
			color.b = clamp(color.b * (1+(Math.random() - 0.5) * 0.2));

			var mat = shaderMaterial.clone();
			mat.color = color;
			mat.colorChangeSpeed = 0.25;
			mat.colorChangeDelay = Math.ceil(Math.random()*30);
			mat.uniforms = {
				map: {type: 't', value: this.blobTextures[i % this.blobTextures.length]},
				color: {type: 'v3', value: new THREE.Vector3(color.r, color.g, color.b)}
			};
			var blob = new THREE.Mesh(this.itemGeometry, mat)

			blob.rotation.z = Math.random()*Math.PI*2;

			blob.laneIndex = lane;

			blob.objectData = obj;
			this.blobIndex[obj.bullet] = blob;

			blob.connections = [];
			blob.frustumCulled = false;
			blob.sticksContainer = new THREE.Object3D();
			blob.sticksContainer.visible = false;
			blob.sticksContainer.frustumCulled = false;
			blob.sticksContainer.tick = this.scene.tick;
			blob.frustumCulled = false;
			blob.position.set(
				6*(6/5) * (lane-(geographies.length-1)/2)+4*(objectXorgen()-0.5),
				-10+objectXorgen()*5,
				this.mapYearToLandscapeZ(obj.dateCreated, true)
			);

			blobShift(blob.position);
			blob.originalPosition = blob.position.clone();

			blob.scale.multiplyScalar(1.5);
			blob.relativePos = new THREE.Vector3();
			blob.targetPos = new THREE.Vector3();
			blob.velocity = new THREE.Vector3();
			blob.floatVec = new THREE.Vector3();
			blob.posDelta = new THREE.Vector3();
			blob.tick = this.blobTick;

			blob.sticks = [];

			blob.addConnection = this.addBlobConnection;

			blob.hoverConnectionTarget = blob.clone();
			blob.hoverConnectionTarget.scale.set(0.01, 0.01, 0.01);
			blob.addConnection(blob.hoverConnectionTarget);

			blobs.add(blob);
		}

		return {blobs: blobs, sticks: sticks};
	};




	this.yearZeroOffsets = [
		0, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50
	];
	this.yearZeroOffsetIndex = 0;
	this.mapYearToLandscapeZ = function(year, offset) {
		year = year || 0;
		if (year === 0 && offset) {
			year += this.yearZeroOffsets[this.yearZeroOffsetIndex];
			this.yearZeroOffsetIndex = (this.yearZeroOffsetIndex + 1) % this.yearZeroOffsets.length;
		}
		var z = 0;
		for (var i=0; i<this.yearIntervals.length; i++) {
			var iv = this.yearIntervals[i];
			if (year > iv.start) {
				break;
			}
			var d = Math.min(iv.start - iv.end, iv.start - year);
			z += d * iv.yearLength;
		}
		return 1900*0.2 + 100*0.3 + 50*0.4 + 50*0.8 - z;
	};

	this.initToolbar = function() {
		this.toolBar3D = new THREE.Object3D();
		this.toolBar3D.buttons = [];
		this.toolBar3D.tick = this.scene.tick;

		this.labels = new THREE.Object3D();
		this.labels.position.copy( this.toolBar3D.position );

		var textGeo = new THREE.PlaneBufferGeometry(256/45, 32/45);

		for (var i=0; i<this.geographies.length; i++) {
			var obj = new THREE.Object3D();
			var bg = new THREE.Mesh(
				new THREE.PlaneBufferGeometry((6/5)*6, 1),
				new THREE.MeshBasicMaterial({color: this.colors[i]})
			);
			obj.position.set((6/5)*6*(i-(this.geographies.length-1)/2),  -10.5,  0 );
			bg.geographyName = this.geographies[i];
			bg.tick = this.toolbarTick;
			obj.add(bg);

			obj.tick = function() {
				this.children[0].tick();
			};

			this.toolBar3D.buttons.push(bg);

			var textCanvas = document.createElement('canvas');
			textCanvas.width = 256;
			textCanvas.height = 32;

			var tex = new THREE.Texture(textCanvas);
			tex.minFilter = THREE.LinearFilter;

			setTimeout((function(textCanvas, tex, title) {
				return function() {
					var ctx = textCanvas.getContext('2d');
					ctx.fillStyle = '#000000';
					ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);

					ctx.font = 'lighter 30px Lato, sans-serif';
					ctx.fillStyle = '#FFFFFF';
					var w = ctx.measureText(title).width;
					ctx.fillText(title, (ctx.canvas.width-w)/2, 28);
					tex.needsUpdate = true;
				};
			})(textCanvas, tex, this.geographies[i]), 5000);

			var mat = new THREE.MeshBasicMaterial( { map: tex, side: THREE.DoubleSide, blending: THREE.AdditiveBlending } );
			mat.transparent = true;
			mat.depthWrite = false;
			mat.depthTest = false;

			var text = new THREE.Mesh( textGeo, mat );
			text.position.copy(obj.position);
			bg.label = text;
			this.labels.add(text);
			text.position.z = 0.01;

			this.toolBar3D.add(obj);
		}
		this.toolBar3D.visible = false;
		this.labels.visible = false;
		this.scene.add(this.toolBar3D);
		this.labelScene.add(this.labels);
	};



	// Sound system

	this.initSounds = function() {
		var audioContext;
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			audioContext = new window.AudioContext();
		} catch (e) {
			// console.log("initSounds: No Web Audio API support");
			this.loadingPercentageMax += 10;
			return;
		}
		var __self = this;
		this.audioManager = {
			context: audioContext,
			mainVolume: audioContext.createGain(),
			masterVolume: audioContext.createGain(),

			backgroundURL: '/img/sounds/background.mp3',
			explosionURL: '/img/sounds/explosion.mp3',
			soundEffectURLs: [
				'/img/sounds/01.mp3',
				'/img/sounds/02.mp3',
				'/img/sounds/03.mp3',
				'/img/sounds/04.mp3',
				'/img/sounds/05.mp3',
				'/img/sounds/06.mp3',
				'/img/sounds/07.mp3',
				'/img/sounds/08.mp3',
				'/img/sounds/09.mp3'
			],

			loadSound: function(soundFileName, onload, onerror) {
				var ctx = this.context;
				var mainVolume = this.mainVolume;
				var self = this;

				// Create an object with a sound source and a volume control.
				var sound = {};
				sound.source = ctx.createBufferSource();
				sound.volume = ctx.createGain();

				// Connect the sound source to the volume control.
				sound.source.connect(sound.volume);
				// Hook up the sound volume control to the main volume.
				sound.volume.connect(mainVolume);

				var request = new XMLHttpRequest();
				request.open("GET", soundFileName, true);
				request.responseType = "arraybuffer";
				request.onload = function(e) {

					// Create a buffer from the response ArrayBuffer.
					ctx.decodeAudioData(this.response, function onSuccess(buffer) {
						sound.buffer = buffer;

						// Make the sound source use the buffer.
						sound.source.buffer = sound.buffer;

						onload.call(self, sound);
					}, function onFailure() {
						onerror.call(self, sound);
						console.log("Decoding the audio buffer failed");
					});
				};
				request.onerror = function() {
					onerror.call(self, sound);
				}
				request.send();
			},

			soundEffects: [],
			soundsPlaying: 0,
			playSoundEffect: function(index) {
				if (!this.started || this.soundsPlaying > 5) {
					return;
				}
				index = Math.floor(index) % this.soundEffects.length;
				if (index < 0) {
					index += this.soundEffects.length;
				}
				var sound = this.soundEffects[index];
				if (sound) {
					var node = this.context.createBufferSource();
					var gain = this.context.createGain();
					gain.gain.value = Math.random()*0.1+0.1;
					node.buffer = sound.buffer;
					node.connect(gain);
					gain.connect(sound.volume);
					node.start(this.context.currentTime);
					var self = this;
					this.soundsPlaying++;
					setTimeout(function() {
						self.soundsPlaying--;
					}, 500);
				}
			},

			playRandomSoundEffect: function() {
				this.playSoundEffect(this.soundEffects.length * Math.random());
			},

			getMuted: function() {
				return this.mainVolume.gain.value === 0;
			},

			setMuted: function(muted) {
				this.mainVolume.gain.value = muted ? 0 : 1;
				localStorage.audioMuted = !!muted;
			},

			toggleMuted: function() {
				this.setMuted( !this.getMuted() );
			},

			start: function() {
				if (!this.started) {
					this.started = true;
					this.masterVolume.connect(this.context.destination);
					this.mainVolume.connect(this.masterVolume);
					if (this.explosionSound) {
						this.explosionSound.source.start(this.context.currentTime);
					}
					if (this.backgroundSound) {
						this.backgroundSound.source.start(this.context.currentTime);
						this.backgroundSound.volume.gain.setValueAtTime(1, this.context.currentTime + (__self.introLength-3000)/1000);
						this.backgroundSound.volume.gain.linearRampToValueAtTime(0, this.context.currentTime + (__self.introLength+3000)/1000);
					}
				}
			}
		};

		this.audioManager.loadSound(this.audioManager.backgroundURL, function(sound) {
			this.backgroundSound = sound;
		});

		this.audioManager.loadSound(this.audioManager.explosionURL, function(sound) {
			this.explosionSound = sound;
			__self.loadingPercentageMax += 10;
		}, function() {
			__self.loadingPercentageMax += 10;
		});

		for (var i=0; i<this.audioManager.soundEffectURLs.length; i++) {
			var url = this.audioManager.soundEffectURLs[i];
			this.audioManager.loadSound(url, function(sound) {
				this.soundEffects.push(sound);
			});
		}

		this.audioManager.setMuted(localStorage.audioMuted === 'true');
	};




	this.makeBlob = function(color, idx) {
		var mat = self.canvasShaderMaterial.clone();
		mat.uniforms = {
			map: {type: 't', value: self.blobTextures[idx]},
			color: {type: 'v3', value: new THREE.Vector3(color.r, color.g, color.b)}
		};
		var blob = new THREE.Mesh(
			self.itemGeometry, mat
		);
		blob.texId = idx;
		return blob;
	};



	// INTRO ANIMATION

	this.initIntro = function() {

		var introColors = [0xFCEE21, 0x009245, 0xF7931E, 0x006837, 0xFBB03B, 0xFFFFFF, 0x0071BC, 0xD9E021, 0x22B573, 0x8CC63F, 0x00A99D, 0x29ABE2];
		introColors = introColors.map(function(c) { return new THREE.Color(c); });


		var intersect = function(c, cs) {
			var x0a = c.start.position.x;
			var y0a = c.start.position.y;
			var x1a = c.end.position.x;
			var y1a = c.end.position.y;

			var k_a = (y1a - y0a) / (x1a - x0a);
			var b_a = y0a - k_a * x0a;

			for (var i=0; i<cs.length; i++) {
				var d = cs[i];

				if (c.end.position === d.start.position || c.end.position === d.end.position ||
					(c.start.position === d.start.position && c.end.position === d.end.position)
				) {
					//return true;
				}

				var x0b = d.start.position.x;
				var y0b = d.start.position.y;
				var x1b = d.end.position.x;
				var y1b = d.end.position.y;

				var k_b = (y1b - y0b) / (x1b - x0b);
				var b_b = y0b - k_b * x0b;

				if (k_a === k_b) {
					continue;
				}

				if (c.start.position === d.start.position && tmpV.subVectors(d.end, d.start).dot(tmpV2.subVectors(c.end, c.start)) > 0.8) {
					return true;
				}

				// k_a * x + b_a = k_b * x + b_b
				// x * (k_a - k_b) + b_a - b_b = 0
				var x = (b_b - b_a) / (k_a - k_b);

				if (
					x > Math.min(x0a, x1a) && x > Math.min(x0b, x1b) &&
					x < Math.max(x0a, x1a) && x < Math.max(x0b, x1b)
				) {
					return true;
				}

			}
			return false;
		};

		this.introBlobs = new THREE.Object3D();
		this.introBlobs.frustumCulled = false;
		this.scene.add(this.introBlobs);

		this.loaderBlobs = new THREE.Object3D();
		this.loaderBlobs.frustumCulled = false;
		this.introBlobs.add(this.loaderBlobs);

		for (var i=0; i<10; i++) {
			var color = introColors[i % introColors.length];
			var blob = this.makeBlob(color, i % this.blobTextures.length);
			blob.velocity = new THREE.Vector3();
			blob.scaleSpeed = 0;
			blob.targetScale = 0.001;
			blob.normalScale = 5 * (0.2 + loaderXorgen()*0.35);
			blob.visible = false;
			this.loaderBlobs.add(blob);
			blob.frustumCulled = false;
			blob.scale.multiplyScalar(blob.targetScale);
			blob.position.set(loaderXorgen()-0.5, loaderXorgen()-0.5, loaderXorgen()*0.1+0.1).multiplyScalar(10);
		}


		var tmpV2 = new THREE.Vector3();
		this.loaderBlobs.tick = function() {
			var t = Date.now();
			for (var i=0; i<this.children.length; i++) {
				var a = this.children[i];
				if (i * 9 < $scope.loadingPercentage-10) {
					a.targetScale = a.normalScale;
					a.visible = true;
				}
				a.violence = true;
				if (self.introTime > 350) {
					a.targetScale = shrinkPositions[i].scale * (1.5 + 0.5 * Math.sin(i*1.3+Math.pow(self.introTime/350, 2)));
					if (self.introTime > 2750 && self.introTime < 3000) {
						a.targetScale *= 1.8;
					}
				} else {
					a.targetScale = shrinkPositions[i].scale * 2.0;
					a.position.z = 0.1 + i*0.1;
				}
				// if (!a.exit) {
					a.velocity.x += (self.introTime+200)*0.0001 * (loaderXorgen() - 0.5) * 0.5;
					a.velocity.y += (self.introTime+200)*0.0001 * (loaderXorgen() - 0.5) * 0.5;
					a.velocity.z = 0;
				// }
				if (!a.visible) continue;
				var sx = a.scale.x;
				a.scaleSpeed += (a.targetScale - sx) * (a.violence ? 0.05 : 0.01);
				sx += a.scaleSpeed;
				a.scaleSpeed *= (a.violence ? 0.5 : 0.9);
				a.scale.set(sx, sx, sx);
				if (self.introTime < 350 && false) {
					a.velocity.add(tmpV2.copy(a.position).multiplyScalar(a.violence ? -0.05 : -0.005));
				} else if (self.introTime > 3000) {
					if (!a.exit) {
						a.exit = true;
						a.velocity.set(loaderXorgen()-0.5, loaderXorgen()-0.5, 0);
						a.velocity.normalize().multiplyScalar(10);
					}
				} else {
					tmpV.copy(shrinkPositions[i].position).multiplyScalar(self.introTime > 350 ? 1 : 1.8);
					a.velocity.add(tmpV2.subVectors(a.position, tmpV).multiplyScalar(self.introTime > 350 ? -0.25 : -0.005));
					a.velocity.multiplyScalar(0.9);
				}
			}

			for (var i=0; i<this.children.length; i++) {
				var a = this.children[i];
				if (!a.visible) continue;
				if (false && loaderXorgen() < 0.02 && self.introTime < 350) {
					a.velocity.x += (loaderXorgen() - 0.5);
					a.velocity.y += 0.5*(loaderXorgen() - 0.5);
				}
				a.position.add(a.velocity);
				a.position.z = i/100;

				if (a.exit) continue;

				a.velocity.multiplyScalar(0.95);
			}
		};

		var gridKey = function(x,y) {
			return Math.floor(x*5) + ':' + Math.floor(y*5);
		};

		var v = new THREE.Vector3();
		var ratio = (window.innerWidth/window.innerHeight);
		var positionGrid = {};
		var positions = [];
		var fast = !(/Android|mobile|Trident|Edge/i).test(navigator.userAgent);
		var blobCount = fast ? 12000 : 1000;
		var blobSeparation = (blobCount < 8000 ? 1.9 : 0.8)*ratio;
		for (var j=0; j<blobCount; j++) {
			var position = new THREE.Vector3();
			var scale = 1*(xorgen()*0.75 + 0.2);
			var a = xorgen()*Math.PI*2;
			if (ratio > 1) {
				v.set(Math.cos(a), Math.sin(a) / ratio, 0);
			} else {
				v.set(Math.cos(a) * ratio, Math.sin(a), 0);
			}

			var minDist = 0;
			var len = blobSeparation * Math.sqrt(j / Math.PI);
			position.copy(v);
			position.multiplyScalar(len);
			while (positionGrid[gridKey(position.x, position.y)]) {
				position.copy(v);
				len += scale;
				position.multiplyScalar( len );
			}
			positionGrid[gridKey(position.x, position.y)] = true;
			positions.push({ position: position, scale: scale, color: introColors[j % introColors.length] });
		}

		// console.timeEnd('intro blob generation');

		var shrinkPositions = [];
		for (var j=0; j<10; j++) {
			var position = new THREE.Vector3();
			var scale = 3.5*(loaderXorgen()*0.15 + 0.1);
			var a = 2*j/9.1213*Math.PI*2;
			v.set(Math.cos(a), Math.sin(a), 0);
			var minDist = 0;
			var len = 0;
			position.copy(v);
			position.multiplyScalar(len);
			while (minDist == 0.0) {
				minDist = 10000.0;
				for (var i=0; i<shrinkPositions.length; i++) {
					var p = shrinkPositions[i];
					var dist = position.distanceTo(p.position);
					dist -= 0.5*scale;
					dist -= 0.5*p.scale;
					if (dist < minDist) {
						minDist = dist;
					}
					while (dist < 0.1) {
						position.copy(v);
						len += 0.1;
						position.multiplyScalar( len );
						var dist = position.distanceTo(p.position);
						dist -= 0.5*scale;
						dist -= 0.5*p.scale;
					}
				}
			}
			shrinkPositions.push({ position: position, scale: scale, color: introColors[j % introColors.length] });
			this.loaderBlobs.children[j].position.copy(position).normalize().multiplyScalar(2.5);
		}

		var growTree = function(start, positions, angle, connections, depth) {
			var previousConnection = null;
			var closePositions = positions.filter(function(p) {
				var len = p.position.distanceTo(start.position);
				return len > 1 && len < 10;
			});
			for (var i=0; i<5; i++) {
				var a = angle + i/5 * Math.PI * 2;
				var angleVec = new THREE.Vector3(Math.cos(a), Math.sin(a), 0).normalize();
				var connection = {};
				connection.start = start;
				var tries = 0;
				var len, dot;
				// debugger;
				var match = null;
				for (var j=0; j<closePositions.length; j++) {
					var p = closePositions[j];
					connection.end = p;
					tmpV2.subVectors(connection.end.position, connection.start.position).normalize();
					dot = tmpV2.dot(angleVec);
					if (dot < 0.5 && !intersect(connection, connections)) {
						match = p;
						break;
					}
				}
				if (match) {
					connection.end = match;
					connections.push(connection);
					if (previousConnection ) {
						var cline = {start: previousConnection.end, end: connection.end};
						if (!intersect(cline, connections)) {
							connections.push(cline);
						}
					}
					if (depth < 2) {
						growTree(connection.end, positions, angle, connections, depth+1);
					}
					previousConnection = connection;
				}
			}
			return connections;
		};


		// console.time('connection generation');

		var introBlobConnections = new THREE.Object3D();
		introBlobConnections.position.z = 0.1;
		var connections = [];
		var tmpV = new THREE.Vector3();
		var angleVec = new THREE.Vector3();
		var angle = 0;
		var angleDist = function(x, y) {
			return Math.atan2(Math.sin(x-y), Math.cos(x-y))
		};
		var connectionPathCount = fast ? 15 : 5;
		for (var i=0; i<connectionPathCount; i++) {
			var idx = i+(15*(Math.pow(Math.random(), 2-i/15)*positions.length/15) | 0);
			idx %= positions.length;
			var start = positions[idx];
			start.finishedGrowing = true;
			growTree(start, positions.filter(function(p){
				var a = Math.atan2(p.position.y, p.position.x);
				return p.color === start.color && Math.abs(angleDist(a, angle)) < Math.PI*2/3;
			}), angle, connections, 0);
			angle += Math.PI * (2 / 3 + (xorgen()-0.5) );
		}

		for (var i=0; i<connections.length; i++) {
			var geo = new THREE.Geometry();
			geo.vertices.push(new THREE.Vector3(0,0,0));
			geo.vertices.push(new THREE.Vector3().subVectors(connections[i].end.position, connections[i].start.position));
			var color = new THREE.Color(connections[i].end.color);
			color.r = Math.min(1, color.r + 0.2);
			color.g = Math.min(1, color.g + 0.2);
			color.b = Math.min(1, color.b + 0.2);
			var line = new THREE.Line(geo, new THREE.LineBasicMaterial({linewidth: 1, color: color}));
			line.position.copy(connections[i].start.position);
			line.scale.set(0.001, 0.001, 0.001);
			line.targetScale = 0.001;
			line.visible = false;
			line.delay = 10 + i/10 + Math.pow(xorgen(), 2) * 250;
			introBlobConnections.add(line);
		}

		// console.timeEnd('connection generation');

		introBlobConnections.tick = function() {
			for (var i=0; i<this.children.length; i++) {
				var c = this.children[i];
				if (connections[i].start.visible && connections[i].end.visible && connections[i].start.finishedGrowing) {
					c.targetScale = 1;
					c.visible = true;
				} else {
					c.targetScale = 0.001;
				}
				if (c.delay > 0) {
					c.delay--;
					continue;
				}
				var sx = c.scale.x;
				sx += (c.targetScale - sx) * 0.2;
				c.scale.set(sx, sx, sx);
				connections[i].end.finishedGrowing = true;
				if (sx > 0.95) {
				} else if (sx < 0.01) {
					c.visible = false;
				}
			}
		};

		this.introBlobs.add(introBlobConnections);

		var particleShader =  {
			attributes: {
				position: {type: 'v3', value: []},
				scale: {type: 'f', value: []},
				color: {type: 'v3', value: []},
				// textureID: {type: 'f', value: []},
				uv: {type: 'v2', value: []}
			},
			uniforms: {},
			vertexShader: [
				// 'attribute float textureID;',
				'attribute float scale;',

				'varying vec3 vColor;',
				// 'varying float vTexID;',
				'varying vec2 vUv;',

				'void main() {',
				'	vColor = color;',
				// '	vTexID = textureID;',
				'	vUv = uv;',
				'	vec3 relativeVertexPosition = vec3(2.0 * uv - 1.0, 0.0);',
				'	vec3 v = position + 0.5 * scale * relativeVertexPosition;',
				'	gl_Position = projectionMatrix * modelViewMatrix * vec4( v, 1.0 );',
				'}'
			].join('\n'),
			fragmentShader: [
				'varying vec3 vColor;',
				'varying float vTexID;',
				'varying vec2 vUv;',

				'uniform sampler2D t;',

				'void main() {',
				'	gl_FragColor = vec4(vColor, texture2D(t, vUv).a);',
				'}'
			].join('\n'),

			vertexColors: THREE.FaceColors,
			side: THREE.DoubleSide,
			opacity: 1,
			transparent: true,
			depthWrite: false
		};

		this.introBlobs.createBlobs = function() {
			var blobs = new THREE.Object3D();
			var particleGeo = new THREE.BufferGeometry();
			this.particlePositions = new Float32Array(6 * 3 * positions.length);
			this.particleScales = new Float32Array(6 * 1 * positions.length);
			this.particleColors = new Float32Array(6 * 3 * positions.length);
			// this.particleTextureIDs = new Float32Array(6 * 1 * positions.length);
			this.particleUVs = new Float32Array(6 * 2 * positions.length);
			particleGeo.addAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
			particleGeo.addAttribute('scale', new THREE.BufferAttribute(this.particleScales, 1));
			particleGeo.addAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));
			// particleGeo.addAttribute('textureID', new THREE.BufferAttribute(this.particleTextureIDs, 1));
			particleGeo.addAttribute('uv', new THREE.BufferAttribute(this.particleUVs, 2));

			var particleMaterial = new THREE.ShaderMaterial(particleShader);
			particleMaterial.uniforms['t'] = { type: 't', value: self.blobTextures[0] };
			// for (var i=0; i<self.blobTextures.length; i++) {
			// 	particleMaterial.uniforms['t'+i] = { type: 't', value: self.blobTextures[i] };
			// }

			this.particles = new THREE.Mesh(
				particleGeo, particleMaterial
			);
			this.particles.frustumCulled = false;

			blobs.add(this.particles);
			blobs.blobControllers = [];

			for (var i=0, l=positions.length; i<l; i++) {
				var p = positions[i];
				p.visible = true;
				var blob = self.makeBlob(p.color, 0 | (xorgen() * self.blobTextures.length));
				blob.velocity = new THREE.Vector3();
				var s = p.scale;
				blob.targetScale = s;
				blob.frustumCulled = false;
				blob.scale.set(0.001, 0.001, 0.001);
				blob.position.copy(p.position).multiplyScalar(0.0);
				blob.position.z = -150*Math.random()-Math.sqrt(i/10);
				blob.floatVec = new THREE.Vector3();
				blob.positionObj = p.position;
				blobs.blobControllers.push(blob);
			}
			this.blobs = blobs;
		};
		this.introBlobs.createBlobs();

		this.introBlobs.tick = function() {
			if ($scope.introState >= 1) {
				self.loaderBlobs.tick();
			}
			if (self.introTime < 3000) return;
			if (self.introTime > self.introLength) {
				this.parent.remove(this);
			}
			if (self.introTime > 5000) {
				introBlobConnections.tick();
			}
			this.blobs.position.z += 0.03 * Math.sqrt((self.introTime-3000) / 8000);
			introBlobConnections.position.z += 0.03 * Math.sqrt((self.introTime-3000) / 8000);
			for (var i=0; i<this.blobs.blobControllers.length; i++) {
				if (!this.blobs.parent) {
					this.add(this.blobs);
				}
				var c = this.blobs.blobControllers[i];
				if (c.visible) {
					var t = Date.now()/150 + i;
					c.floatVec.set(Math.sin(1.3*t), Math.cos(t* ((i % 2) - 0.5)*2), 0);
					c.floatVec.multiplyScalar(c.bounce ? 0.35 : 0);
					c.velocity.add(c.floatVec);

					if (c.countDown) {
						c.velocity.y -= 0.1;
					} else {
						if (c.velocity.z === 0) {
							tmpV.subVectors(c.positionObj, c.position).multiplyScalar(0.125);
							c.velocity.add(tmpV);
						}
						var sx = c.scale.x;
						sx += (c.targetScale - sx) * 0.25;
						c.scale.set(sx, sx, sx);
						c.velocity.multiplyScalar(0.99);
						if (c.position.z > 0 || c.bounce) {
							c.bounce = true;
							c.velocity.multiplyScalar(0.1);
							tmpV.subVectors(c.positionObj, c.position).multiplyScalar(0.9);
							c.velocity.add(tmpV);
						}
					}
					c.position.add(c.velocity);
				} else if (i === this.blobs.blobControllers.length-1) {
					this.parent.remove(this);
				}
			}

			for (var i = 0; i<this.blobs.blobControllers.length; i++) {
				if (i < Math.pow(Math.max(0, self.introTime-11200), 1.6)) {
					if (positions[i].visible) {
						this.blobs.blobControllers[i].velocity.set((Math.random()-0.5)*8.0, Math.random(), -(6*(0.5-Math.random())));
						this.blobs.blobControllers[i].countDown = 200;
						positions[i].visible = false;
					}
				} else {
					break;
				}
			}

			var pos = this.particlePositions;
			var sca = this.particleScales;
			var col = this.particleColors;
			// var tex = this.particleTextureIDs;
			var uv = this.particleUVs;
			var off,soff,coff,toff,uoff;
			off = soff = coff = toff = uoff = 0;

			if (!this.geometryInitialized) {
				this.geometryInitialized = true;
				for (var i=0; i<this.blobs.blobControllers.length; i++) {
					var b = this.blobs.blobControllers[i];
					for (var j=0; j<6; j++) {
						col[coff++] = b.material.uniforms.color.value.x;
						col[coff++] = b.material.uniforms.color.value.y;
						col[coff++] = b.material.uniforms.color.value.z;
						// tex[toff++] = b.texId;
						uv[uoff++] = j % 2;
						uv[uoff++] = (j < 2 || j === 5) ? 0 : 1;
					}
				}
				var geo = this.particles.geometry;
				geo.attributes.color.needsUpdate = true;
				// geo.attributes.textureID.needsUpdate = true;
				geo.attributes.uv.needsUpdate = true;
			}

			for (var i=0; i<this.blobs.blobControllers.length; i++) {
				var b = this.blobs.blobControllers[i];
				for (var j=0; j<6; j++) {
					pos[off++] = b.position.x;
					pos[off++] = b.position.y;
					pos[off++] = b.position.z;
					sca[soff++] = b.scale.x;
				}
			}
			var geo = this.particles.geometry;
			geo.attributes.position.needsUpdate = true;
			geo.attributes.scale.needsUpdate = true;
		};
	};




	this.init();

});
