const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const logoPath = path.join(root, "public", "belle-logo.png");

if (!fs.existsSync(logoPath)) {
  console.error("belle-logo.png not found!");
  process.exit(1);
}

const imgBuffer = fs.readFileSync(logoPath);
const base64Img = "data:image/png;base64," + imgBuffer.toString("base64");

// Self-contained embedded SVG containing the exact uploaded emblem
const svgContent = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circleClip">
      <circle cx="50" cy="50" r="50" />
    </clipPath>
  </defs>
  <g clip-path="url(#circleClip)">
    <image href="${base64Img}" x="-18" y="-7" width="240" height="114" preserveAspectRatio="xMinYMid slice" />
  </g>
</svg>`;

fs.writeFileSync(path.join(root, "app", "icon.svg"), svgContent);
fs.writeFileSync(path.join(root, "public", "icon.svg"), svgContent);
fs.writeFileSync(path.join(root, "public", "belle-icon.svg"), svgContent);

fs.writeFileSync(path.join(root, "app", "icon.png"), imgBuffer);
fs.writeFileSync(path.join(root, "public", "icon.png"), imgBuffer);
fs.writeFileSync(path.join(root, "public", "favicon.ico"), imgBuffer);
fs.writeFileSync(path.join(root, "app", "favicon.ico"), imgBuffer);

console.log("All favicons updated with user's exact uploaded logo mark!");
