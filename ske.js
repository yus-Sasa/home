function setup() {
    const scaleVal = 2;
    scale(scaleVal);
    background(204);
    var canvas = createCanvas(300, 600);
    canvas.style('height', '7vh');


    // 10刻みのグリッドを描画
    const step = 10;
    for (let i = 0; i < width; i += step) {
        for (let j = 0; j < height; j += step) {
            stroke(125, 50);
            strokeWeight(1);
            line(i, 0, i, height);
            line(0, j, width, j);
        }
    }
    fill(240);
    rect(20, 20, 20, 40);
}