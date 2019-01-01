function ModernCity() {
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

  //楼房
  var buildingMesh=new THREE.Mesh(cube);

  //城市
  var cityGeometry=new THREE.Geometry();

  for (var i = 0; i < 2000; i++) {
    //随机选取初始坐标
    buildingMesh.position.x=Math.floor(Math.random()*100-50)*10;//在-1000到1000之间
    buildingMesh.position.z=Math.floor(Math.random()*100-50)*10;

    //随机初始化旋转方向
    buildingMesh.rotation.y=Math.random()*Math.PI*2;

    //随机初始化楼房大小
    buildingMesh.scale.x=Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
    buildingMesh.scale.y=(Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
    buildingMesh.scale.z=buildingMesh.scale.x;

    //随机初始化楼房的颜色
    var value=1-Math.random()*Math.random();
    var basicColor=new THREE.Color().setRGB(value+0.1*Math.random(),value,value+0.1*Math.random());

    //逐面添加颜色
    var geometry=buildingMesh.geometry;
    for (var j=0, jmax=geometry.faces.length; j<jmax; j++){
      geometry.faces[j].vertexColors = [basicColor, basicColor, basicColor];
    }

    //将楼房加入城市
    buildingMesh.updateMatrix();
    cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
  }

  // 生成纹理
  var texture=new THREE.Texture(generateTextureCanvas());
  texture.anisotropy=renderer.getMaxAnisotropy();
  texture.needsUpdate=true; //在下次使用纹理时触发一次更新

  //建立城市
  var material=new THREE.MeshLambertMaterial({map:texture, vertexColors: THREE.VertexColors});
  var mesh=new THREE.Mesh(cityGeometry,material);
  return mesh;
}

function generateTextureCanvas() {
  var canvas = document.createElement('canvas');
  canvas.width=32;
  canvas.height=64;

  var context = canvas.getContext('2d');
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
