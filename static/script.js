var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var overview = document.getElementById("overview");
var ctxOverview = overview.getContext("2d");

var redraw = true;

var viewportX = 0;
var viewportY = 0;
var viewportScale = 0.1;
var lmbOverview = false;
var lmbCanvas = false;
var activeLayer = 1;

var layers = [
  {
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
  {
    points: [
    ],
  },
];

for (let i = 0; i < layers.length; i++) {
  let layer = layers[i];

  if (layer.images) {
    for (let j = 0; j < layer.images.length; j++) {
      let image = layer.images[j];

      image.img.src = image.src;

      image.img.onload = function() {
        redraw = true;
        render();
      };
    }
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

    ctx.fillStyle = "#222222";
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";

    ctxOverview.fillStyle = "#000000";
    ctxOverview.strokeStyle = "#000000";

    ctx.save();
    ctx.scale(1.0 / viewportScale, 1.0 / viewportScale);
    ctx.translate(-viewportX, -viewportY);

    var gridWidth = 5;
    for (let x = 0; x < canvas.width; x += gridWidth) {
      for (let y = 0; y < canvas.height; y += gridWidth) {

        var color = "#ffffff";

        if (x % (2 * gridWidth) == 0 && y % (2 * gridWidth) == 0 || x % (2 * gridWidth) != 0 && y % (2 * gridWidth) != 0) {
          color = "#cccccc";
        }

        ctx.fillStyle = color;
        ctxOverview.fillStyle = color;

        ctx.beginPath();
        ctx.rect(x, y, gridWidth, gridWidth);
        ctx.fill();

        ctxOverview.beginPath();
        ctxOverview.rect(x, y, gridWidth, gridWidth);
        ctxOverview.fill();
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
  if (e.key == "w") {
    viewportY -= 10;
  } else if (e.key == "a") {
    viewportX -= 10;
  } else if (e.key == "s") {
    viewportY += 10;
  } else if (e.key == "d") {
    viewportX += 10;
  } else if (e.key == "q") {
    viewportScale *= 1.1;
  } else if (e.key == "e") {
    viewportScale /= 1.1;
  }

  redraw = true;
  render();
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

  redraw = true;
  render();
});

setInterval(render, 1000 / 60);
