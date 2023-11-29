var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var overview = document.getElementById("overview");
var ctxOverview = overview.getContext("2d");

var redraw = true;

var viewportX = 0;
var viewportY = 0;
var viewportScale = 0.1;

var lmbDown = false;

var layers = [
  {
    points: [
      { x: 10, y: 10 },
      { x: 10, y: 20 },
      { x: 20, y: 30 },
    ],
    images: [
      {
        src: "img.jpg",
        x: 0,
        y: 0,
        scale: 0.04,
        img: new Image(),
      },
    ],
  },
];

for (let i = 0; i < layers.length; i++) {
  let layer = layers[i];

  for (let j = 0; j < layer.images.length; j++) {
    let image = layer.images[j];

    image.img.src = image.src;

    image.img.onload = function() {
      redraw = true;
      render();
    };
  }
}

function drawLayers() {
  ctx.fillStyle = "#ff0000";
  ctx.strokeStyle = "#ff0000";

  ctxOverview.fillStyle = "#ff0000";
  ctxOverview.strokeStyle = "#ff0000";

  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];

    for (var j = 0; j < layer.images.length; j++) {
      var image = layer.images[j];

      var img = layer.images[j].img;

      image.width = img.width * image.scale;
      image.height = img.height * image.scale;

      ctx.drawImage(img, image.x, image.y, image.width, image.height);
      ctxOverview.drawImage(img, image.x, image.y, image.width, image.height);
    }

    ctx.beginPath();
    ctx.moveTo(layer.points[0].x, layer.points[0].y);

    for (var j = 1; j < layer.points.length; j++) {
      ctx.lineTo(layer.points[j].x, layer.points[j].y);
    }

    ctx.stroke();

    ctxOverview.beginPath();
    ctxOverview.moveTo(layer.points[0].x, layer.points[0].y);

    for (var j = 1; j < layer.points.length; j++) {
      ctxOverview.lineTo(layer.points[j].x, layer.points[j].y);
    }

    ctxOverview.stroke();
  }
}

function render() {
  if (redraw) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    overview.width = overview.offsetWidth;
    overview.height = overview.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxOverview.clearRect(0, 0, overview.width, overview.height);

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";

    ctxOverview.fillStyle = "#000000";
    ctxOverview.strokeStyle = "#000000";

    ctx.save();
    ctx.scale(1.0 / viewportScale, 1.0 / viewportScale);
    ctx.translate(-viewportX, -viewportY);

    for (let x = 0; x < canvas.width; x += 10) {
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath();
        ctx.rect(x, y, 10, 10);
        ctx.stroke();

        ctxOverview.beginPath();
        ctxOverview.rect(x, y, 10, 10);
        ctxOverview.stroke();
      }
    }

    drawLayers();

    ctx.restore();

    ctxOverview.beginPath();
    ctxOverview.rect(viewportX, viewportY, canvas.width * viewportScale, canvas.height * viewportScale);
    ctxOverview.stroke();
  }

  redraw = false;
}

document.addEventListener("keydown", function(e) {
});

overview.addEventListener("mousedown", function(e) {
  let vpWidth = canvas.width * viewportScale;
  let vpHeight = canvas.height * viewportScale;

  viewportX = e.offsetX - vpWidth / 2;
  viewportY = e.offsetY - vpHeight / 2;

  lmbDown = true;

  redraw = true;
});

overview.addEventListener("mouseup", function(e) {
  let vpWidth = canvas.width * viewportScale;
  let vpHeight = canvas.height * viewportScale;

  viewportX = e.offsetX - vpWidth / 2;
  viewportY = e.offsetY - vpHeight / 2;

  lmbDown = false;

  redraw = true;
});

overview.addEventListener("mousemove", function(e) {
  if (lmbDown) {
    let vpWidth = canvas.width * viewportScale;
    let vpHeight = canvas.height * viewportScale;

    viewportX = e.offsetX - vpWidth / 2;
    viewportY = e.offsetY - vpHeight / 2;

    redraw = true;
  }
});

window.addEventListener("resize", function() {
  redraw = true;
  render();
});

window.addEventListener("wheel", function(e) {
  let vpWidth = canvas.width * viewportScale;
  let vpHeight = canvas.height * viewportScale;

  let oldScale = viewportScale;

  viewportScale += e.deltaY * 0.001;

  if (viewportScale < 0.01) {
    viewportScale = 0.01;
  }

  if (viewportScale > 1.0) {
    viewportScale = 1.0;
  }

  let newScale = viewportScale;

  let scaleDiff = newScale - oldScale;

  viewportX -= vpWidth * scaleDiff / 2;
  viewportY -= vpHeight * scaleDiff / 2;
});

setInterval(render, 1000 / 60);
