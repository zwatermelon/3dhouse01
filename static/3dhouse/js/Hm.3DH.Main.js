var texturePath = "static/3dhouse/textures/cixiu.jpg"; //ʮ������ͼ·�� ,���߷���������Ҫ���ⲿ����

if(!Detector.webgl){
	Detector.addGetWebGLMessage();
}				
//MAIN
// standard global variables
var container,stats;
var camera,scene,renderer,objects;

var projector,raycaster; //Ͷ������������
//var mouse = new THREE.Vector2(), INTERSECTED; //������������꣬��ײ����
var mouse = new THREE.Vector2(), INTERSECTED ,SELECTED , plane,controls; //������������꣬��ײ����
var offset = new THREE.Vector3();
var keyboard = new THREEx.KeyboardState();  
var clock = new THREE.Clock();  //�õ�ʱ�Ӷ���
var time;  //��¼ʱ��
var controls; //��������������

// mesh
//var front , back , left , right , floor , ceil;  //����ǽ��mesh
var beizi,chuangdan,dianxiang,diban,jingkuang,other,shizixiu,wall,zhentou;
//var wall ;  //ǽ��mesh
//var miscMesh; //��̬���ģ��mesh
//var shizixiu; //ͼƬmesh
//var jingkuang; //����Mesh

var  image; //ʮ����ͼƬ����

var i = 0; //��պ���ͼƬ�±�


//loader images
var initWallPic,initFloorPic,initCeilPic;//main images
var initBedPic,initBedSidePic,initDoorPic,initZuoziPic,initTeapot,initCurtainPic //misc images
var miscMaterials,InitWallMaterial,InitCeilMaterial,InitFloorMaterial; //materials
var loader;
var initTexturePos = new THREE.Vector3(0 , 0,0);

var imgWidth , imgHeight;
var picWidth ,picHeight;
var isShowFPS = true;
var canHitObjects = [];
/************************SPRITE*******************************/
var ballSprite;

//load  model path
var basicPath = "static/3dhouse/";

var basicModelPath = basicPath + "models/";
var basicPicPath = basicPath +"textures/";


var basicMiscPicPath = basicPicPath +"misc/";

var basicFloorPicPath = basicPicPath +"floor/"
var basicCeilPicPath = basicPicPath +"ceil/"
var basicWallPicPath = basicPicPath +"wall/"
var basicSkyboxPicPath = basicPicPath +"skybox/"

//pic spirit path
var redSpiritPath = basicPicPath + "sprite0.png";
/*
//model
var miscModelPath = basicModelPath+ "houseall.js";  //misc.js  //houseall.js

var floorModelPath = basicModelPath+ "floor.js"
var teapotModelPath = basicModelPath+ "teapot01.js";
var ceilModelPath = basicModelPath+ "ceil.js";
var wallModelPath = basicModelPath+ "wall03.js"



var bedPicPath = basicMiscPicPath+ "bed01.jpg";
var bedSidePicPath = basicMiscPicPath+ "bed02.jpg";
var doorPicPath = basicMiscPicPath+ "door02.jpg";
var zuoziPicPath = basicMiscPicPath+ "zuozi03.jpg";
var teapotPicPath = basicMiscPicPath+ "teapot01.jpg";
var curtainPicPath = basicMiscPicPath+ "curtain01.jpg";

//pic  need updata pic path
var floorPic01Path = basicFloorPicPath + "floor01.jpg";
var ceilPic01Path = basicCeilPicPath + "ceil01.jpg";
var wallPic01Path = basicWallPicPath + "wall01.jpg";
//need updata pic path  END
*/

/*************************Method**********************/
init();  //��ʼ��
animate(); //ÿһ֡��Ⱦ

//FUNCTION
function init(){
	initScene();        //��ʼ������
	//initImages();	    //��ʼ��ͼƬ
	//imitMaterails();    //��ʼ������
	loaderHouse();      //���ط���ģ��
	paintStitch();      //����ʮ����ͼƬ
	addEventLis();      //�����¼�����
}
function animate(){     
	requestAnimationFrame( animate ); //ÿִ֡��һ��
	render();
};
//��Ⱦ
function render(){
	keyEvent();
	renderer.render( scene, camera );
	if(isShowFPS){
		stats.update();
	}
}
//��ʼ������
function initScene(){
	//���� 
	scene = new THREE.Scene();
	//�����
	camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight , 1,20000);
	camera.position.set(0, 180,200);
	camera.up = (0,0,1);
	//camera.rotateX(-Math.PI/20);
	camera.scale.set(0.1,0.1,0.1);
	//camera.rotation.y =Math.PI * 0.5
	
	//������
	//controls = new THREE.OrbitControls( camera );
	//controls.addEventListener( 'change', render );

	//��
	/*var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( ambientLight );
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 1, 0 );
	scene.add( directionalLight );
	var light = new THREE.AmbientLight( 0xff0000 ); // soft white light
	scene.add( light );*/
	var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
	// directional lighting
	var directionalLight = new THREE.DirectionalLight(0xffffff);  //����������Ⱦ�󣬿��Բ��ô���ô��ƹ���
	directionalLight.position.set(0, 0, 10);
	scene.add(directionalLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(0, 0, -10);
	scene.add(directionalLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(10, 0, 0);
	scene.add(directionalLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(-10, 0, 0);
	scene.add(directionalLight);
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(0, 10, 0);
	scene.add(directionalLight);
	
	//����
	plane = new THREE.Mesh(new THREE.PlaneGeometry(0.5 ,0.5, 8 , 8 ) , new THREE.MeshBasicMaterial({color : 0x000000 , opacity : 0.25 , transparent : false , wireframe : true}));
	plane.visible = true;
	plane.position.set(-2 , 1,0);
	//scene.add(plane);

	// ���� 
	container = document.getElementById("container3d");

	//��Ⱦ��
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	//renderer.setScissor( 200, 200, window.innerWidth, window.innerHeight );
	//renderer.setViewport( 300, 0, window.innerWidth, window.innerHeight );
	container.appendChild(renderer.domElement);
	
	//  ��ʾ֡��
	if(isShowFPS){
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0px';
		stats.domElement.style.zIndex = 100;
		container.appendChild( stats.domElement );
	}

	// SKYBOX/FOG  ��պ���
	//scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );  //�Ƿ�����Ч��
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( basicSkyboxPicPath+"px.jpg" ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( basicSkyboxPicPath+"nx.jpg" ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( basicSkyboxPicPath+"py.jpg" ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( basicSkyboxPicPath+"ny.jpg" ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( basicSkyboxPicPath+"pz.jpg" ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( basicSkyboxPicPath+"nz.jpg" ) }));
	for (var i = 0; i < 6; i++){
	   materialArray[i].side = THREE.BackSide;
	}
	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 2000, 2000,2000, 1, 3, 1 );
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	scene.add( skybox );

	//��С����
	var ballTexture = THREE.ImageUtils.loadTexture(redSpiritPath);

	var ballMaterial = new THREE.SpriteMaterial({map : ballTexture , useScreenCoordinates : true , alignment : THREE.SpriteAlignment.center});

	ballSprite = new THREE.Sprite(ballMaterial);
	ballSprite.scale.set(32,32,1.0);
	ballSprite.position.set(50,50,0);
	scene.add(ballSprite);	

	//��ʼ������
	projector = new THREE.Projector();  //��ʼ�����������������
	raycaster = new THREE.Raycaster();  //ʵ����Ͷ������������
};
/******************����ͼƬ,��������************/
function initImages(){
	
	initFloorPic = loadImage(floorPic01Path,8,8);
	initCeilPic = loadImage(ceilPic01Path,8,8);
	initWallPic = loadImage(wallPic01Path,16,2);


	initBedPic = THREE.ImageUtils.loadTexture( bedPicPath );
	initBedSidePic = THREE.ImageUtils.loadTexture( bedSidePicPath );
	initDoorPic = THREE.ImageUtils.loadTexture( doorPicPath );
	initZuoziPic = THREE.ImageUtils.loadTexture( zuoziPicPath );
	initTeapot = THREE.ImageUtils.loadTexture( teapotPicPath );
	initCurtainPic = THREE.ImageUtils.loadTexture( curtainPicPath );
};
/******************��ʼ������*******/
function imitMaterails(){
	miscMaterials = {
		bed: new THREE.MeshLambertMaterial( {
			color: 0xff6600,
			map : initBedPic,
			combine: THREE.MixOperation,
			reflectivity: 0.3
		} ),

		bedside: new THREE.MeshLambertMaterial( {
			color: 0xffffff,
			map : initBedSidePic,
		} ),

		curtain: new THREE.MeshLambertMaterial( {
			color: 0xffffff,
			map : initCurtainPic,
			reflectivity : 0.8,
		} ),
		zuozi: new THREE.MeshBasicMaterial( {
		color: 0x223344,
		map : initZuoziPic,	
		opacity: 0.35,
		combine: THREE.MixOperation,
		reflectivity: 0.25,
		transparent: true
		} ),

		teapot: new THREE.MeshLambertMaterial( {
			color: 0x050505,
			map : initTeapot
		} ),

		door: new THREE.MeshPhongMaterial( {
			color: 0xffffff,
			reflectivity : 0.3,
			map : initDoorPic,
			shininess: 20
		} ),
	}
	InitWallMaterial = new THREE.MeshBasicMaterial({ambient : 0xffffff , combine : THREE.MixOperation, reflectivity : 0.3,map : initWallPic});
	InitCeilMaterial = new THREE.MeshBasicMaterial({map :initCeilPic});
	InitFloorMaterial = new THREE.MeshLambertMaterial({color : 0x444444,map : initFloorPic});
};
/*************��������*************/
function loaderHouse(){
	
	/**************beging**/
	loader = new THREE.JSONLoader(); 
	loader.load("static/3dhouse/models/beizi.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		beizi = new THREE.Mesh( geometry, m );
		addModel2Scene(beizi,"beizi",0 , 0 , 0 ,1,true);
	});
	loader.load("static/3dhouse/models/chuangdan.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		chuangdan = new THREE.Mesh( geometry, m );
		addModel2Scene(chuangdan,"chuangdan",0 , 0 , 0 ,1,true);
	});
	loader.load("static/3dhouse/models/diaoxiang.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		diaoxiang = new THREE.Mesh( geometry, m );
		addModel2Scene(diaoxiang,"diaoxiang",0 , 0 , 0 ,1,true);
	});
	loader.load("static/3dhouse/models/diban.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		diban = new THREE.Mesh( geometry, m );
		addModel2Scene(diban,"diban",0 , 0 , 0 ,1,true);
	});
	
	loader.load("static/3dhouse/models/other.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		other = new THREE.Mesh( geometry, m );
		addModel2Scene(other,"other",0 , 0 , 0 ,1,false);
	});
	
	loader.load("static/3dhouse/models/wall.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		wall = new THREE.Mesh( geometry, m );
		addModel2Scene(wall,"wall",0 , 0 , 0 ,1,true);
	});
	loader.load("static/3dhouse/models/zhentou.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		zhentou = new THREE.Mesh( geometry, m );
		addModel2Scene(zhentou,"zhentou",0 , 0 , 0 ,1,true);
	});
	/*loader.load("static/3dhouse/models/cube.js" , function(geometry , materials){
		var m = new THREE.MeshFaceMaterial(materials);
		cube = new THREE.Mesh( geometry, m );
		addModel2Scene(cube,"cube",0 , 0 , 0 ,1,true);
	});*/

}
/**********����ʮ����;���*********/
function paintStitch(){
	//PAINTING
	var callbackPainting = function(){
		//console.log("callbackpainting");
		image = texturePainting.image;
		imgWidth = image.width / 500;
		imgHeight = image.width / 500;
		loader.load("static/3dhouse/models/shizixiu.js" , function(geometry , materials){
			var m = new THREE.MeshFaceMaterial(materials);
			//console.log(m);
			shizixiu = new THREE.Mesh( geometry, materialPainting);
			shizixiu.name = 'shizixiu';
			shizixiu.scale.set(imgWidth,imgHeight,1);   //����ģ�ͱ����淶��������Ҫ����Ϊ(1,1,1) ����������
			scene.add( shizixiu );
			canHitObjects.push(shizixiu);
			addPainting(scene, shizixiu );
		});
		function addPainting( zscene, zmesh  ) {
			zscene.add( zmesh );
			loader.load("static/3dhouse/models/jingkuang.js" , function(geometry , materials){
				var m = new THREE.MeshFaceMaterial(materials);
				console.log(m.materials[0]);
				m.materials[0].color.setHex(0x000000);
				m.materials[0].polygonOffset = true;
				m.materials[0].polygonOffsetFactor = 1;
				m.materials[0].polygonOffsetUnits = 5;
				//meshFrame = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x000000, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 5 } )  );
				jingkuang = new THREE.Mesh( geometry, m );
				jingkuang.position.set( 0, 0, 0 ); 
				jingkuang.name = 'jingkuang';
				jingkuang.scale.set(imgWidth,imgHeight,1);   //����ģ�ͱ����淶��������Ҫ����Ϊ(1,1,1) ����������
				scene.add( jingkuang );
				canHitObjects.push(jingkuang);
			});		
		}
	};
	var texturePainting = THREE.ImageUtils.loadTexture( texturePath, THREE.UVMapping, callbackPainting ), //û�� THREE.UVMappingͼƬ����ʾ
	materialPainting = new THREE.MeshBasicMaterial( { color: 0xffffff, map:texturePainting } );
}
/******����¼�����********/
function addEventLis(){
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	renderer.domElement.addEventListener('mousemove' , onDocumentMouseMove , false);  //renderer.domElementʵ���Ͼ��ǻ���3D��canvas
	renderer.domElement.addEventListener( 'mousedown' , onDocumentMouseDown , false );
	renderer.domElement.addEventListener( 'mouseup' , onDocumentMouseUp , false );
	document.addEventListener("click",dbclick ,false);
};
//������ť�¼�
function keyEvent(){
	if ( keyboard.pressed("w") ) 
	{ 
		//if(camera.position.x > -2.5)
			camera.translateZ(-8);
	}

	if ( keyboard.pressed("s") ) 
	{ 
		//if(camera.position.x < 2.5)
			camera.translateZ(8);
	}
	if ( keyboard.pressed("a") ) 
	{ 
		//if(camera.position.z < 2.5)
			camera.translateX(-8);
	}
	
	if ( keyboard.pressed("d") ) 
	{ 
		//if(camera.position.z > -2.5)
			camera.translateX(8 );
	}
	
	if ( keyboard.pressed("up") ) 
	{ 
		//if(camera.position.x > -2.5)
			camera.translateZ(-8);
	}
	if ( keyboard.pressed("down") ) 
	{ 
		//if(camera.position.x < 2.5)
			camera.translateZ(8);
	}

	if ( keyboard.pressed("left") ) 
	{ 
			camera.rotation.y += 0.01 * Math.PI * 0.5;
	}

	if ( keyboard.pressed("right") ) 
	{ 
			camera.rotation.y -= 0.01 * Math.PI * 0.5;
	}
}
//��갴���¼� 
function onDocumentMouseDown( event ){
	//document.write("onDocumentMouseDown");
	event.preventDefault();
	//console.log(mouse);
	var vector = new THREE.Vector3( mouse.x , mouse.y , 0.0);
	//document.write("--->"+vector);  //Object
	projector.unprojectVector( vector , camera );

	var raycaster = new THREE.Raycaster(camera.position , vector.sub( camera.position ).normalize(),1,10000); //@1origin vector  @2:direction 
	var intersects = raycaster.intersectObject(shizixiu);
	if( intersects.length > 0){ //�����갴����������
		//controls.enabled = false;
		//console.log("������pic");
		container.style.cursor = 'move'; //�ƶ����
		SELECTED = intersects[ 0 ].object;  //ѡ�е�����
		//console.log(SELECTED);
		var intersects = raycaster.intersectObject( jingkuang );
		offset.copy( intersects[0].point).sub( jingkuang.position ); //?
		var intersects = raycaster.intersectObject("");
	}
}
			
/**�������Ļ�Ľ����¼�**/
function onDocumentMouseMove(event){
	event.preventDefault();
	
	//��Ļ�е�(0,0),��Ļ���Ͻ�(1,1)
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight ) * 2 + 1;
	
	var vector = new THREE.Vector3(mouse.x , mouse.y , 1);
	projector.unprojectVector(vector, camera); //��������������Ͷ��
	raycaster.set(camera.position , vector.sub(camera.position).normalize());//����				
	//���ѡ�������壬(��SELECTED��Ϊ��)
	if(SELECTED){
		//console.log("ѡ�������岢�ƶ�");
		var intersects = raycaster.intersectObject( jingkuang );  //ѡ��һ�������  intersects.lenth = 1;
		if(intersects[ 0 ]){
			SELECTED.position.copy( intersects[ 0 ].point.sub( offset ));
		};
		jingkuang.position.copy(SELECTED.position); //����ƽ��λ��
		return;
	}

	var intersects = raycaster.intersectObjects(canHitObjects); //���ߺͳ��������е�Ԫ�ؽ�
	//��,  intersects �洢������������ײ��Object				
	if(intersects.length > 0){ //INTERSECTED  ��ײ�ĵ�һ������
		//console.log("collider->");
		if(INTERSECTED != intersects[0].object){ 
			if(INTERSECTED){ //������뿪����һ��������ײʱ���ظ�ԭ������ɫ
				//INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex); 
			}
			INTERSECTED = intersects[0].object;
			//console.log(INTERSECTED);
		}
		container.style.cursor = 'pointer'; //������һֻ��
	}else {//û���κ���ײ
		if(INTERSECTED) { //��ԭԭ�����屾ɫ
			//INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
		}
		INTERSECTED = "";
		container.style.cursor = 'auto';  //Ĭ�Ϲ��
	}
}
//���̧���¼�
function onDocumentMouseUp( event ){
	//console.log("onDocumentMouseUp");
	event.preventDefault();
	//controls.enabled = true;

	if( INTERSECTED){
		//plane.position.copy( INTERSECTED.position);
		SELECTED = null;
	}
	container.style.cursor = 'auto'; //Ĭ�Ϲ��
}

var originalColor;
//˫���¼�
function dbclick(event){
	if(clock.getElapsedTime()- time <0.25){
		switch (INTERSECTED.name)
		{
		case "diban":
			$(".transparent_class").fadeIn(400);
			$('.popup').fadeIn(400);
			$("#popup_con_floor").fadeIn(400);
			break;
		case "wall":
			$(".transparent_class").fadeIn(400);
			$('.popup').fadeIn(400);
			$("#popup_con_wall").fadeIn(400);
			break;
		case "beizi":
			console.log("beizi");
			beizi.material.materials[0].color.setHex(getRandomColor());
			//beizi.material.materials[0]
			break;
		case "chuangdan":
			console.log("chuangdan");
			chuangdan.material.materials[0].color.setHex(getRandomColor());
			break;
		case "zhentou":
			console.log("zhentou");
			zhentou.material.materials[0].color.setHex(getRandomColor());
			break;
		case "diaoxiang":
			console.log("diaoxiang");
			diaoxiang.material.materials[0].color.setHex(getRandomColor());
			break;
		default : 
			break;
		}
	}
	time = clock.getElapsedTime();
}

/*
*����url����objMesh��ͼ
* @p1  objMesh : ��Ҫ������ͼ��mesh
* @p2  url     : ��ͼ·��
* @p3  rx      : x�᷽����ƽ��rx��
* @p4  ry      : y�᷽����ƽ��ry��
*/
function changeImage(objMesh,url,rx,ry){
	var newimg = THREE.ImageUtils.loadTexture(url);
	newimg.wrapS = newimg.wrapT = THREE.RepeatWrapping;
	newimg.repeat.set(rx,ry);
	//var newMaterial = new THREE.MeshBasicMaterial( { map: newimg } );
	//objMesh.material = newMaterial;
	objMesh.material.materials[0].map = newimg;
}

function changeImage2(objMesh,url,rx,ry){
	var texture = objMesh.material.materials[0].map;
	var img = new Image()
	img.onload = function(){
		texture.image = img;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(rx,ry);
		texture.needsUpdate = true;
	}
	img.src = url;
}
/*
*����url����ͼƬ����������ͼ
*@p1 url :  ͼƬ·��
*@p2 rx  :  x�᷽����ƽ��rx��
*@p2 ry  :  y�᷽����ƽ��ry��
*/
function loadImage(url,rx,ry){
	var newimg = THREE.ImageUtils.loadTexture(url);
	newimg.wrapS = newimg.wrapT = THREE.RepeatWrapping;
	newimg.repeat.set(rx,ry);
	return newimg;
}
/*
*���ݽ�������������ͼƬ
*@p1 objMesh : ��ͼmesh(ʵ������������ͼ��Cube������)
*@p2 objMesh02 : ���mesh
*@p3 ratio �����ƶ����� (����Ϊ0 �� ���ұ�Ϊ1)
*/
function zoomImage(objMesh ,objMesh02,ratio){
	//console.log("ratio:::"+ratio);
	var zoom = ratio * 1 + 0.4; //(0.5-2.5)
	//console.log(objMesh.scale);
	//console.log(objMesh02.scale);
	objMesh.scale.set(imgWidth * zoom ,imgHeight * zoom, 1);
	objMesh02.scale.set(imgWidth * zoom ,imgHeight * zoom ,1);	
};
/*
*��������λ��,���ű���
**/
function resetScene(){
	shizixiu.position.set(0 ,initTexturePos.y, initTexturePos.z);
	jingkuang.position.set(0 , initTexturePos.y,initTexturePos.z);
	shizixiu.scale.set(imgWidth  ,imgHeight  ,1);
	jingkuang.scale.set(imgWidth ,imgHeight  ,1);
};
/*
*���mesh������
**/
function addModel2Scene( mesh,name, x, y, z, b,isCanHit){
	mesh.name = name;
	mesh.position.set( x, y, z ); 
	mesh.scale.set(b,b,b);   //����ģ�ͱ����淶��������Ҫ����Ϊ(1,1,1) ����������
	scene.add( mesh );
	if(isCanHit)
		canHitObjects.push(mesh);
}
//��������ɫ
function getRandomColor(){
    return '0x'+Math.floor(Math.random()*16777215).toString(16);
}