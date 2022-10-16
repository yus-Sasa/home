var objArr;
var cent;
var canvas;
var dia;
var buttonArray = [];
var selBg, selColor;    //セレクトボックス
var hueValue;

function setup() {
    //準備
    canvas = createCanvas(1920, 1080);
    background(255);
    colorMode(HSB);
    frameRate(1);
    dia = dist(0, 0, width, height);
    canvas.parent("P5Canvas");
    //UIの配置
    //ボタン
    var buttonNameArray = ['Start', 'Pause', 'Reset', 'Save'];
    var buttonFuncArray = [start, pause, reset, saveImg];
    for (let i = 0; i < buttonNameArray.length; i++)
    {
        let b = createButton(buttonNameArray[i]);
        b.style("width", "55px");
        b.mousePressed(buttonFuncArray[i]);
        buttonArray.push(b);
    }
    //セレクトボックス
    let KeyArray = [
        ['white', 'black'], 
        ['color', 'red', 'green', 'blue'],
    ];
    let ValueArray = [
        [100, 0],
        [-1, -90, 30, 150],
    ];
    let SelArray = [];
    for (let i = 0; i < KeyArray.length; i++) {
        var sel = createSelect();
        for (let j = 0; j < KeyArray[i].length; j++) {
            sel.option(KeyArray[i][j], ValueArray[i][j]);
        }
        SelArray.push(sel);
    }
    selBg = SelArray[0];
    selColor = SelArray[1];
    selBg.changed(reDraw);
    selColor.changed(reDraw);
    hueValue = Number(selColor.value());  //軌跡の色相，-1ならカラフル
    windowResized();
    init();
}

function draw() {
    //質点の位置を変える
    cent.x = noise(frameCount) * width;
    cent.y = noise(frameCount) * height;
    //物体の軌跡を描画する
    for (let i = 0; i < objArr.length; i++) {
        o = objArr[i];
        o.step();
    }
}

//描画の際に一番最初に動く関数
function init() {
    fill(0, 0, selBg.value());
    rect(0, 0, width, height);
    initCent();
    initObj();
}
function initCent() {   //重心を決める
    cent = new Cent();
}
function initObj() {    //物体を決める
    objArr = [];
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
      this.x, this.y;
      this.weight = random(1);
  }
}

class Obj { //物体のクラス
  constructor(a, b, initValue) {
      let ang = random(2 * PI);
      this.v = createVector(cos(ang), sin(ang));    //初期速度は大きさ1
      this.xArr = [a];
      this.yArr = [b];
      this.initValue = initValue;
      this.c = color(this.calcColor(), 100, 100);
  }
  calcColor() { //軌跡の色を算出
      var factor;
      var a = this.xArr[0];
      var b = this.yArr[0];
      if (hueValue == -1) {
        factor = (noise(a / width, b / height) - this.initValue) * 360;    //色(カラフル)
      }
      else {
        factor = noise(a * 3 / width, b * 3 / height, this.initValue) * 180 + hueValue;
      }
      if (factor > 360) {
        factor -= 360;
      }
      if (factor < 0) {
        factor += 360;
      }
      return int(factor);
  }
  step() {  //1ステップでの処理...点の位置の記録と，描画
      //f...加速度のようなもの
      let deltaX = cent.x - this.xArr[this.xArr.length-1];
      let deltaY = cent.y - this.yArr[this.yArr.length-1];
      let f = createVector(deltaX, deltaY);
      let d = f.mag();
      f.normalize();    //加速度の方向
      let rate = sqrt(dia / d) * cent.weight;  //距離が近いほど加速度が強い
      f.mult(rate);
      this.v.add(f);    //速度に加算
      let move = createVector(0, 0);   //物体が動くのは，上下左右のうち一方向に限定
      if (abs(this.v.x) > abs(this.v.y)) {
          move.x = this.v.x;
      }
      else {
          move.y = this.v.y;
      }
      //配列へ保存
      this.xArr.push(this.xArr[this.xArr.length - 1] + move.x);
      this.yArr.push(this.yArr[this.yArr.length - 1] + move.y);
      //1ステップ描画
      stroke(this.c);
      let weightFactor = move.mag();
      strokeWeight(1 + 1.0 / abs(weightFactor));
      line(this.xArr[this.xArr.length-2], this.yArr[this.yArr.length-2], this.xArr[this.xArr.length-1], this.yArr[this.yArr.length-1]);
  }
  drawMe() {    //過去の分もすべて描画し直す
      stroke(this.c);
      for (let i = 1; i < this.xArr.length; i++)
      {
          let weightFactor = (this.xArr[i] - this.xArr[i-1]) + (this.yArr[i] - this.yArr[i-1]);
          strokeWeight(1 + 1.0 / abs(weightFactor));
          line(this.xArr[i-1], this.yArr[i-1], this.xArr[i], this.yArr[i]);
      }
  }
}


