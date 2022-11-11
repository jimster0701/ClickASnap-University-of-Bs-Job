const mainCanvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext("2d"); 
ctx.lineWidth = 2;
ctx.strokeRect(0, 0, 1920, 1080);

function line(a, b, c, d) {
    ctx.moveTo(a, b);
    ctx.lineTo(c, d);
    ctx.stroke();
}

line(200, 0, 200, 800);
line(200, 800, 0, 1080);
line(200, 800, 1720, 800);
line(1720, 0, 1720, 800);
line(1720, 800, 1920, 1080);