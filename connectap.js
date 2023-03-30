
let t = 0;
let u = 77;
let mousePositions = [];
let circlePositions = [];
let maxStoreFrames = 100;
let delayRate = 32;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  circlePositions.push({x: width / 2, y: height / 2});
}

function draw() {
  background(245);

  // Store current mouse position
  mousePositions.push({x: mouseX, y: mouseY});
  if (mousePositions.length > maxStoreFrames) {
    mousePositions.shift();
  }

  // Set circle position
  let dividedX = circlePositions[circlePositions.length - 1].x + (mouseX - circlePositions[circlePositions.length - 1].x) / delayRate;
  let dividedY = circlePositions[circlePositions.length - 1].y + (mouseY - circlePositions[circlePositions.length - 1].y) / delayRate;

  // Draw circles with perlin noise
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

    if (dividedX && dividedY) {
      ellipse(dividedX, dividedY, circleSizeX, circleSizeY);
    } else {
      ellipse(mouseX, mouseY, circleSizeX, circleSizeY);
    }
  }

  // Store current circle position
  circlePositions.push({x: dividedX, y: dividedY});
  if (circlePositions.length > maxStoreFrames) {
    circlePositions.shift();
  }

  // Update noise seed
  t += 0.01;
  u += 0.01;
}
