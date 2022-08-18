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