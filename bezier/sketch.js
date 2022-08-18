var canvas, main, handle;   //canvasとgraphics
var cPointArr = []; //制御点（ベクトル形式）の配列
var nCPoint = 4;
var step = 30;
var r = 25; //UI上の制御点半径
var difference = [0, 0];    //選ばれた制御点と，マウス座標の差
var selected;   //動かされている制御点のindex
var bgcolor;    //canvas背景
var selBg, selNum;    //セレクトボックス
var slider;

function setup() {
    //準備
    canvas = createCanvas(3840, 2160);  //これはただの入れ物であるcanvas
    let centerWidth = document.getElementsByClassName('wrapper')[0].clientWidth;
    let centerHeight = document.getElementsByClassName('wrapper')[0].clientHeight;
    let scale = min(centerWidth / 3840, centerHeight / 2160);
    let scaledWidth = min(scale * 3840, centerWidth);
    let scaledHeight = min(scale * 2160, centerHeight);
    canvas.style('width', String(scaledWidth)+'px');
    canvas.style('height', String(scaledHeight)+'px');
    canvas.parent("P5Canvas");
    //そのcanvasの背景色設定
    let element = document.getElementsByClassName('wrapper')[0];
    let style = window.getComputedStyle(element);
    let value = style.getPropertyValue('background-color');
    bgcolor = color(value);

    //線を描くgraphics
    main = createGraphics(1920, 1080);
    main.colorMode(HSB, 1);

    //UI用のgraphics
    handle = createGraphics(3840, 2160);
    handle.fill(100, 100, 100);
    handle.stroke(100, 100, 100);
    handle.strokeWeight(3);
    init(); //制御点の初期化

    //UIの配置
    //ボタン
    var butPosX = (windowWidth - scaledWidth) / 2 + 7;
    var butPosY = 104 + scaledHeight;
    let b = createButton("Save");
    b.style("width", "55px");
    b.position(butPosX, butPosY);
    b.mousePressed(saveImg);
    //セレクトボックス
    var selPosX = butPosX;
    var selPosY = butPosY + 35;
    let KeyArray = [
        ['white', 'black', 'none'], 
        ['3', '4', '5', '6', '7', '8', '9', '10', '100']
    ];
    let ValueArray = [
        [1, 0, -1],
        KeyArray[1]
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
    selNum = SelArray[1];
    selNum.selected('4');
    selBg.changed(drawMain);//背景色の指定が変わったら書き換える
    selNum.changed(reDraw); //点数の指定が変わったら初期化
    //色を決めるスライダー
    slider = createSlider(0, 1, 0, 0.01);
    slider.position(selPosX + 130, selPosY);
    slider.style('width', '80px');
    slider.input(() => {
        drawMain();
      });

    //描画
    drawHandle();   //制御点をhandleに準備（canvasには描かない）
    drawMain(); //曲線，制御点をcanvasに描く
}

function draw() {
    if(mouseIsPressed && selected >= 0) {   //点を動かして描画に反映
        cPointArr[selected].x = mouseX - difference[0];
        cPointArr[selected].y = mouseY - difference[1];
        if (cPointArr[selected].x > width) {    //はみ出さないようにする
            cPointArr[selected].x -= width;
        }
        if (cPointArr[selected].x < 0) {
            cPointArr[selected].x += width;
        }
        if (cPointArr[selected].y > height) {
            cPointArr[selected].y -= height;
        }
        if (cPointArr[selected].y < 0) {
            cPointArr[selected].y += height;
        }
        drawHandle();
        drawMain();
    }
}
function init() {   //制御点のランダム生成
    for (let i = 0; i < nCPoint; i++) {
        let circleX = random(0, width);
        let circleY = random(0, height);
        cPointArr.push(createVector(circleX, circleY));
    }
}
function mousePressed() {   //クリックされたとき，どの制御点かクリックされたかと，点とマウスの差を記録
    for (let i = 0; i < cPointArr.length; i++)
    {
        if (dist(mouseX, mouseY, cPointArr[i].x, cPointArr[i].y) < r) {
            selected = i;
            difference = [mouseX - cPointArr[i].x, mouseY - cPointArr[i].y];
            break;
        }
    }
}
function mouseReleased() {  //マウスが離れたらどの点が選ばれているかという情報をリセットする
    selected = -1;
}