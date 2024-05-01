
let jsonData;
let img = [];
var easycam;
let cantUsers = ejsData.cantUsuarios

function setup() { 
  const lienzo = createCanvas(windowWidth - 100, windowHeight - 100, WEBGL);  // Guardamos el objeto del canvas para modificarlo.
  lienzo.parent('contenedor-canvas'); 
  //print(jsonData);  // PROBLEMA, ATENCIÓN: El tipo de dato es un objeto con tantos índices como entradas en la base de datos, 0, 1, 2, ...
 
  setAttributes('antialias', true);

  // define initial state
  var state = {
    distance : 200,
    // rotation : Dw.Rotation.create({angles_xyz:[0, 0, 0]}),
  };
  
  easycam = new Dw.EasyCam(this._renderer, state);
  
  // slower transitions look nicer in the ortho mode
  easycam.setDefaultInterpolationTime(2000); //slower transition
  // start with an animated rotation with 2.5 second transition time
  easycam.setRotation(Dw.Rotation.create({angles_xyz:[PI/2, PI/2, PI/2]}), 2500);
  easycam.setDistance(400, 2500);


} 


function windowResized() {
  resizeCanvas(windowWidth - 100, windowHeight - 100);
  easycam.setViewport([0,0,windowWidth - 100, windowHeight - 100]);
}


function draw(){

  //let cantUsuarios = ejsData.cantUsuarios

  
  // projection
  var cam_dist = easycam.getDistance();
  var oscale = cam_dist * 0.001;
  var ox = width  / 2 * oscale;
  var oy = height / 2 * oscale;
  ortho(-ox, +ox, -oy, +oy, -10000, 10000);
  easycam.setPanScale(0.004 / sqrt(cam_dist));
  
  // BG
	background(20,250);
  noStroke();
  
  let sphereX = 0;
  let sphereY = 0;
  let sphereZ = 0;

  ambientLight(250);

  // Posición de la luz puntual en relación con la esfera
  let lightX = sphereX + cos(frameCount * 0.01) * 200;
  let lightY = sphereY + sin(frameCount * 0.01) * 200;
  let lightZ = sphereZ + cos(frameCount * 0.01) * 200;

  pointLight(30, 0, 255, lightX, lightY, lightZ);

  let online = users;

  // objects
  noStroke();
  randomSeed(2);
  for(var i = 0; i < cantUsers * 4; i++){

    var m = 180;
    var tx = random(-m, m);
    var ty = random(-m, m);
    var tz = random(-m, m);

    var r = ((tx / m) * 0.5 + 0.5) * 255;
    var g = ((ty / m) * 0.5 + 0.5) * r/20;
    var b = ((tz / m) * 0.5 + 0.5) * g;
 
    push();
      rotateX(frameCount * .001)
      rotateY((frameCount * .002) / 3)
      rotateZ(frameCount * .003)
      translate(tx, ty, tz);
      ambientMaterial(r,g,b);

      if(online > i){
        ambientMaterial(180);
        ambientLight(0,250,30);
      }

      box(random(10,40));
    pop();

    push()
      rotateX(millis() * .001)
      rotateY((millis() * .001) / 4)
      rotateZ(millis() * .001)
      translate(tx * 2, ty * 2, tz);
      cylinder(2, 5);
    pop()
  }
  
  push();
    emissiveMaterial(130, 230, 0);
    translate(sphereX, sphereY, sphereZ);
    sphere(15);
  pop();

}

document.oncontextmenu = function () {
  return false;
};