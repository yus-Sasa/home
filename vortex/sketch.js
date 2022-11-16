var d = 50; //帯の本数
var n = 4000;   //帯の長さ
var w = 1.0;//中心部での帯の太さ
var factor1 = 0.2;  //隣り合った帯の乱雑さの差
var factor2 = 0.01; //一つの帯内での乱雑さ
var vortex;
var canvas, main;
var buttonArray = [];
var selBg, selColor, selComposition;    //セレクトボックス
var inpDiv, inpOff, txt;
var none;   //画面をリセットしたときだけtrueになる
var HTMLcontext;

function setup() {
    //準備    
    canvas = createCanvas(1920, 1080);
    canvas.parent("P5Canvas");
    var HTMLcanvas = document.getElementById("subCanvas");
    HTMLcontext = HTMLcanvas.getContext("2d");
    main = createGraphics(1920, 1080, WEBGL);   //3Dはここに描く

    //UIの配置
    //ボタン
    var buttonNameArray = ['Reset', 'Save'];
    var buttonFuncArray = [reset, saveImg];
    for (let i = 0; i < buttonNameArray.length; i++)
    {
        let b = createButton(buttonNameArray[i]);
        b.style("width", "55px");
        b.mousePressed(buttonFuncArray[i]);
        buttonArray.push(b);
    }
    //セレクトボックス
    let KeyArray = [
        ['white', 'black'], //背景色
        ['white', 'black', 'red', 'green', 'blue'],  //帯の色
        ['left', 'center', 'right']  //構図
    ];
    let ValueArray = [
        ["#ffffff", "#000000"],
        ["#ffffffc7", "#000000c7", "#e10000c7", "#00e100c7", "#0000e1c7"],
        [-1, 0, 1]
    ];
    let SelArray = [];
    for (let i = 0; i < KeyArray.length; i++) {
        let sel = createSelect();
        for (let j = 0; j < KeyArray[i].length; j++) {
            sel.option(KeyArray[i][j], ValueArray[i][j]);
        }
        SelArray.push(sel);
    }
    selBg = SelArray[0];
    selColor = SelArray[1];
    selComposition = SelArray[2];
    selColor.selected("#000000c7"); //帯の色の既定は黒
    //指定が変わったら書き直す
    selBg.changed(drawMain);
    selColor.changed(drawMain);
    selComposition.changed(drawMain);
    //細かさ，ずれ決める
    inpDiv = createInput(30, 'number');
    inpDiv.style('width', '55px');
    inpDiv.input(() => {
        drawMain();
    });
    inpOff = createInput(0.2, 'number');
    inpOff.style('width', '55px');
    inpOff.input(() => {
        drawMain();
    });
    txt = createDiv('帯本数 　　ずれ');
    txt.style('font-size', '12px');
    windowResized();
    noStroke();
    main.noStroke();
    vortex = new Vortex(random(100));
    vortex.drawMe();
}

class Vortex {
  constructor(off) {
      this.off = off;   //moise関数の初期値。インスタンスごとに変える。
  }

  drawMe() {
    fill(selBg.value());
    rect(0, 0, width, height);  //キャンバスを背景で塗りつぶす    
    d = inpDiv.value();
    if (d > 100) {  //帯の本数が多すぎる場合，描画を中止する
        return 0;
    }
    main.push();    //座標系の保存
    main.fill(selColor.value());
    main.translate(selComposition.value() * width/2, 0, -height);    //回転中心
    main.rotateY(selComposition.value() * PI / 9);   //左寄り，右寄りなら，正面から少し傾ける
    factor1 = inpOff.value();
    for (let i = 0; i < d; i++) {
        main.rotateZ(2 * PI / d);
        this.drawLine(i);   //一つの帯を描画
    }
    image(main, 0, 0);
    main.pop();
    var real_canvas = canvas.canvas;
    HTMLcontext.drawImage(real_canvas, 0, 0, width, height, 0, 0, 400, 225);
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
        main.beginShape();
        main.vertex(x, y, z);
        main.vertex(x + dx, y + dy, z);
        main.vertex(x + dx, y + dy, z - localW);
        main.vertex(x, y, z - localW);
        main.endShape();
        //x, y, z, localWを更新する
        x += dx;
        y += dy;
        localW += 0.1;
        z = localW / 2;
    }
  }
}