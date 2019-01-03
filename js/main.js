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

    let lastTimeMsec = null;
    requestAnimationFrame(function animate(nowMsec) {
        requestAnimationFrame(animate);
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        let deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        updateFcts.forEach(function(updateFn) {updateFn(deltaMsec / 1000, nowMsec / 1000)});
    });
}

function initScene(){
    scene=new THREE.Scene();
    scene.fog= new THREE.FogExp2( 0xd0e0f0, 0.004 );
}

function initRenderer() {
    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialiasing: true });
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.setClearColor(0xE1FFFF,1.0);
    // 设置渲染器的大小为窗口的内宽度，也就是内容区的宽度
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);  //渲染器renderer的domElement元素，表示渲染器中的画布
}

function initCamera() {
    // 相机（透视相机）
    camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.01,2000);
    camera.position.x = 0;
    camera.position.y = 50;
    camera.position.z = 30;
}

function initLight() {
    light=new THREE.AmbientLight( 0x404040 );

    scene.add(light);

    let spotLight=new THREE.SpotLight(0xffffcc);
    spotLight.position.set(200, 150, 0);
    spotLight.castShadow=true;
    scene.add(spotLight);

    let geometry = new THREE.SphereGeometry( 5, 32, 32 );
    let material = new THREE.MeshBasicMaterial( {color: 0xCC0000} );
    let sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(200, 150, 0);
    scene.add(sphere);
}

function initObject() {
    city=new ModernCity();
    city.castShadow=true;
    city.receiveShadow=true;
    scene.add(city);
}

function initControl() {
    controls = new Control(camera);
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.05;
    controls.lookVertical = true;
    updateFcts.push(function(delta, now) {controls.update(delta)});
}


