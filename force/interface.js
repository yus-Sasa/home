function start() {
    if (none) {
        init();
        none = false;
    }
    loop();
}
function pause() {
    noLoop();
}
function reset() { 
    fill(0, 0, selBg.value());
    rect(0, 0, width, height);
    init();
    none = true;
}
function saveImg() {
    saveCanvas(canvas, 'force', 'png');  
}
