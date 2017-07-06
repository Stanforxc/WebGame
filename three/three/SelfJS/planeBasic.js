/**
 * Created by stanforxc on 17-5-10.
 */


//创建场景
function createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    scene.fog = new THREE.Fog(0xf7d9aa, 100,950);
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

//创建光源
var ambientLight,hemisphereLight, shadowLight;
function createLights() {

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
    ambientLight = new THREE.AmbientLight(0xdc8874,.5);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 4096;
    shadowLight.shadow.mapSize.height = 4096;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}


var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0
};

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container,clock;


var game;

var deltaTime = 0;
var oldTime = new Date().getTime();
var newTime = new Date().getTime();

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };


function resetGame(){
    game = {speed:0,
        initSpeed:.00035,
        baseSpeed:.00035,
        targetBaseSpeed:.00035,
        incrementSpeedByTime:.0000025,
        incrementSpeedByLevel:.000005,
        distanceForSpeedUpdate:100,
        speedLastUpdate:0,

        distance:0,
        ratioSpeedDistance:50,
        energy:100,
        ratioSpeedEnergy:3,

        level:1,
        levelLastUpdate:0,
        distanceForLevelUpdate:1000,

        planeDefaultHeight:100,
        planeAmpHeight:80,
        planeAmpWidth:75,
        planeMoveSensivity:0.005,
        planeRotXSensivity:0.0008,
        planeRotZSensivity:0.0004,
        planeFallSpeed:.001,
        planeMinSpeed:1.2,
        planeMaxSpeed:1.6,
        planeSpeed:0,
        planeCollisionDisplacementX:0,
        planeCollisionSpeedX:0,

        planeCollisionDisplacementY:0,
        planeCollisionSpeedY:0,

        seaRadius:600,
        seaLength:800,
        //seaRotationSpeed:0.006,
        wavesMinAmp : 5,
        wavesMaxAmp : 20,
        wavesMinSpeed : 0.001,
        wavesMaxSpeed : 0.003,

        cameraFarPos:500,
        cameraNearPos:150,
        cameraSensivity:0.002,

        coinDistanceTolerance:15,
        coinValue:3,
        coinsSpeed:.5,
        coinLastSpawn:0,
        distanceForCoinsSpawn:100,

        ennemyDistanceTolerance:10,
        ennemyValue:10,
        ennemiesSpeed:.6,
        ennemyLastSpawn:0,
        distanceForEnnemiesSpawn:50,

        status : "playing"
    };
    fieldLevel.innerHTML = Math.floor(game.level);
}

// 人物，简单的摆腿接口updateLeg()
var Naruto = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'Naruto';
    this.angleHair = 0;

        //身体
    var bodyGeom = new THREE.BoxGeometry(60,70,40);
    var bodyMat = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        shading:THREE.FlatShading
    });
    var body = new THREE.Mesh(bodyGeom,bodyMat);
    body.position.set(0,-55,0);

    this.mesh.add(body);

    //手
    var shoulderL=new THREE.Object3D();
    var shoulderR=new THREE.Object3D();
    var armGeom = new THREE.BoxGeometry(60,20,20);
    var armMat = new THREE.MeshPhongMaterial({
        color: Colors.pink,
        shading:THREE.FlatShading
    });
    var armL = new THREE.Mesh(armGeom,armMat);
    var armR = new THREE.Mesh(armGeom,armMat);

    shoulderL.position.set(0,-40,-20);
    shoulderR.position.set(0,-40,20);
    armL.position.set(30,0,0);
    armR.position.set(30,0,0);
    shoulderR.rotation.set(0,0,-0.25*Math.PI);
    shoulderL.rotation.set(0,0,-0.75*Math.PI);
    shoulderL.add(armL);
    shoulderR.add(armR);

    this.mesh.add(shoulderL);
    this.mesh.add(shoulderR);

    //屁股
    var assGeom= new THREE.CylinderGeometry(30,30,40,20,20);

    assGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    var ass=new THREE.Mesh(assGeom,bodyMat);
    ass.position.set(0,-80,0);
    this.mesh.add(ass);

    //腿
    var legL=new THREE.Object3D();
    var legR=new THREE.Object3D();
    var legGeom = new THREE.BoxGeometry(30,80,20);
    var L = new THREE.Mesh(legGeom,armMat);
    var R = new THREE.Mesh(legGeom,armMat);

    legL.position.set(0,-100,-10);
    legR.position.set(0,-100,10);
    L.position.set(0,-40,0);
    R.position.set(0,-40,0);
    legL.add(L);
    legR.add(R);

    this.mesh.add(legL);
    this.mesh.add(legR);


    var geomHead= new THREE.BoxGeometry(40,40,25,1,1,1);
    var matHead = new THREE.MeshPhongMaterial({color: Colors.pink, shading:THREE.FlatShading});
    var head = new THREE.Mesh(geomHead, matHead);
    head.castShadow = true;
    head.receiveShadow = true;
    this.mesh.add(head);

    var hairGeom = new THREE.BoxGeometry(2,10,30);
    var hairMat = new THREE.MeshLambertMaterial({
        color: Colors.red
    });
    var hair = new THREE.Mesh(hairGeom,hairMat);
    //hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
    var hairs = new THREE.Object3D();

    var hairsTri=new THREE.Object3D();
    var numBottom=7;
    var startPosY = 0;
    var startPosX = -22;
    while(numBottom>0)
    {
        for(var i=0;i<numBottom;i++)
        {
            var h = hair.clone();
            //h.position.set(startPosX + row*4,0,startPosZ + col*4);
            h.position.set(startPosX + i*2,startPosY,0);
            hairsTri.add(h);
        }
        numBottom=numBottom-2;
        startPosY=startPosY+5;
        startPosX=startPosX+2;
    }


    this.hairsTop = new THREE.Object3D();

    for(var i=0;i<4;i++)
    {
        var h=hairsTri.clone();
        h.position.set(i*10,0,0);
        this.hairsTop.add(h);
    }
    hairs.add(this.hairsTop);



    hairs.position.y = 15;
    this.mesh.add(hairs);


    Naruto.prototype.updateHairs = function () {
        var hairs = this.hairsTop.children;

        var l = hairs.length;
        for(var i=0;i<l;i++){
            var h = hairs[i];
            var pos=Math.sin(this.angleHair+i/3);
            if(pos<0)
                pos=0-pos;
            h.scale.y = .75 + Math.cos(this.angleHair+i/3)*.25;
        }
        this.angleHair += 0.16;
    };

    this.dir=false;
    this.speed=0.02;
    this.changeTime=0.25/this.speed;
    this.totalchangeTime=2*this.changeTime;

    Naruto.prototype.updateLeg=function(){
        var L=this.LegL;
        var R=this.legR;
        if(this.dir)
        {
            this.changeTime+=1;
            legL.rotation.z+=this.speed*Math.PI;
            legR.rotation.z-=this.speed*Math.PI;
        }
        else
        {
            this.changeTime-=1;
            legL.rotation.z-=this.speed*Math.PI;
            legR.rotation.z+=this.speed*Math.PI;
        }

        if(this.changeTime>=this.totalchangeTime||this.changeTime<=0)
            this.dir=!this.dir;
    }
};


var AirPlane = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'airPlane';

    //机舱
    var geomCockpit = new THREE.BoxGeometry(60,50,50,1,1,1);

    geomCockpit.vertices[4].y -= 10;
    geomCockpit.vertices[4].z += 20;
    geomCockpit.vertices[5].y -= 10;
    geomCockpit.vertices[5].z += 20;
    geomCockpit.vertices[6].y += 30;
    geomCockpit.vertices[6].z += 20;
    geomCockpit.vertices[7].y += 30;
    geomCockpit.vertices[7].z -= 20;


    var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);




    //引擎
    var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
    var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);




    //机尾
    var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
    var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-40,20,0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);




    //机翼
    var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
    var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.position.set(0,0,0);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);




    //螺旋桨
    var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
    var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;


    //桨叶
    var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
    var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});

    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8,0,0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50,0,0);
    this.mesh.add(this.propeller);


    //鸣人～
    this.naruto = new Naruto();
    this.naruto.mesh.position.set(-10,27,0);
    this.mesh.add(this.naruto.mesh);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

};

var skyDome;
Sky = function () {
    this.mesh = new THREE.Object3D();
    this.nClouds = 20;
    this.clouds = [];
    var stepAngle = Math.PI*2 / this.nClouds;
    for(var i=0; i<this.nClouds; i++){
        var c = new Cloud();
        this.clouds.push(c);
        var a = stepAngle*i;
        var h = game.seaRadius + 150 + Math.random()*200;
        c.mesh.position.y = Math.sin(a)*h;
        c.mesh.position.x = Math.cos(a)*h;
        c.mesh.position.z = -300-Math.random()*500;
        c.mesh.rotation.z = a + Math.PI/2;
        var s = 1+Math.random()*2;
        c.mesh.scale.set(s,s,s);
        this.mesh.add(c.mesh);
    }

    Sky.prototype.moveClouds = function () {
        for(var i = 0; i < this.nClouds; i++){
            var c = this.clouds[i];
            c.rotate();
        }
        this.mesh.rotation.z += game.speed*deltaTime;
    };
};


//创建海
Sea = function () {

    var geom = new THREE.CylinderGeometry(game.seaRadius,game.seaRadius,game.seaLength,40,10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    geom.mergeVertices();
    var l = geom.vertices.length;

    this.waves = [];

    for (var i=0;i<l;i++){
        var v = geom.vertices[i];
        //v.y = Math.random()*30;
        this.waves.push({y:v.y,
            x:v.x,
            z:v.z,
            ang:Math.random()*Math.PI*2,
            amp:game.wavesMinAmp + Math.random()*(game.wavesMaxAmp-game.wavesMinAmp),
            speed:game.wavesMinSpeed + Math.random()*(game.wavesMaxSpeed - game.wavesMinSpeed)
        });
    };
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.blue,
        transparent:true,
        opacity:.8,
        shading:THREE.FlatShading,

    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.name = "waves";
    this.mesh.receiveShadow = true;


    Sea.prototype.moveWaves = function (){
        var verts = this.mesh.geometry.vertices;
        var l = verts.length;
        for (var i=0; i<l; i++){
            var v = verts[i];
            var vprops = this.waves[i];
            v.x =  vprops.x + Math.cos(vprops.ang)*vprops.amp;
            v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
            vprops.ang += vprops.speed*deltaTime;
            this.mesh.geometry.verticesNeedUpdate=true;
        }
    }
};


Terrain = function () {
    var xS = 63, yS = 63;


    this.terrainScene = new THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 2.5,
        heightmap: THREE.Terrain.DiamondSquare,
        material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
        maxHeight: 100,
        minHeight: -100,
        steps: 1,
        useBufferGeometry: false,
        xSegments: xS,
        xSize: 1024,
        ySegments: yS,
        ySize: 1024
    });

};



//创建云
Cloud = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'cloud';

    var geom = new THREE.BoxGeometry(20,20,20);

    var mat = new THREE.MeshPhongMaterial({
        color:Colors.white,
    });

    var nBlocs = 3+Math.floor(Math.random()*3);

    for(var i=0;i<nBlocs;i++){
        var m = new THREE.Mesh(geom,mat);

        m.position.x = i*15;
        m.position.y = Math.random()*10;
        m.position.z = Math.random()*10;
        m.rotation.z = Math.random()*Math.PI*2;
        m.rotation.y = Math.random()*Math.PI*2;

        var s = .1 + Math.random()*.9;
        m.scale.set(s,s,s);

        m.castShadow = true;
        m.receiveShadow = true;

        this.mesh.add(m);
    }

    Cloud.prototype.rotate = function(){
        var l = this.mesh.children.length;
        for(var i=0; i<l; i++){
            var m = this.mesh.children[i];
            m.rotation.z+= Math.random()*.005*(i+1);
            m.rotation.y+= Math.random()*.002*(i+1);
        }
    }
};


//创建烟雾
var Smoke = function () {
    function Smoke() {
        this.init();
    }

    Smoke.prototype.init = function init() {

        this.clock = new THREE.Clock();

        var meshGeometry = new THREE.CubeGeometry(200, 200, 200);
        var meshMaterial = new THREE.MeshLambertMaterial({
            color: 0xaa6666,
            wireframe: false
        });
        this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);

        this.cubeSineDriver = 0;

        this.addParticles();
        //this.addBackground();

    };

    Smoke.prototype.evolveSmoke = function evolveSmoke(delta) {
        var smokeParticles = this.smokeParticles;

        var smokeParticlesLength = smokeParticles.length;

        while (smokeParticlesLength--) {
            smokeParticles[smokeParticlesLength].rotation.z += delta * 0.2;
        }
    };

    Smoke.prototype.addParticles = function addParticles() {

        var textureLoader = new THREE.TextureLoader();
        var smokeParticles = this.smokeParticles = [];

        textureLoader.load('./three/image/clouds.png', function (texture) {
            var smokeMaterial = new THREE.MeshLambertMaterial({
                color: 0x68c3c0,
                map: texture,
                opacity: 0.3,
                transparent: true
            });
            smokeMaterial.map.minFilter = THREE.LinearFilter;
            var smokeGeometry = new THREE.PlaneBufferGeometry(300, 300);

            var smokeMeshes = [];
            var limit = 150;

            while (limit--) {
                smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);
                smokeMeshes[limit].position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, 0);
                smokeMeshes[limit].rotation.z = Math.random() * 360;
                smokeParticles.push(smokeMeshes[limit]);
                scene.add(smokeMeshes[limit]);
            }
        });
    };

    Smoke.prototype.addBackground = function addBackground() {

        var textureLoader = new THREE.TextureLoader();
        var textGeometry = new THREE.PlaneBufferGeometry(600, 320);


        textureLoader.load('./three/image/background.jpg', function (texture) {
            var textMaterial = new THREE.MeshLambertMaterial({
                blending: THREE.AdditiveBlending,
                color: 0xffffff,
                map: texture,
                transparent: true
            });
            textMaterial.map.minFilter = THREE.LinearFilter;
            var text = new THREE.Mesh(textGeometry, textMaterial);

            text.position.z = 0;
            text.position.y = 100;
            scene.add(text);
        });
    };

    Smoke.prototype.render = function render() {
        var mesh = this.mesh;
        var cubeSineDriver = this.cubeSineDriver;

        cubeSineDriver += 0.01;

        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        mesh.position.z = 100 + Math.sin(cubeSineDriver) * 500;
    };

    Smoke.prototype.update = function update() {
        this.evolveSmoke(this.clock.getDelta());
        this.render();
    };

    return Smoke;
}();

class Fly {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(0, 12.71, 19.08);

        this.wingAngle = 0;

        this.drawBody();
        this.drawWings();
    }
    drawBody() {
        const flyGeometry = new THREE.BoxGeometry(1, 1, 1);
        const flyMaterial = new THREE.MeshStandardMaterial({
            color: 0x3F3F3F,
            roughness: 1,
            shading: THREE.FlatShading,
        });
        const fly = new THREE.Mesh(flyGeometry, flyMaterial);
        this.group.add(fly);
    }
    drawWings() {
        this.rightWing = drawCylinder(0xffffff, 0.42, 0.08, 1.26, 4);
        this.rightWing.position.set(0, 0.2, 0.6);
        this.rightWing.rotation.set(Math.PI / 4, 0, Math.PI / 4);
        this.rightWing.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.21, 0.04));
        this.group.add(this.rightWing);

        this.leftWing = this.rightWing.clone();
        this.leftWing.position.z = -this.rightWing.position.z;
        this.group.add(this.leftWing);
    }

    moveFly() {
        const timer = Date.now() * 0.0001;
        this.group.position.x = 4 * Math.cos(timer * 3);
        this.group.position.y = 5 * Math.sin(timer * 6);
    }
    moveWings() {
        this.wingAngle += 0.5;
        const wingAmplitude = Math.PI / 8;
        this.rightWing.rotation.x = (Math.PI / 4) - (Math.cos(this.wingAngle) * wingAmplitude);
        this.leftWing.rotation.x = (-Math.PI / 4) + (Math.cos(this.wingAngle) * wingAmplitude);
    }
}

function drawCylinder(materialColor, rTop, rBottom, height, radialSeg) {
    const geometry = new THREE.CylinderGeometry(rTop, rBottom, height, radialSeg);
    const material = new THREE.MeshStandardMaterial({
        color: materialColor,
        roughness: 1,
        shading: THREE.FlatShading,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}



Ennemy = function(){
    var geom = new THREE.TetrahedronGeometry(8,2);
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.red,
        shininess:0,
        specular:0xffffff,
        shading:THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom,mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
};

var ennemiesPool = [];
var particlesPool = [];

EnnemiesHolder = function (){
    this.mesh = new THREE.Object3D();
    this.ennemiesInUse = [];
};

EnnemiesHolder.prototype.spawnEnnemies = function(){
    var nEnnemies = game.level;

    for (var i=0; i<nEnnemies; i++){
        var ennemy;
        if (ennemiesPool.length) {
            ennemy = ennemiesPool.pop();
        }else{
            ennemy = new Ennemy();
        }

        ennemy.angle = - (i*0.1);
        ennemy.dist = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
        ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.dist;
        ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.dist;

        this.mesh.add(ennemy.mesh);
        this.ennemiesInUse.push(ennemy);
    }
};

EnnemiesHolder.prototype.rotateEnnemies = function(object){
    for (var i=0; i<this.ennemiesInUse.length; i++){
        var ennemy = this.ennemiesInUse[i];
        ennemy.angle += game.speed*deltaTime*game.ennemiesSpeed;

        if (ennemy.angle > Math.PI*2) ennemy.angle -= Math.PI*2;

        ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.dist;
        ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.dist;
        ennemy.mesh.rotation.z += Math.random()*.1;
        ennemy.mesh.rotation.y += Math.random()*.1;

        //var globalEnnemyPosition =  ennemy.mesh.localToWorld(new THREE.Vector3());
        var diffPos = object.mesh.position.clone().sub(ennemy.mesh.position.clone());
        var d = diffPos.length();
        if (d<game.ennemyDistanceTolerance){
            particlesHolder.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);

            ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
            this.mesh.remove(ennemy.mesh);
            game.planeCollisionSpeedX = 100 * diffPos.x / d;
            game.planeCollisionSpeedY = 100 * diffPos.y / d;
            ambientLight.intensity = 2;

            removeEnergy();
            i--;
        }else if (ennemy.angle > Math.PI){
            ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
            this.mesh.remove(ennemy.mesh);
            i--;
        }
    }
};

Particle = function(){
    var geom = new THREE.TetrahedronGeometry(3,0);
    var mat = new THREE.MeshPhongMaterial({
        color:0x009999,
        shininess:0,
        specular:0xffffff,
        shading:THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom,mat);
};

Particle.prototype.explode = function(pos, color, scale){
    var _this = this;
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color( color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    var targetX = pos.x + (-1 + Math.random()*2)*50;
    var targetY = pos.y + (-1 + Math.random()*2)*50;
    var speed = .6+Math.random()*.2;
    TweenMax.to(this.mesh.rotation, speed, {x:Math.random()*12, y:Math.random()*12});
    TweenMax.to(this.mesh.scale, speed, {x:.1, y:.1, z:.1});
    TweenMax.to(this.mesh.position, speed, {x:targetX, y:targetY, delay:Math.random() *.1, ease:Power2.easeOut, onComplete:function(){
        if(_p) _p.remove(_this.mesh);
        _this.mesh.scale.set(1,1,1);
        particlesPool.unshift(_this);
    }});
};

ParticlesHolder = function (){
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];
};

ParticlesHolder.prototype.spawnParticles = function(pos, density, color, scale){

    var nPArticles = density;
    for (var i=0; i<nPArticles; i++){
        var particle;
        if (particlesPool.length) {
            particle = particlesPool.pop();
        }else{
            particle = new Particle();
        }
        this.mesh.add(particle.mesh);
        particle.mesh.visible = true;
        var _this = this;
        particle.mesh.position.y = pos.y;
        particle.mesh.position.x = pos.x;
        particle.explode(pos,color, scale);
    }
};


Coin = function(){
    var geom = new THREE.TetrahedronGeometry(5,0);
    var mat = new THREE.MeshPhongMaterial({
        color:0x009999,
        shininess:0,
        specular:0xffffff,

        shading:THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom,mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
};

CoinsHolder = function (nCoins){
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
    for (var i=0; i<nCoins; i++){
        var coin = new Coin();
        this.coinsPool.push(coin);
    }
};

CoinsHolder.prototype.spawnCoins = function(){


    var nCoins = 1 + Math.floor(Math.random()*10);
    var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
    var amplitude = 10 + Math.round(Math.random()*10);
    for (var i=0; i<nCoins; i++){
        var coin;
        if (this.coinsPool.length) {
            coin = this.coinsPool.pop();
        }else{
            coin = new Coin();
        }
        this.mesh.add(coin.mesh);
        this.coinsInUse.push(coin);
        coin.angle = - (i*0.02);
        coin.dist = d + Math.cos(i*.5)*amplitude;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.dist;
        coin.mesh.position.x = Math.cos(coin.angle)*coin.dist;
    }
};

CoinsHolder.prototype.rotateCoins = function(object){
    for (var i=0; i<this.coinsInUse.length; i++){
        var coin = this.coinsInUse[i];
        if (coin.exploding) continue;
        coin.angle += game.speed*deltaTime*game.coinsSpeed;
        if (coin.angle>Math.PI*2) coin.angle -= Math.PI*2;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle)*coin.dist;
        coin.mesh.position.x = Math.cos(coin.angle)*coin.dist;
        coin.mesh.rotation.z += Math.random()*.1;
        coin.mesh.rotation.y += Math.random()*.1;

        //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
        var diffPos = object.mesh.position.clone().sub(coin.mesh.position.clone());
        var d = diffPos.length();
        if (d<game.coinDistanceTolerance){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);
            particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, .8);
            addEnergy();
            i--;
        }else if (coin.angle > Math.PI){
            this.coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
            this.mesh.remove(coin.mesh);
            i--;
        }
    }
};



function addEnergy(){
    game.energy += game.coinValue;
    game.energy = Math.min(game.energy, 100);
}

function removeEnergy(){
    game.energy -= game.ennemyValue;
    game.energy = Math.max(0, game.energy);
}




var airplane;
var sea;
var sky;
var smoke;
var rocket1;
var person;
var terrain;
var fly;
function createFly() {
    fly = new Fly();
    //fly.group.scale.set(.1,.1,.1);
    //fly.group.position.set(200,150,-100);
    console.log("fly created");
    scene.add(fly.group);
}
function createTerrain() {
    terrain = new Terrain();
    scene.add(terrain.terrainScene);
}
function createPlane() {
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25,.25,.25);
    airplane.mesh.position.y = game.planeDefaultHeight;
    scene.add(airplane.mesh);
}

function createRocket(){
    rocket1 = new Rocket();
    rocket1.mesh.scale.set(.1,.1,.1);
    rocket1.mesh.position.y = game.planeDefaultHeight;
    scene.add(rocket1.mesh);
}

function createCharacter() {
    person = new Naruto();
    person.mesh.scale.set(.15,.15,.15);
    person.mesh.position.y = game.planeDefaultHeight;
    scene.add(person.mesh);
}

function createSea() {
    sea = new Sea();
    sea.mesh.position.y = -600;
    scene.add(sea.mesh);
}

function createSky(){
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
}

function createSmoke() {
    smoke = new Smoke();
}

function createCoins(){
    coinsHolder = new CoinsHolder(20);
    scene.add(coinsHolder.mesh)
}

function createEnnemies(){
    for (var i=0; i<10; i++){
        var ennemy = new Ennemy();
        ennemiesPool.push(ennemy);
    }
    ennemiesHolder = new EnnemiesHolder();
    //ennemiesHolder.mesh.position.y = -game.seaRadius;
    scene.add(ennemiesHolder.mesh)
}


function createParticles(){
    for (var i=0; i<10; i++){
        var particle = new Particle();
        particlesPool.push(particle);
    }
    particlesHolder = new ParticlesHolder();
    //ennemiesHolder.mesh.position.y = -game.seaRadius;
    scene.add(particlesHolder.mesh)
}

function createSaturnSystem() {
    drawParticles();
    drawSaturn();
    saturn.scale.set(.1,.1,.1);
    particles.scale.set(.1,.1,.1);
    saturn.position.set(100,300,-200);
    particles.position.set(100,300,-200);
}


function createCactus(){
    drawCactus();
    cactus.scale.set(.1,.1,.1);
    cactus.position.set(200,150,-200);
}




var birds, bird;
var boid, boids;

birds = [];
boids = [];


function createBirds() {
    for ( var i = 0; i < 200; i ++ ) {

        boid = boids[ i ] = new Boid();
        boid.position.x = Math.random() * 400 - 200;
        boid.position.y = Math.random() * 400 - 200;
        boid.position.z = Math.random() * 400 - 200;
        boid.velocity.x = Math.random() * 2 - 1;
        boid.velocity.y = Math.random() * 2 - 1;
        boid.velocity.z = Math.random() * 2 - 1;
        boid.setAvoidWalls( true );
        boid.setWorldSize( 500, 500, 400 );

        bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
        bird.phase = Math.floor( Math.random() * 62.83 );
        scene.add( bird );

    }
}

function updateBird() {

    for ( var i = 0, il = birds.length; i < il; i++ ) {

        boid = boids[ i ];
        boid.run( boids );

        bird = birds[ i ];
        bird.position.copy( boids[ i ].position );

        color = bird.material.color;
        color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

        bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
        bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

        bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
        bird.geometry.vertices[5].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

    }

}


var particles, saturn;
const cc = [0x37BE95, 0xF3F3F3, 0x6549C0];
function drawParticles() {
    particles = new THREE.Group();
    scene.add(particles);
    const geometry = new THREE.TetrahedronGeometry(5, 0);

    for (var i = 0; i < 500; i ++) {
        const material = new THREE.MeshPhongMaterial({
            color: cc[Math.floor(Math.random() * cc.length)],
            shading: THREE.FlatShading
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        particles.add(mesh);
    }
}

function drawSaturn() {
    saturn = new THREE.Group();
    saturn.rotation.set(0.4, 0.3, 0);
    scene.add(saturn);

    const planetGeometry = new THREE.IcosahedronGeometry(100, 1);

    const planetMaterial = new THREE.MeshPhongMaterial({
        color: 0x37BE95,
        shading: THREE.FlatShading
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.position.set(0, 40, 0);
    saturn.add(planet);

    const ringGeometry = new THREE.TorusGeometry(140, 12, 6, 15);
    const ringMeterial = new THREE.MeshStandardMaterial({
        color: 0x6549C0,
        shading: THREE.FlatShading
    });
    const ring = new THREE.Mesh(ringGeometry, ringMeterial);
    ring.position.set(0, 40, 0)
    ring.rotateX(80);
    ring.castShadow = true;
    ring.receiveShadow = true;
    saturn.add(ring);
}

function updateSaturnAndParticles() {
    particles.rotation.x += 0.001;
    particles.rotation.y -= 0.004;
    saturn.rotation.y += 0.005;
}

var controls, cactus;
function drawCactus() {
    const geometry = new THREE.SphereGeometry(100, 5, 5);
    geometry.computeBoundingSphere();

    const scale = 300 / geometry.boundingSphere.radius;
    geometry.scale(scale, scale, scale);

    const originalGeometry = geometry.clone();
    originalGeometry.computeFaceNormals();
    originalGeometry.computeVertexNormals(true);

    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals(true);

    cactus = new THREE.Group();
    scene.add(cactus);

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0xfefefe,
        wireframe: true,
        opacity: 0.5,
    }));
    cactus.add(mesh);

    const innerGeometry = new THREE.SphereGeometry(220, 5, 5);
    const innerSphere = new THREE.Mesh(innerGeometry,
        new THREE.MeshStandardMaterial({
            color: 0x68be83,
            roughness: 0.8,
            shading: THREE.FlatShading,
        }));

    cactus.add(innerSphere);

    for (var f = 0, fl = geometry.faces.length; f < fl; f += 1) {
        const face = geometry.faces[f];
        const centroid = new THREE.Vector3()
            .add(geometry.vertices[face.a])
            .add(geometry.vertices[face.b])
            .add(geometry.vertices[face.c])
            .divideScalar(3);
        const arrow = new THREE.ArrowHelper(face.normal, centroid, 15, 0x3333FF);
        mesh.add(arrow);
    }

    const fvNames = ['a', 'b', 'c', 'd'];

    for (var f = 0, fl = originalGeometry.faces.length; f < fl; f += 1) {
        const face = originalGeometry.faces[f];
        for (var v = 0, vl = face.vertexNormals.length; v < vl; v += 1) {
            const arrow = new THREE.ArrowHelper(
                face.vertexNormals[v],
                originalGeometry.vertices[face[fvNames[v]]],
                15,
                0xFF3333
            );
            mesh.add(arrow);
        }
    }

    for (var f = 0, fl = mesh.geometry.faces.length; f < fl; f += 1) {
        const face = mesh.geometry.faces[f];
        for (var v = 0, vl = face.vertexNormals.length; v < vl; v += 1) {
            const arrow = new THREE.ArrowHelper(
                face.vertexNormals[v],
                mesh.geometry.vertices[face[fvNames[v]]],
                15,
                0x000000
            );
            mesh.add(arrow);
        }
    }
};

function updateCactus() {
    cactus.rotation.x -= 0.01;
    cactus.rotation.y -= 0.02;
}

var group;
function createASystem(){
    group = new THREE.Group();
    group.position.y = 50;
    scene.add(group);

    function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        var meshMaterial = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh(geometry, meshMaterial);

        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        mesh.scale.set(s, s, s);
        group.add(mesh);
    }

    var hexShape = new THREE.Shape();
    hexShape.moveTo(0, 0.8);
    hexShape.lineTo(0.4, 0.5);
    hexShape.lineTo(0.3, 0);
    hexShape.lineTo(-0.3, 0);
    hexShape.lineTo(-0.4, 0.5);
    hexShape.lineTo(0, 0.8);

    var numberOfCrystals = 100;
    for (i = 0; i < numberOfCrystals; i++) {
        var extrudeSettings = {
            amount: Math.random() * 200,
            bevelEnabled: true,
            bevelSegments: 1,
            steps: 1,
            bevelSize: (Math.random() * 10) + 15,
            bevelThickness: (Math.random() * 10) + 25
        };

        addShape(
            hexShape,
            extrudeSettings,
            0xff3333, // color
            0, // x pos
            0, // y pos
            0, // z pos
            Math.random() * 2 * Math.PI, // x rotation
            Math.random() * 2 * Math.PI, // y rotation
            Math.random() * 2 * Math.PI, // z rotation
            1
        );
    }

    group.scale.set(.1,.1,.1);
    group.position.set(-170,200,-100);

}

function updateASystem() {
    group.rotation.x -= 0.01;
    group.rotation.y -= 0.02;
}


var galaxyParticles = [];

function createGaxlaxy() {
    var particle, material;
    for (var zpos = -1000; zpos < 1000; zpos += 5) {
        material = new THREE.ParticleCanvasMaterial2({
            color: 0xF7E4BE,
            program: function(c){
                c.beginPath();
                c.arc(0, 0, .8, 0, Math.PI * 2, true);
                c.fill();
            }
        });
        particle = new THREE.Particle(material);
        particle.position.x = Math.random() * 1000 - 500;
        particle.position.y = Math.random() * 1000 - 500;
        particle.position.z = zpos;
        particle.scale.x = particle.scale.y = 1;
        scene.add(particle);
        galaxyParticles.push(particle);
    }
};

function updateGalaxy() {
    for (var i = 0; i < particles.length; i++) {
        particle = galaxyParticles[i];
        particle.position.z += speed;
        if (particle.position.z > 1000) particle.position.z -= 2000;
    }
}
function loop(){
    newTime = new Date().getTime();
    deltaTime = newTime-oldTime;
    oldTime = newTime;

    if (game.status=="playing") {

        // Add energy coins every 100m;
        if (Math.floor(game.distance) % game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn) {
            game.coinLastSpawn = Math.floor(game.distance);
            coinsHolder.spawnCoins();
        }

        if (Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate) {
            game.speedLastUpdate = Math.floor(game.distance);
            game.targetBaseSpeed += game.incrementSpeedByTime * deltaTime;
        }


        if (Math.floor(game.distance) % game.distanceForEnnemiesSpawn == 0 && Math.floor(game.distance) > game.ennemyLastSpawn) {
            game.ennemyLastSpawn = Math.floor(game.distance);
            ennemiesHolder.spawnEnnemies();
        }

        if (Math.floor(game.distance) % game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate) {
            game.levelLastUpdate = Math.floor(game.distance);
            game.level++;
            fieldLevel.innerHTML = Math.floor(game.level);

            game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel * game.level;
        }



        // updateItem(airplane);
        updateItem(rocket1);
        // updateItem(person);
        updateDistance();
        updateEnergy();
        game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
        game.speed = game.baseSpeed * game.planeSpeed;

    }
    else if(game.status=="gameover"){
        game.speed *= .99;
        rocket1.mesh.rotation.z += (-Math.PI/2 - rocket1.mesh.rotation.z)*.0002*deltaTime;
        rocket1.mesh.rotation.x += 0.0003*deltaTime;
        game.planeFallSpeed *= 1.05;
        rocket1.mesh.position.y -= game.planeFallSpeed*deltaTime;

        if (rocket1.mesh.position.y <-200){
            //showReplay();
            game.status = "waitingReplay";

        }
    }else if (game.status=="waitingReplay"){

    }

    fly.moveFly();
    fly.moveWings();
    updateBird();
    sea.moveWaves();
    sky.moveClouds();
    updateSaturnAndParticles();
    updateCactus();
    updateASystem();
    updateGalaxy();

   // smoke.update();
    //person.updateHairs();
    //person.updateLeg();

    //airplane.propeller.rotation.x +=.2 + game.planeSpeed * deltaTime*.005;
    sea.mesh.rotation.z += game.speed*deltaTime;
    //sky.mesh.rotation.z += .01;
    //
    //
    if ( sea.mesh.rotation.z > 2*Math.PI)  sea.mesh.rotation.z -= 2*Math.PI;

    ambientLight.intensity += (.5 - ambientLight.intensity)*deltaTime*0.005;


    coinsHolder.rotateCoins(rocket1);
    ennemiesHolder.rotateEnnemies(rocket1);



    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}


function updateEnergy(){
    game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
    game.energy = Math.max(0, game.energy);
    energyBar.style.right = (100-game.energy)+"%";
    energyBar.style.backgroundColor = (game.energy<50)? "#f25346" : "#68c3c0";

    if (game.energy<30){
        energyBar.style.animationName = "blinking";
    }else{
        energyBar.style.animationName = "none";
    }

    if (game.energy <1){
        game.status = "gameover";
    }
}

function updateDistance() {
    game.distance +=  game.speed*deltaTime*game.ratioSpeedDistance;
    fieldDistance.innerHTML = Math.floor(game.distance);
    var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
    levelCircle.setAttribute("stroke-dashoffset", d);
}

function updateItem(object){

    game.planeSpeed = normalize(mousePos.x,-.5,.5,game.planeMinSpeed,game.planeMaxSpeed);

    var targetY = normalize(mousePos.y,-.75,.75,game.planeDefaultHeight - game.planeAmpHeight, game.planeDefaultHeight + game.planeAmpHeight);
    var targetX = normalize(mousePos.x,-1,1,-game.planeAmpWidth*.7, -game.planeAmpWidth);

    game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
    targetX += game.planeCollisionDisplacementX;

    game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
    targetY += game.planeCollisionDisplacementY;


    object.mesh.position.y += (targetY - object.mesh.position.y)*deltaTime*game.planeMoveSensivity;
    object.mesh.position.x += (targetX - object.mesh.position.x)*deltaTime*game.planeMoveSensivity;

    object.mesh.rotation.z = (targetY-object.mesh.position.y)*deltaTime*game.planeRotXSensivity;
    object.mesh.rotation.x = (object.mesh.position.y - targetY)*deltaTime*game.planeRotZSensivity;

    var targetCameraZ = normalize(game.planeSpeed,game.planeMinSpeed,game.planeMaxSpeed,game.cameraNearPos,game.cameraFarPos);
    camera.fov = normalize(mousePos.x,-1,1,40,80);
    camera.updateProjectionMatrix();
    camera.position.y += (object.mesh.position.y - camera.position.y)*deltaTime*game.cameraSensivity;

    game.planeCollisionSpeedX += (0-game.planeCollisionSpeedX)*deltaTime * 0.03;
    game.planeCollisionDisplacementX += (0-game.planeCollisionDisplacementX)*deltaTime *0.01;
    game.planeCollisionSpeedY += (0-game.planeCollisionSpeedY)*deltaTime * 0.03;
    game.planeCollisionDisplacementY += (0-game.planeCollisionDisplacementY)*deltaTime *0.01;

}

function normalize(v,vmin,vmax,tmin, tmax) {
    var nv = Math.max(Math.min(v,vmax), vmin);
    var dv = vmax-vmin;
    var pc = (nv-vmin)/dv;
    var dt = tmax-tmin;
    var tv = tmin + (pc*dt);
    return tv;
}


var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;

function init(event) {


     fieldDistance = document.getElementById("distValue");
     energyBar = document.getElementById("energyBar");
     replayMessage = document.getElementById("replayMessage");
     fieldLevel = document.getElementById("levelValue");
     levelCircle = document.getElementById("levelCircleStroke");



    resetGame();
    createScene();
    createLights();
    createTerrain();
    createSaturnSystem();
    createASystem();
    createCactus();
    // createGaxlaxy();
    //createBeautySystem();
    //createCharacter();
    //createPlane();
    createRocket();
    createFly();
    createSea();
    createSky();
    //createSmoke();
    createBirds();
    createCoins();
    createEnnemies();
    createParticles();


    document.addEventListener('mousemove', handleMouseMove, false);

    loop();
}

var mousePos = {x:0,y:0};

function handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH)*2;

    var ty = 1 - (event.clientY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}

window.addEventListener('load',init,false);