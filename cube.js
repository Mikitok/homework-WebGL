var renderer;
var camera;
var scene;
var light;
var city;
var plane;
var controls;
var updateFcts	= [];

function main() {
    initScene();
    initRenderer();
    initCamera();
    initLight();
    initObject();
    initControl();
    updateFcts.push(function() {renderer.render(scene, camera)});

    var lastTimeMsec = null;
    requestAnimationFrame(function animate(nowMsec) {
        requestAnimationFrame(animate);
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        updateFcts.forEach(function(updateFn) {updateFn(deltaMsec / 1000, nowMsec / 1000)});
    });
}

function initScene(){
    scene=new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025);

    var path = '../homework/img/';
    var urls = [
        path + 'right.jpg', path + 'left.jpg',
        path + 'top.jpg', path + 'bottom.jpg',
        path + 'front.jpg', path + 'back.jpg'
    ];
    var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
    var materialArray = [];
    for (var i = 0; i < 6; i++){
        material=new THREE.MeshBasicMaterial();
        material.map=THREE.TextureLoader(urls[i]);
        material.side=THREE.BackSide;
        materialArray.push(material);
    }
    var skyMaterial = new THREE.MultiMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add( skyBox );
}

function initRenderer() {
    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    // 设置渲染器的大小为窗口的内宽度，也就是内容区的宽度
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);  //渲染器renderer的domElement元素，表示渲染器中的画布
    //renderer.setClearColor(0xffffff,1,0)
}

function initCamera() {
    // 相机（透视相机）
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.01,2000);
    camera.position.x = 0;
    camera.position.y = 80;
    camera.position.z = 0;
    //camera.lookAt(new THREE.Vector3(0,0,0));
}

function initLight() {
    // 环境光，(color, groundcolor, intensity, position, visible)
    light=new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    light.position.set(0.75, 1, 0.25);
    scene.add(light);

    var spotLight=new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 100, 15);
    spotLight.castShadow=true;
    scene.add(spotLight);

}

function initObject() {
    var material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    var geometry = new THREE.PlaneGeometry(2000, 2000);
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = (-90 * Math.PI) / 180;
    //plane.castShadow=true;
    plane.receiveShadow=true;
    scene.add(plane);

    city=new THREEx.ModernCity();
    city.castShadow=true;
    city.receiveShadow=true;
    scene.add(city);
}

function initControl() {
    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.05;
    controls.lookVertical = true;
    updateFcts.push(function(delta, now) {controls.update(delta)});
}


