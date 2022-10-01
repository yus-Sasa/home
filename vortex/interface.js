function drawMain() {
    vortex.drawMe();
}
function reset() { 
    vortex = new Vortex(random(100));
    vortex.drawMe();
}
function saveImg() {
    saveCanvas(canvas, 'vortex', 'png');  
}
