var centArr = [];
var objArr = [];
var nCent;
var canvas;
var dia;
var selBg, selColor, selNum;    //セレクトボックス
var none;   //画面をリセットしたときだけtrueになる

function setup() {
    //準備
    canvas = createCanvas(1920, 1080);
    background(255);
    colorMode(HSB);
    frameRate(1);
    dia = dist(0, 0, width, height);
    let centerWidth = document.getElementsByClassName('wrapper')[0].clientWidth;
    let centerHeight = document.getElementsByClassName('wrapper')[0].clientHeight;
    let scale = min(centerWidth / 1920, centerHeight / 1080);
    let scaledWidth = min(scale * 1920, centerWidth);
    let scaledHeight = min(scale * 1080, centerHeight);
    canvas.style('width', String(scaledWidth)+'px');
    canvas.style('height', String(scaledHeight)+'px');
    canvas.parent("P5Canvas");
    //UIの配置
    //ボタン
    var butPosX = (windowWidth - scaledWidth) / 2;
    var butPosY = 104 + scaledHeight;
    var buttonNameArray = ['Start', 'Pause', 'Reset', 'Save'];
    var buttonFuncArray = [start, pause, reset, saveImg];
    for (let i = 0; i < buttonNameArray.length; i++)
    {
        let b = createButton(buttonNameArray[i]);
        b.style("width", "55px");
        b.position(butPosX + i*65, butPosY);
        b.mousePressed(buttonFuncArray[i]);
    }
    //セレクトボックス
    var selPosX = butPosX;
    var selPosY = butPosY + 35;
    let KeyArray = [
        ['white', 'black'], 
        ['color', 'red', 'green', 'blue'],
        ['0', '1', '2', '3', '5', '100']
    ];
    let ValueArray = [
        [100, 0],
        [-1, 0, 120, 240],
        [0, 1, 2, 3, 5, 100]
    ];
    let SelArray = [];
    for (let i = 0; i < KeyArray.length; i++) {
        var sel = createSelect();
        sel.position(selPosX + 65*i, selPosY);
        for (let j = 0; j < KeyArray[i].length; j++) {
            sel.option(KeyArray[i][j], ValueArray[i][j]);
        }
        SelArray.push(sel);
    }
    selBg = SelArray[0];
    selColor = SelArray[1];
    selNum = SelArray[2];
    selNum.selected(2);

    init();
}
//描画の際に一番最初に動く関数
function init() {
    fill(0, 0, selBg.value());
    rect(0, 0, width, height);
    centArr = [];
    objArr = [];
    initCent();
    initObj();
}

function draw() {
    none = false;
    for (let i = 0; i < objArr.length; i++) {
        o = objArr[i];
        o.step();
    }
}


function initCent() {   //重心を決める
    nCent = Number(selNum.value())
    for (let i = 0; i < nCent; i++) {
        let p = new Cent();
        centArr.push(p);
    }
}

function initObj() {    //物体を決める
    let initValue = random();   //描画startするたびに色を変えるための乱数
    for (let x = 0; x <= width; x += 10) {
        for (let y = 0; y <= height; y += 10) {
            let o = new Obj(x, y, initValue);
            objArr.push(o);
        }
    }
}

class Cent {    //重心の定義
  constructor() {
      this.x = random(width);
      this.y = random(height);
  }
}

class Obj { //物体のクラス
  constructor(a, b, v) {
      let hueValue = Number(selColor.value());  //軌跡の色相，-1ならカラフル
      this.weightArr = [];
      this.x = a;
      this.y = b;
      let ang = random(2 * PI);
      this.v = createVector(cos(ang), sin(ang));    //初期は大きさ1の速度
      for (let i = 0; i < nCent; i++) {       //重心の強さは，物体ごとに変える
          this.weightArr.push(random(1));
      }
      var factor;
      if (hueValue == -1) {
        factor = (noise(this.x / width, this.y / height) - v) * 360;    //色(カラフル)
      }
      else {
        factor = (noise(this.x * 3 / width, this.y * 3 / height) - v) * 60 + hueValue;
      }
      if (factor > 360) {
        factor -= 360;
      }
      if (factor < 0) {
        factor += 360;
      }
      this.c = color(int(factor), 100, 100);
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