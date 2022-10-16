function drawHandle() {     //制御点をhandleに準備（canvasには描かない）
    handle.clear();
    for (let i = 0; i < cPointArr.length; i++) {
        if (i > 0) {
            //点の間を線で結ぶ
            handle.line(cPointArr[i-1].x, cPointArr[i-1].y, cPointArr[i].x, cPointArr[i].y)
        }
        handle.ellipse(cPointArr[i].x, cPointArr[i].y, r, r);
    }
}
function saveImg() {
    saveCanvas(main, 'bezier', 'png');  
}
function reDraw() { //初期化
    nCPoint = Number(selNum.value());
    cPointArr = []
    init()
    drawHandle();
    drawMain();
}

function windowResized(){     //UI位置はここで決める
    let centerWidth = document.getElementsByClassName('wrapper')[0].clientWidth;
    let centerHeight = document.getElementsByClassName('wrapper')[0].clientHeight;
    let scale = min(centerWidth / 3840, centerHeight / 2160);
    let scaledWidth = min(scale * 3840, centerWidth);
    let scaledHeight = min(scale * 2160, centerHeight);
    canvas.style('width', String(scaledWidth)+'px');
    canvas.style('height', String(scaledHeight)+'px');

    var butPosX = (windowWidth - scaledWidth) / 2 + 7;
    var butPosY = 104 + scaledHeight;
    b.position(butPosX, butPosY);

    var selPosX = butPosX;
    var selPosY = butPosY + 35;
    selBg.position(selPosX, selPosY);
    selNum.position(selPosX + 65, selPosY);

    slider.position(selPosX + 130, selPosY);
}