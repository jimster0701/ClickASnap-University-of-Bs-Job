const mainCanvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext("2d");
ctx.lineWidth = 2;
ctx.strokeRect(0, 0, 1920, 1080);

function box(coordinates, fill) {
    ctx.beginPath();
    ctx.moveTo(coordinates[0][0], coordinates[0][1]);
    for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(coordinates[i][0], coordinates[i][1]);
    }
    ctx.stroke();
    ctx.fillStyle = fill;
    ctx.fill();
}

box([[200, 0], [1720, 0], [1720, 800], [200, 800]], "rgba(255, 0, 0, 0.5)");
box([[200, 800], [1720, 800], [1920, 1080], [0, 1080]], "rgba(0, 255, 0, 0.5)");  