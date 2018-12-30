main();

function main() {
  // 获取 canvas 的引用
  const canvas=document.querySelector('#glcanvas');
  //传递一个"webgl"字符串
  const gl=canvas.getContext('webgl');

  //如果浏览器不支持webgl,getContext将会返回null
  if(!gl){
    alert('Unable to initialize Webgl.');
    return;
  }

  //顶点着色器
  const vsSource = `
    attribute vec4 aVertexPosition; 
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

  //片元着色器
  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  //查找WebGL返回分配的输入位置
  const shaderProgram=initShaderProgram(gl,vsSource,fsSource);
  const programInfo={
    program: shaderProgram,
    attribLovations:{
      vertexPositon:gl.getAttribLocation(shaderProgram,'aVertexPosition'),
    },
    uniformLocations:{
      projectionMatrix:gl.getUniformLocation(shaderProgram,'uProjectionMatrix'),
      modelViewMatrix:gl.getUniformLocation(shaderProgram,'uModelViewMatrix'),
    },
  };

  const buffers=intBuffers(gl);
  drawScene(gl, programInfo, buffers);

}

function intBuffers() {
  //得到了缓冲对象并存储在顶点缓冲器
  squareVerticsBuffer=gl.createBuffer();
  //绑定上下文
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticsBuffer);

  //记录每一个正方体的每一个顶点
  var vertics=[
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

  //转化为 WebGL 浮点型类型的数组，并将其传到 gl 对象的  bufferData() 方法来建立对象的顶点
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics),gl.STATIC_DRAW);
}

function drawScene() {
  gl.clearColor(0.0,0.0,0.0,1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  // 用背景色擦除上下文
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);



  //建立摄像机透视矩阵,设置45度的视图角度，并且宽高比设为 640/480（画尺寸）。 指定在摄像机距离0.1到100单位长度的范围内，物体可见。
  const fieldOfView=45 * Math.PI / 180;
  const aspect=gl.canvas.clientWidth.gl.canvas.clientHeight;
  const zNear=0.1;
  const zFar=100.0;
  const projectionMatrix=mat4.create();
  perspectiveMatrix=makePerspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  //加载特定位置
  const modelViewMatrix = mat4.create();

  //把正方形放在距离摄像机6个单位的的位置
  mat4.translate(modelViewMatrix,     // destination matrix
      modelViewMatrix,     // matrix to translate
      [-0.0, 0.0, -6.0]);

  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);


  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

//初始化着色器程序，让WebGL知道如何绘制我们的数据
function initShaderProgram(gl, vsSource, fsSource ) {
  const vertexShader= loadShader(gl,gl.VERTEX_SHADER);
  const fragmentShader=loadShader(gl,gl.FRAGMENT_SHADER);

  // 创建着色器程序
  const shaderProgram=gl.createProgram();
  gl.attachShader(shaderProgram,vertexShader);
  gl.attachShader(shaderProgram,fragmentShader);
  gl.linkProgram(shaderProgram);

  // 创建失败
  if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
    alert('Unable to initialize the shader program:'+gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

// 创建指定类型的着色器，上传source源码并编译
function loadShader(gl, type, source){
  //创建一个新的着色器
  const shader=gl.createShader(type);
  //将源代码发送到着色器
  gl.shaderSource(shader,source);
  //进行编译
  gl.compileShader(shader);
  //编译失败
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    alert('An error occurred compiling the shaders:'+gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
