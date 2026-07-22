const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const brainDir = "C:\\Users\\Pratham\\.gemini\\antigravity-ide\\brain\\a3cc9b83-bb25-49b7-bcef-b1b0e522b150";
const inputPath = path.join(brainDir, "media__1784739932703.png");

if (!fs.existsSync(inputPath)) {
  console.error("Input image not found:", inputPath);
  process.exit(1);
}

const buffer = fs.readFileSync(inputPath);
const base64Src = "data:image/png;base64," + buffer.toString("base64");

// Artwork Bounding Box detected: X [135..894], Y [345..663] -> Size 759x318
// Add tiny 2% padding around the bounding box for ideal breathing room
const padX = 15;
const padY = 10;
const cropX = Math.max(0, 135 - padX);
const cropY = Math.max(0, 345 - padY);
const cropW = (894 + padX) - cropX;
const cropH = (663 + padY) - cropY;

console.log(`Final Tightly Cropped ViewBox: X=${cropX}, Y=${cropY}, W=${cropW}, H=${cropH}`);

// 1. Generate Tightly Cropped Vector SVG (Navbar Primary Logo)
// ViewBox is locked onto [cropX, cropY, cropW, cropH], completely cutting off the white padding!
const tightLogoSvg = `<svg width="${cropW}" height="${cropH}" viewBox="${cropX} ${cropY} ${cropW} ${cropH}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="${base64Src}" x="0" y="0" width="1024" height="1024" />
</svg>`;

// 2. Generate Tightly Cropped Circular Icon Emblem SVG
// Bounding box for circular emblem on the left: X [135..455], Y [345..663] -> 320x318
const iconCropX = 135 - 5;
const iconCropY = 345 - 5;
const iconCropSize = 328;

const tightIconSvg = `<svg width="${iconCropSize}" height="${iconCropSize}" viewBox="${iconCropX} ${iconCropY} ${iconCropSize} ${iconCropSize}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="${base64Src}" x="0" y="0" width="1024" height="1024" />
</svg>`;

// Write SVGs to public & app
fs.writeFileSync(path.join(root, "public", "belle-logo.svg"), tightLogoSvg);
fs.writeFileSync(path.join(root, "public", "belle-icon.svg"), tightIconSvg);
fs.writeFileSync(path.join(root, "public", "icon.svg"), tightIconSvg);
fs.writeFileSync(path.join(root, "app", "icon.svg"), tightIconSvg);

// Also copy image to public
fs.writeFileSync(path.join(root, "public", "belle-logo.png"), buffer);
fs.writeFileSync(path.join(root, "public", "images", "belle-logo.png"), buffer);

console.log("Tightly cropped SVG assets and favicons successfully built!");
