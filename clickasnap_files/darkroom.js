const mainCanvas = document.getElementById("mainCanvas");
mainCanvas.width = "500px";
mainCanvas.height= "500px";

const ctx = mainCanvas.getContext("2d"); 
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();