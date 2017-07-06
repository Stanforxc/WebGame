/**
 * Created by stanforxc on 17-5-21.
 */
Rocket = function(){

    this.mesh = new THREE.Object3D();
    this.rocketTween = TweenMax.set(this.mesh.position, {x:100});

    this.bodyMat = new THREE.MeshLambertMaterial ({
        color: 0x1d836a,
        wireframe: false,
        shading:THREE.FlatShading
    });
    this.ringMat = new THREE.MeshLambertMaterial ({
        color: 0x3a1b19,
        wireframe: false,
        shading:THREE.FlatShading
    });
    this.metalMat = new THREE.MeshLambertMaterial ({
        color: 0x81878d,
        wireframe: false,
        shading:THREE.FlatShading
    });
    var footGeom = new THREE.BoxGeometry(30, 10, 30);

    this.top = new THREE.Object3D();
    this.mid = new THREE.Object3D();
    this.bot = new THREE.Object3D();
    this.engine = new THREE.Object3D();
    this.legs = new THREE.Object3D();

    this.bodyTopRing = makeCylinder(35, 35, 10, 10, 1, this.ringMat);
    this.bodyTopRing.position.y = 0;


    this.bodyTopBase = makeCylinder(25, 30, 10, 10, 1, this.bodyMat);
    this.bodyTopBase.position.y = 10;

    this.bodyTop = makeCylinder(5, 25, 30, 10, 1, this.bodyMat);
    this.bodyTop.position.y = 30;

    this.bodyTopNippleBase = makeCylinder(5, 5, 5, 10, 1, this.ringMat);
    this.bodyTopNippleBase.position.y = 47;

    this.bodyTopNipple = makeCylinder(2, 5, 5, 10, 1, this.ringMat);
    this.bodyTopNipple.position.y = 52;

    this.bodyTopAntenna = makeCylinder(1, 1, 25, 5, 1, this.ringMat);
    this.bodyTopAntenna.position.y = 63;

    this.bodyTopAntennaBall = new THREE.Mesh(new THREE.SphereGeometry( 2, 20, 10 ), this.ringMat);
    this.bodyTopAntennaBall.position.y = 76;

    this.top.add(this.bodyTopRing);
    this.top.add(this.bodyTopBase);
    this.top.add(this.bodyTop);
    this.top.add(this.bodyTopNippleBase);
    this.top.add(this.bodyTopNipple);
    this.top.add(this.bodyTopAntenna);
    this.top.add(this.bodyTopAntennaBall);

    this.bodyMidRing = makeCylinder(87, 87, 12, 12, 1, this.ringMat);
    this.bodyMidRing.position.y = 0;
    this.bodyMidBase = makeCylinder(60, 80, 50, 12, 1, this.bodyMat);
    this.bodyMidBase.position.y = 31;

    this.bodyMid = makeCylinder(30, 60, 120, 12, 1, this.bodyMat);
    this.bodyMid.position.y = 116;

    this.mid.add(this.bodyMid);
    this.mid.add(this.bodyMidBase);
    this.mid.add(this.bodyMidRing);
    this.bodyBotRing = makeCylinder(45, 45, 5, 12, 1, this.ringMat);
    this.bodyBotRing.position.y = 0;
    this.bodyBot = makeCylinder(80, 45, 25, 12, 1, this.bodyMat);
    this.bodyBot.position.y = 15;
    this.bot.add(this.bodyBotRing);
    this.bot.add(this.bodyBot);

    this.bodyEngineTop = makeCylinder(45, 50, 5, 12, 1, this.bodyMat);
    this.bodyEngineTop.position.y = 0;
    this.bodyEngineRingTop =  makeCylinder(55, 50, 10, 12, 1, this.ringMat);
    this.bodyEngineRingTop.position.y = -8;
    this.bodyEngineMid = makeCylinder(45, 45, 10, 8, 1, this.bodyMat);
    this.bodyEngineMid.position.y = -18;
    this.bodyEngineRingBot =  makeCylinder(50, 40, 10, 12, 1, this.ringMat);
    this.bodyEngineRingBot.position.y = -28;
    this.bodyEngineNozzle =  makeCylinder(45, 55, 25, 12, 1, this.metalMat);
    this.bodyEngineNozzle.position.y = -44;
    this.bodyEngineNozzleEnd =  makeCylinder(60, 60, 5, 12, 1, this.metalMat);
    this.bodyEngineNozzleEnd.position.y = -59;

    this.engine.add(this.bodyEngineTop);
    this.engine.add(this.bodyEngineRingTop);
    this.engine.add(this.bodyEngineMid);
    this.engine.add(this.bodyEngineRingBot);
    this.engine.add(this.bodyEngineNozzle);
    this.engine.add(this.bodyEngineNozzleEnd);

    this.legA =  makeCylinder(5, 5, 170, 6, 1, this.ringMat);
    this.legA.position.set(0,0,-75);
    this.legA.rotation.x = 20 * Math.PI / 180;
    this.legB =  makeCylinder(5, 5, 170, 6, 1, this.ringMat);
    this.legB.position.set(75,0,0);
    this.legB.rotation.z = 20 * Math.PI / 180;
    this.legY =  makeCylinder(5, 5, 170, 6, 1, this.ringMat);
    this.legY.position.set(0,0,75);
    this.legY.rotation.x = -20 * Math.PI / 180;
    this.legZ =  makeCylinder(5, 5, 170, 6, 1, this.ringMat);
    this.legZ.position.set(-75,0,0);
    this.legZ.rotation.z = -20 * Math.PI / 180;

    this.legs.add(this.legA);
    this.legs.add(this.legB);
    this.legs.add(this.legZ);
    this.legs.add(this.legY);

    this.legASock =  makeCylinder(6, 6, 50, 6, 1, this.metalMat);
    this.legASock.position.set(0,-37,-89);
    this.legASock.rotation.x = 20 * Math.PI / 180;

    this.legBSock =  makeCylinder(6, 6, 50, 6, 1, this.metalMat);
    this.legBSock.position.set(89,-37,0);
    this.legBSock.rotation.z = 20 * Math.PI / 180;

    this.legYSock =  makeCylinder(6, 6, 50, 6, 1, this.metalMat);
    this.legYSock.position.set(0,-37,89);
    this.legYSock.rotation.x = -20 * Math.PI / 180;

    this.legZSock =  makeCylinder(6, 6, 50, 6, 1, this.metalMat);
    this.legZSock.position.set(-89,-37,0);
    this.legZSock.rotation.z = -20 * Math.PI / 180;

    this.legs.add(this.legASock);
    this.legs.add(this.legBSock);
    this.legs.add(this.legYSock);
    this.legs.add(this.legZSock);

    this.legAFoot = new THREE.Mesh(footGeom, this.metalMat);
    this.legAFoot.position.set(0,-45,0);
    this.legAFoot.rotation.x = -20 * Math.PI / 180;

    this.legBFoot = new THREE.Mesh(footGeom, this.metalMat);
    this.legBFoot.position.set(0,-45,0);
    this.legBFoot.rotation.z = -20 * Math.PI / 180;

    this.legYFoot = new THREE.Mesh(footGeom, this.metalMat);
    this.legYFoot.position.set(0,-45,0);
    this.legYFoot.rotation.x = 20 * Math.PI / 180;

    this.legZFoot = new THREE.Mesh(footGeom, this.metalMat);
    this.legZFoot.position.set(0,-45,0);
    this.legZFoot.rotation.z = 20 * Math.PI / 180;

    this.legASock.add(this.legAFoot);
    this.legBSock.add(this.legBFoot);
    this.legYSock.add(this.legYFoot);
    this.legZSock.add(this.legZFoot);

    this.windowXTop = makeCylinder(14, 14, 2, 10, 1, this.ringMat);
    this.windowXTop.position.set(0,-45,57);
    this.windowXTop.rotation.x = 75 * Math.PI / 180;

    this.windowXInnerTop = makeCylinder(9, 9, 2, 10, 1, this.metalMat);
    this.windowXInnerTop.position.set(0,2,0);

    this.windowXBot = makeCylinder(12, 12, 2, 10, 1, this.ringMat);
    this.windowXBot.position.set(0,0,46);
    this.windowXBot.rotation.x = 75 * Math.PI / 180;

    this.windowXInnerBot = makeCylinder(7, 7, 2, 10, 1, this.metalMat);
    this.windowXInnerBot.position.set(0,2,0);

    this.windowXTop.add(this.windowXInnerTop);
    this.windowXBot.add(this.windowXInnerBot);
    this.bodyMid.add(this.windowXTop);
    this.bodyMid.add(this.windowXBot);

    this.top.position.y = 170   ;
    this.mid.position.y = 0;
    this.bot.position.y = -33   ;
    this.engine.position.y = -38   ;
    this.legs.position.y = -40   ;

    this.mesh.add(this.top);
    this.mesh.add(this.mid);
    this.mesh.add(this.bot);
    this.mesh.add(this.engine);
    this.mesh.add(this.legs);

};

function makeCylinder(radiusTop, radiusBottom, height, radiusSegments, heightSegments, mat) {
    var geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments);
    var mesh = new THREE.Mesh(geom, mat);
    return mesh;
}