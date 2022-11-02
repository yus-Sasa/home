function start() {
    loop();
}
function pause() {
    noLoop();
}
function reset() { 
    fill(0, 0, selBg.value());
    rect(0, 0, width, height);
    init();
    var real_canvas = canvas.canvas;
    HTMLcontext.drawImage(real_canvas, 0, 0, width, height, 0, 0, 400, 225);
}
function saveImg() {
    saveCanvas(canvas, 'force', 'png');  
}
function reDraw() { //背景色or軌跡の色が変わったとき
    noLoop();
    fill(0, 0, selBg.value());
    rect(0, 0, width, height);
    hueValue = Number(selColor.value());
    for (let i = 0; i < objArr.length; i++) {
        o = objArr[i];
        o.c = color(o.calcColor(), 100, 100);
        o.drawMe();
    }
    var real_canvas = canvas.canvas;
    HTMLcontext.drawImage(real_canvas, 0, 0, width, height, 0, 0, 400, 225);
}

function windowResized() {  //UI位置はここで決める
    let centerWidth = document.getElementsByClassName('wrapper')[0].clientWidth;
    let centerHeight = document.getElementsByClassName('wrapper')[0].clientHeight;
    let scale = min(centerWidth / 1920, centerHeight / 1080);
    let scaledWidth = min(scale * 1920, centerWidth);
    let scaledHeight = min(scale * 1080, centerHeight);
    canvas.style('width', String(scaledWidth)+'px');
    canvas.style('height', String(scaledHeight)+'px');

    var butPosX = (windowWidth - scaledWidth) / 2 + 7;
    var butPosY = 104 + scaledHeight;
    for (let i = 0; i < buttonArray.length; i++)
    {
        buttonArray[i].position(butPosX + i*65, butPosY);
    }

    var selPosX = butPosX;
    var selPosY = butPosY + 35;
    selBg.position(selPosX, selPosY);
    selColor.position(selPosX + 65, selPosY);
}