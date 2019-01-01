function ModernCity () {
  var cube=new THREE.CubeGeometry(1,1,1);
  cube.applyMatrix(new THREE.Matrix4().makeTranslation(0,0.5,0));   //将参考点设置在立方体的底部
  cube.faces.splice(6, 2);   //去掉立方体的底面
  cube.faceVertexUvs[0].splice(6, 2);
  //去掉顶面的纹理
  cube.faceVertexUvs[0][4][0].set(0, 0);
  cube.faceVertexUvs[0][4][1].set(0, 0);
  cube.faceVertexUvs[0][4][2].set(0, 0);

  cube.faceVertexUvs[0][5][0].set(0, 0);
  cube.faceVertexUvs[0][5][1].set(0, 0);
  cube.faceVertexUvs[0][5][2].set(0, 0);

  var buildingMesh=new THREE.Mesh(cube);

  //楼房
  var buildingMaxW=15;
  var buildingMaxD=15;

  //社区
  var blockNumX=10;
  var blockNumZ=10;
  var blockSizeX=50;
  var blockSizeZ=50;
  var blockDensity= 20;

  //街道
  var roadW=8;
  var roadD=8;

  //人行道
  var sidewayW=2;
  var sidewayH=0.1;
  var sidewayD=2;

  // 生成纹理
  var buildingTexture=new THREE.Texture(generateTextureCanvas());
  buildingTexture.anisotropy=renderer.getMaxAnisotropy();
  buildingTexture.needsUpdate=true; //在下次使用纹理时触发一次更新

  //建立城市
  var object=new THREE.Object3D();

  var groundMesh=createSquareGround();
  object.add(groundMesh);

  // var sidewayMesh=createSquareSideWay();
  // object.add(sidewayMesh);
  //
  var buildingsMesh=createSquareBuildings();
  object.add(buildingsMesh);

  return object;

  function createSquareGround() {
    //建立地面
    var geometry=new THREE.PlaneGeometry(2,2,2);
    var material=new THREE.MeshLambertMaterial({color:0x222222});
    var ground=new THREE.Mesh(geometry,material);
    ground.rotation.x = (-90 * Math.PI) / 180;
    ground.scale.x=blockNumX*blockSizeX;
    ground.scale.y=blockNumZ*blockSizeZ;
    ground.rotation.x = (-90 * Math.PI) / 180;
    ground.receiveShadow=true;
    return ground;
  }

  // function createSquareSideWay() {
  //   var sidewayGeometry=new THREE.Geometry();
  //   for(var i=0;i<blockNumZ;i++){
  //     for(var j=0;j<blockNumX;j++){
  //       for(var k=0;k<blockDensity;k++){
  //         //随机选取初始坐标
  //         buildingMesh.position.x=(i+0.5-blockNumX/2)*blockSizeX;
  //         buildingMesh.position.z=(j+0.5-blockNumZ/2)*blockSizeZ;
  //         buildingMesh.position.x=buildingMesh.position.x+(j+0.5-blockNumX/2)*blockSizeX;
  //         buildingMesh.position.z=buildingMesh.position.z+(i+0.5-blockNumZ/2)*blockSizeZ;
  //
  //         //随机初始化大小
  //         buildingMesh.scale.x=blockSizeX-roadW;
  //         buildingMesh.scale.y=sidewayH;
  //         buildingMesh.scale.z=blockSizeZ-roadD;
  //
  //         //加入城市
  //         buildingMesh.updateMatrix();
  //         sidewayGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
  //       }
  //     }
  //   }
  //   var material=new THREE.MeshLambertMaterial();
  //   material.color=0x444444;
  //   var sidewayMesh=new THREE.Mesh(sidewayGeometry,material);
  //   return sidewayMesh;
  //
  // }
  
  function createSquareBuildings() {
    //建立楼房
    var cityGeometry=new THREE.Geometry();

    for(var i=0;i<blockNumZ;i++){
      for(var j=0;j<blockNumX;j++){
        for(var k=0;k<blockDensity;k++){
          //随机选取楼房初始坐标
          buildingMesh.position.x=Math.floor(Math.random()-0.5)*(blockSizeX-buildingMaxW-roadW-sidewayW);//在-1000到1000之间
          buildingMesh.position.z=Math.floor(Math.random()-0.5)*(blockSizeZ-buildingMaxD-roadD-sidewayD);
          buildingMesh.position.x=buildingMesh.position.x+(j+0.5-blockNumX/2)*blockSizeX;
          buildingMesh.position.z=buildingMesh.position.z+(i+0.5-blockNumZ/2)*blockSizeZ;

          //随机初始化楼房大小
          buildingMesh.scale.x=Math.min(Math.random() * Math.random()* 5 + 10, buildingMaxW);
          buildingMesh.scale.y=(Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 3 + 8;
          buildingMesh.scale.z=Math.min(buildingMesh.scale.x,buildingMaxD);

          //随机初始化楼房的颜色
          var value=1-Math.random()*Math.random();
          var basicColor=new THREE.Color().setRGB(value+0.2*Math.random(),value,value+0.2*Math.random());

          //逐面添加颜色
          var geometry=buildingMesh.geometry;
          for (var j=0, jmax=geometry.faces.length; j<jmax; j++){
            geometry.faces[j].vertexColors = [basicColor, basicColor, basicColor];
          }

          //将楼房加入城市
          buildingMesh.updateMatrix();
          cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
        }
      }
    }
    var material=new THREE.MeshLambertMaterial();
    material.map=buildingTexture;
    material.vertexColors=THREE.VertexColors;
    var cityMesh=new THREE.Mesh(cityGeometry,material);
    return cityMesh;
  }
}


function generateTextureCanvas(){
  var canvas = document.createElement('canvas');
  canvas.width=32;
  canvas.height=64;
  var context=canvas.getContext( '2d' );
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, 32, 64);

  //画窗户
  for(var y=2;y<64;y+=2){
    for(var x=0;x<32;x+=2){
      var value=Math.floor(Math.random()*64);
      context.fillStyle='rgb('+[value,value,value].join(',')+')';
      context.fillRect(x,y,2,1);
    }
  }

  var canvas2=document.createElement('canvas');
  canvas2.width=512;
  canvas2.height=1024;
  var context=canvas2.getContext('2d');

  context.imageSmoothingEnabled=false;
  context.webkitImageSmoothingEnabled=false;
  context.mozImageSmoothingEnabled=false;

  context.drawImage(canvas,0,0,canvas2.width,canvas2.height);
  return canvas2;
}
