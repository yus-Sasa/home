function drawMain() {
    main.clear();
    if (selBg.value() != -1) {  //背景色設定，-1のときは背景なし
        main.fill(0, 0, Number(selBg.value()), 1);
        main.rect(0, 0, main.width, main.height);
    }
    let midPt = cPointArr.map(v => createVector(v.x, v.y)); //制御点のディープコピー
    for (let i = 0; i < midPt.length; i++) {    //canvas座標系からmain座標系へ変換
        midPt[i].x = midPt[i].x - 960;
        midPt[i].y = midPt[i].y - 540;
    }
    for (let i = 0; i < step + 1; i++) {
        drawStep(midPt, i); //i:step-iで内分する，(i=0~step)
    }
    fill(bgcolor);
    rect(0, 0, width, height);
    image(main, 960, 540);
    image(handle, 0, 0);
}
function drawStep(midPt, i) {
    while (midPt.length > 1) {
        midPt = getVertex(midPt, i / step); //midPtの中にある隣り合った点を内分する
        let h = (midPt.length-1) / (cPointArr.length-2) + Number(slider.value());   //色相(前半：0~1，後半0~1)
        if (h > 1) {
            h -= 1;
        }
        main.stroke(h, 1, 1, 0.5);
        drawLine(midPt);
      }
}
function drawLine(v) {
    if (v.length > 1) { //まだ内分できるなら線を描く
        for (let i = 0; i < v.length - 1; i++) {
            main.strokeWeight(1);
            main.line(v[i].x, v[i].y, v[i+1].x, v[i+1].y);
        }
    }
    else {  //内分できないなら点を打つ
        main.stroke(0, 0, 0, 0.1);
        main.strokeWeight(5);
        main.point(v[0].x, v[0].y);
      }
}
function getVertex(v, t) {  //点を内分する
    let newVtxArr = [];
    for (let i = 0; i < v.length - 1; i++) {
        let newVtx = p5.Vector.sub(v[i + 1],v[i]);
        newVtx.mult(t);
        newVtx.add(v[i]);
        newVtxArr.push(newVtx);
    }
    return newVtxArr;
}