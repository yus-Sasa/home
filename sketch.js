var centArr = [];
var objArr = [];
var nCent = 2;
var dia;

function setup() {
    var canvas = createCanvas(1920, 1080);
    background(255);
    colorMode(HSB, 1);
    frameRate(1);
    initCent();
    initObj();
    dia = dist(0, 0, width, height);
    var button = createButton('Start');
    button.position(15, 19);
    button.mousePressed(changeRate);

    let scale = min(windowWidth / 1920, windowHeight / 1080);
    let scaledWidth = min(scale * 1920, windowWidth);
    let scaledHeight = min(scale * 1080, windowHeight);
    canvas.style('width', String(scaledWidth)+'px');
    canvas.style('height', String(scaledHeight)+'px');
    canvas.parent("P5Canvas");
  }
   
function draw() {
    for (let i = 0; i < objArr.length; i++) {
        o = objArr[i];
        o.step();
    }
    //if (frameCount == 5) {
    //    save("force5.png");        
    //}
}



function initCent() {   //重心を決める
    for (let i = 0; i < nCent; i++) {
        let p = new Cent();
        centArr.push(p);
    }
}

function initObj() {
  for (let x = 0; x <= width; x += 10) {
      for (let y = 0; y <= height; y += 10) {
          let o = new Obj(x, y);
          objArr.push(o);
      }
  }
}

class Cent {
  constructor() {
      this.x = random(width);
      this.y = random(height);
  }
}

//物体のクラス
class Obj {
  constructor(a, b) {
      this.weightArr = [];
      this.x = a;
      this.y = b;
      let ang = random(2 * PI);
      this.v = createVector(cos(ang), sin(ang));    //大きさ1の速度
      for (let i = 0; i < nCent; i++) {       //重心の強さは，物体ごとに変える
          this.weightArr.push(random(1));
      }
      var factor = noise(this.x / width, this.y / height);    //色
      this.c = color(factor, 1, 1);
  }

  step() {
      for (let j = 0; j < nCent; j++) {   //加速度のようなもの
          let deltaX = centArr[j].x - this.x;
          let deltaY = centArr[j].y - this.y;
          let f = createVector(deltaX, deltaY);
          f.normalize();
          let d = dist(this.x, this.y, centArr[j].x, centArr[j].y);
          let rate = sqrt(dia / d) * this.weightArr[j];  //距離が近いほど加速度が強い
          f.mult(rate);
          this.v.add(f);
      }
      let move = createVector(0, 0);   //物体が動くのは，上下左右のうち一方向
      if (abs(this.v.x) > abs(this.v.y)) {
          move.x = this.v.x;
      }
      else {
          move.y = this.v.y;
      }
      strokeWeight(1 + 1.0 / move.mag());
      stroke(this.c);
      line(this.x, this.y, this.x + move.x, this.y + move.y);
      this.x = this.x + move.x;
      this.y = this.y + move.y;
  }
}
