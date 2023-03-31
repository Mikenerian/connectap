
let t = 0;
let u = 77;
let mousePositions = [];
let circlePositions = [];
let otherMousePositions = {};
let otherCirclePositions = {};
let maxStoreFrames = 100;
let delayRate = 32;
let cnt = 0;
let connectionAllowed = true;

function setup() {
  let headerHeight = document.querySelector("header").offsetHeight;
  let canvas = createCanvas(windowWidth, windowHeight - headerHeight);
  canvas.parent('canvas-container'); // 描画領域を<div>タグの中に配置
  noStroke();
  circlePositions.push({x: width / 2, y: height / 2});

  // Connect to the WebSocket Server
  socket = io.connect('http://localhost:3000');

  // Add a listener for the 'mouse' event from the server
  socket.on('mouse', (data) => {
    if (connectionAllowed) {
      if (!otherMousePositions[data.id]) {
        otherMousePositions[data.id] = [];
      }
      otherMousePositions[data.id].push({x: data.x, y: data.y});
    }
  });

  socket.on('connectionStatus', (data) => {
    if (data.status === 'rejected') {
      connectionAllowed = false;
    }
  });
}

function draw() {
  background(245);

  // Store current mouse position
  mousePositions.push({x: mouseX, y: mouseY});
  if (cnt % 60 === 0) {
    socket.emit('mouse', { x: mouseX, y: mouseY });
  }
  cnt++;
  if (mousePositions.length > maxStoreFrames) {
    mousePositions.shift();
  }
  if (otherMousePositions.length > maxStoreFrames) {
    otherMousePositions.shift();
  }

  // Set circle position
  let dividedX = circlePositions[circlePositions.length - 1].x + (mouseX - circlePositions[circlePositions.length - 1].x) / delayRate;
  let dividedY = circlePositions[circlePositions.length - 1].y + (mouseY - circlePositions[circlePositions.length - 1].y) / delayRate;

  // Draw circles
  drawCircles(dividedX, dividedY);

  // Store current circle position
  circlePositions.push({x: dividedX, y: dividedY});
  if (circlePositions.length > maxStoreFrames) {
    circlePositions.shift();
  }

  // Draw other's circles only if otherMousePositions and otherCirclePositions have data
  if (connectionAllowed) {
    for (let clientId in otherMousePositions) {
      if (otherMousePositions.hasOwnProperty(clientId)) {
        let mPos = otherMousePositions[clientId];
        if (!otherCirclePositions[clientId]) {
          otherCirclePositions[clientId] = [{x: width / 2, y: height / 2}];
        }
        let cPos = otherCirclePositions[clientId];

        if (mPos.length > 0) {
          let otherDividedX = cPos[cPos.length -1].x + (mPos[mPos.length - 1].x - cPos[cPos.length -1].x) / delayRate;
          let otherDividedY = cPos[cPos.length -1].y + (mPos[mPos.length - 1].y - cPos[cPos.length -1].y) / delayRate;

          drawCircles(otherDividedX, otherDividedY);
          otherCirclePositions[clientId].push({x: otherDividedX, y: otherDividedY});
        }
      }
    }
  }

  // Update noise seed
  t += 0.01;
  u += 0.01;
}

function drawCircles(x, y) {
  noStroke();
  for (let i = 0; i < 30; i++) {
    let c = map(sin(t), -1, 1, 100, 200); // Red value changes with time
    let a = 80 + i * 3; // Alpha value
    let circleColor = color(c, c + 10, c + 20, a);
    fill(circleColor);
    let circleBase = 200 - i * 1.5;
    let noiseValueX = noise(t + 1000);
    let noiseValueY = noise(u + 1000);
    let sizeVariationX = circleBase * (noiseValueX * 2 - 1) * 0.1;
    let sizeVariationY = circleBase * (noiseValueY * 2 - 1) * 0.1;
    let circleSizeX = circleBase + sizeVariationX - i * 2;
    let circleSizeY = circleBase + sizeVariationY - i * 2;

    if (x && y) {
      ellipse(x, y, circleSizeX, circleSizeY);
    } else {
      ellipse(mouseX, mouseY, circleSizeX, circleSizeY);
    }
  }
}