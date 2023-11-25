var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var overview = document.getElementById("overview");
var ctxOverview = overview.getContext("2d");

var redraw = true;

var overviewX = 50;
var overviewY = 50;
var overviewScale = 2;

var layers = [
  {
    points: [
      { x: 10, y: 10 },
      { x: 10, y: 20 },
      { x: 20, y: 30 },
    ],
  },
];

function drawLayers() {
  ctx.fillStyle = "#ff0000";
  ctx.strokeStyle = "#ff0000";

  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];

    ctx.beginPath();
    ctx.moveTo(layer.points[0].x, layer.points[0].y);

    for (var j = 1; j < layer.points.length; j++) {
      ctx.lineTo(layer.points[j].x, layer.points[j].y);
    }

    ctx.stroke();
  }
}

function render() {
}

setInterval(render, 1000 / 60);

document.addEventListener("keydown", function(e) {
});

overview.addEventListener("mousedown", function(e) {
  overviewX = e.offsetX;
  overviewY = e.offsetY;

  redraw = true;
});
