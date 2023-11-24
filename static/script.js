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
