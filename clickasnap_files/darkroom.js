const mainCanvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext("2d");
ctx.lineWidth = 2;
ctx.strokeRect(0, 0, 5760, 1080);

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

box([[200, 0], [5560, 0], [5560, 800], [200, 800]], "rgba(255, 0, 0, 0.5)"); // Back wall
box([[0, 0], [200, 0], [200, 800], [0, 1080]], "rgba(0, 0, 255, 0.5)"); // Left wall
box([[5760, 0], [5560, 0], [5560, 800], [5760, 1080]], "rgba(0, 0, 255, 0.5)"); // Right wall
box([[200, 800], [5560, 800], [5760, 1080], [0, 1080]], "rgba(0, 255, 0, 0.5)"); // Floor


function killMe(offset=0) {
    box([[offset+500, 600], [offset+1420, 600], [offset+1570, 850], [offset+350, 850]], "rgba(100, 100, 100, 1)"); // Table Top
    box([[offset+360, 875], [offset+410, 875], [offset+410, 1080], [offset+360, 1080]], "rgba(100, 100, 100, 1)"); // Table Leg 1
    box([[offset+1510, 875], [offset+1560, 875], [offset+1560, 1080], [offset+1510, 1080]], "rgba(100, 100, 100, 1)"); // Table Leg 2
    box([[offset+350, 850], [offset+1570, 850], [offset+1570, 875], [offset+350, 875]], "rgba(10, 10, 10, 1)"); // Table 3d/bottom
}

killMe();
killMe(1920);
killMe(1920*2);