/**
 * Created by stanforxc on 17-5-10.
 */
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container,clock;

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };


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
var hemisphereLight, shadowLight;
function createLights() {

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
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


var Naruto = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'Naruto';
    this.angleHair = 0;


    //身体
    var bodyGeom = new THREE.BoxGeometry(15,15,15);
    var bodyMat = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        shading:THREE.FlatShading
    });
    var body = new THREE.Mesh(bodyGeom,bodyMat);
    body.position.set(2,-12,0);
    this.mesh.add(body);


    //脸
    var faceGeom = new THREE.BoxGeometry(10,10,10);
    var faceMat = new THREE.MeshLambertMaterial({
       color: Colors.pink

    });
    var face = new THREE.Mesh(faceGeom,faceMat);
    this.mesh.add(face);


    //头发
    var hairGeom = new THREE.BoxGeometry(4,4,4);
    var hairMat = new THREE.MeshLambertMaterial({
        color: Colors.brown
    });
    var hair = new THREE.Mesh(hairGeom,hairMat);
    hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
    var hairs = new THREE.Object3D();


    this.hairsTop = new THREE.Object3D();

    for (var i=0; i < 12; ++i){
        var h = hair.clone();
        var col = i%3;
        var row = Math.floor(i/3);
        var startPosZ = -4;
        var startPosX = -4;
        h.position.set(startPosX + row*4,0,startPosZ + col*4);
        this.hairsTop.add(h);
    }

    hairs.add(this.hairsTop);

    var hairSideGeom = new THREE.BoxGeometry(12,4,2);
    hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
    var hairSideR = new THREE.Mesh(hairSideGeom,hairMat);
    var hairSideL = hairSideR.clone();
    hairSideR.position.set(8,-2,6);
    hairSideR.position.set(8,-2,-6);
    hairs.add(hairSideR);
    hairs.add(hairSideL);

    var hairBackGeom = new THREE.BoxGeometry(2,8,10);
    var hairBack = new THREE.Mesh(hairBackGeom,hairMat);
    hairBack.position.set(-1,-4,0);
    hairs.add(hairBack);
    hairs.position.set(-5,5,0);

    this.mesh.add(hairs);


    Naruto.prototype.updateHairs = function () {
        var hairs = this.hairsTop.children;

        var l = hairs.length;
        for(var i=0;i<l;i++){
            var h = hairs[i];
            h.scale.y = .75 + Math.cos(this.angleHair+i/3)*.25;
        }
        this.angleHair += 0.16;
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


Sky = function () {
    this.mesh = new THREE.Object3D();

    this.nClouds = 20;
    this.clouds = [];

    var stepAngle = Math.PI*2 / this.nClouds;

    for(var i=0; i<this.nClouds; i++){
        var c = new Cloud();
        this.clouds.push(c);

        var a = stepAngle*i;
        var h = 750 + Math.random()*200;

        c.mesh.position.y = Math.sin(a)*h;
        c.mesh.position.x = Math.cos(a)*h;

        c.mesh.rotation.Z = a + Math.PI/2;

        c.mesh.position.z = -400-Math.random()*400;

        var s = 1 + Math.random()*2;
        c.mesh.scale.set(s,s,s);

        this.mesh.add(c.mesh);
    }
};


//创建海
Sea = function () {
    var geom = new THREE.CylinderGeometry(600,600,1000,40,10);

    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    var mat = new THREE.MeshPhongMaterial({
        color:Colors.blue,
        transparent : true,
        opacity:1,
        shading:THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geom,mat);

    this.mesh.receiveShadow = true;
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

var airplane;
var sea;
var sky;
var smoke;
function createPlane() {
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25,.25,.25);
    airplane.mesh.position.y = 100;
    scene.add(airplane.mesh);
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
        bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

    }

}


function loop(){
    updatePlane();
    //smoke.update();
    updateBird();

    airplane.naruto.updateHairs();

    airplane.propeller.rotation.x += 0.3;
    sea.mesh.rotation.z += .005;
    sky.mesh.rotation.z += .01;

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function updatePlane(){
    var targetY = normalize(mousePos.y,-.75,.75,25, 175);
    var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
    airplane.mesh.position.y = targetY;
    airplane.mesh.position.x = targetX;
    airplane.propeller.rotation.x += 0.3;
}

function normalize(v,vmin,vmax,tmin, tmax) {
    var nv = Math.max(Math.min(v,vmax), vmin);
    var dv = vmax-vmin;
    var pc = (nv-vmin)/dv;
    var dt = tmax-tmin;
    var tv = tmin + (pc*dt);
    return tv;
}


function init(event) {
    document.addEventListener('mousemove',handleMouseMove,false);
    createScene();
    createLights();
    createPlane();
    createSea();
    createSky();
    //createSmoke();
    createBirds();
    loop();
}

var mousePos = {x:0,y:0};

function handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH)*2;

    var ty = 1 - (event.clientY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}



window.addEventListener('load',init,false);