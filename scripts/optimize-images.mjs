import sharp from "sharp";
import { mkdirSync } from "fs";

mkdirSync("assets/screens", { recursive: true });

const jobs = [
  // [input, outputBase, resizeWidth]
  ["reference/App Icon.png", "assets/app-icon", 512],
  ["reference/Future Graphic.png", "assets/hero-graphic", 1600],
  ["reference/Screens/01_Splash.png", "assets/screens/splash", 560],
  ["reference/Screens/02_Onboarding.png", "assets/screens/onboarding", 560],
  ["reference/Screens/03_Home.png", "assets/screens/home", 560],
  ["reference/Screens/04_Checklist.png", "assets/screens/checklist", 560],
  ["reference/Screens/05_SavedTrips.png", "assets/screens/saved-trips", 560],
];

for (const [input, outBase, width] of jobs) {
  const img = sharp(input).resize({ width, withoutEnlargement: true });
  await img.clone().webp({ quality: 82 }).toFile(`${outBase}.webp`);
  await img.clone().png({ quality: 82, compressionLevel: 9 }).toFile(`${outBase}.png`);
  console.log("done", outBase);
}

// square favicon sizes from the app icon
for (const size of [32, 180, 192, 512]) {
  await sharp("reference/App Icon.png")
    .resize(size, size)
    .png()
    .toFile(`assets/favicon-${size}.png`);
}
console.log("favicons done");
