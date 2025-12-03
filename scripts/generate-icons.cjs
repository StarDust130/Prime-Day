const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const sizes = [192, 256, 384, 512];
const inputPath = path.resolve(__dirname, "../public/icon.png");
const outputDir = path.resolve(__dirname, "../public/icons");

fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  try {
    await Promise.all(
      sizes.map((size) =>
        sharp(inputPath)
          .resize(size, size, { fit: "cover" })
          .toFile(path.join(outputDir, `icon-${size}.png`))
      )
    );
    console.log(
      "Icons generated:",
      sizes.map((size) => `${size}x${size}`).join(", ")
    );
  } catch (error) {
    console.error("Failed to generate icons", error);
    process.exitCode = 1;
  }
})();
