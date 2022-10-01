var d = 50; //帯の本数
var n = 4000;   //帯の長さ
var w = 1.0;//中心部での帯の太さ
var factor1 = 0.2;  //隣り合った帯の乱雑さの差
var factor2 = 0.01; //一つの帯内での乱雑さ
var vortex;
var canvas;
var selBg, selColor, selComposition;    //セレクトボックス
var sliDiv, sliOff;
var none;   //画面をリセットしたときだけtrueになる

function setup() {
    //準備
    canvas = createCanvas(1920, 1080, WEBGL);
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
    var butPosX = (windowWidth - scaledWidth) / 2 + 7;
    var butPosY = 104 + scaledHeight;
    var buttonNameArray = ['Reset', 'Save'];
    var buttonFuncArray = [reset, saveImg];
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
        ['white', 'black'], //背景色
        ['white', 'black', 'red', 'green', 'blue'],  //帯の色
        ['left', 'center', 'right']  //構図
    ];
    let ValueArray = [
        ["#ffffff", "#000000"],
        ["#ffffff96", "#00000096", "#e1000096", "#00e10096", "#0000e196"],
        [-1, 0, 1]
    ];
    let SelArray = [];
    for (let i = 0; i < KeyArray.length; i++) {
        let sel = createSelect();
        sel.position(selPosX + 65*i, selPosY);
        for (let j = 0; j < KeyArray[i].length; j++) {
            sel.option(KeyArray[i][j], ValueArray[i][j]);
        }
        SelArray.push(sel);
    }
    selBg = SelArray[0];
    selColor = SelArray[1];
    selComposition = SelArray[2];
    selColor.selected("#00000096"); //帯の色の既定は黒
    //指定が変わったら書き直す
    selBg.changed(drawMain);
    selColor.changed(drawMain);
    selComposition.changed(drawMain);
    //細かさ，乱雑さ決めるスライダー
    var sliPosX = selPosX;
    var sliPosY = selPosY + 35; 
    sliDiv = createSlider(10, 100, 30, 5);
    sliDiv.position(sliPosX, sliPosY);
    sliDiv.style('width', '80px');
    sliDiv.input(() => {
        drawMain();
    });
    sliOff = createSlider(0, 0.5, 0.2, 0.01);
    sliOff.position(sliPosX + 80, sliPosY);
    sliOff.style('width', '80px');
    sliOff.input(() => {
        drawMain();
    });
    let txt = createDiv('帯本数　　　　乱雑さ');
    txt.style('font-size', '12px');
    txt.position(sliPosX, sliPosY + 18);
    noStroke();
    vortex = new Vortex(random(100));
    vortex.drawMe();
}

class Vortex {
  constructor(off) {
      this.off = off;   //moise関数の初期値。インスタンスごとに変える。
  }

  drawMe() {
    background(selBg.value());
    fill(selColor.value());
    translate(selComposition.value() * width/2, 0, -height);    //回転中心
    rotateY(selComposition.value() * PI / 9);   //左寄り，右寄りなら，正面から少し傾ける
    d = sliDiv.value();
    factor1 = sliOff.value();
    for (let i = 0; i < d; i++) {
        rotateZ(2 * PI / d);
        this.drawLine(i);   //一つの帯を描画
    }
  }

  drawLine(i) {
    let x = 0;   //回転中心の座標
    let y = 0;
    let z = w;
    let localW = w;
    let dx;
    let dy;
    for (let j = 0; j < n; j++) {
        //off(初期値), i(何本目の帯か), j(帯内での位置)に応じて相対的な進行方向を決める
        let arg = noise(this.off + i * factor1 + j * factor2) * 2 * PI;
        dx = cos(arg);
        dy = sin(arg);
        beginShape();
        vertex(x, y, z);
        vertex(x + dx, y + dy, z);
        vertex(x + dx, y + dy, z - localW);
        vertex(x, y, z - localW);
        endShape();
        //x, y, z, localWを更新する
        x += dx;
        y += dy;
        localW += 0.1;
        z = localW / 2;
    }
  }
}