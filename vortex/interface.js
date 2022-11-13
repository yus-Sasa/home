function drawMain() {
    main.clear();   //3Dのリセット
    vortex.drawMe();
}
function reset() { 
    main.clear();   //3Dのリセット
    vortex = new Vortex(random(100));
    vortex.drawMe();
}
function saveImg() {
    saveCanvas(canvas, 'vortex', 'png');  
}

function windowResized() {    //UI位置はここで決める
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
    selComposition.position(selPosX + 130, selPosY);

    var inpPosX = selPosX;
    var inpPosY = selPosY + 35; 
    inpDiv.position(inpPosX, inpPosY);
    inpOff.position(inpPosX + 65, inpPosY);
    txt.position(inpPosX, inpPosY + 18);
}