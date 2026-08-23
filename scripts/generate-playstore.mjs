import sharp from "sharp";
import { mkdirSync } from "fs";

// Generates Google Play Store graphics from the real WhatToPack assets.
// Output: playstore/ (icon, feature graphic, phone screenshots)

mkdirSync("playstore", { recursive: true });

const NAVY = "#0c2148";
const BLUE = "#2764e7";
const GREEN = "#1fa463";
const YELLOW = "#f5b342";

/* ---------- 1. Store icon: 512x512 ---------- */
await sharp("reference/App Icon.png")
  .resize(512, 512)
  .png()
  .toFile("playstore/icon-512.png");
console.log("done playstore/icon-512.png");

/* ---------- 2. Feature graphic: 1024x500 ---------- */
const svgText = `
<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/>
      <stop offset="0.65" stop-color="#14305f"/>
      <stop offset="1" stop-color="#1c4fc2"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <circle cx="880" cy="60" r="180" fill="${BLUE}" opacity="0.18"/>
  <circle cx="120" cy="470" r="150" fill="${GREEN}" opacity="0.15"/>
  <text x="72" y="205" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff">Never Forget</text>
  <text x="72" y="292" font-family="Segoe UI, Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff">Anything <tspan fill="#8fe3b3">Again.</tspan></text>
  <text x="74" y="356" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="600" fill="#c7d3ef">Personalized packing checklists, built around your trip.</text>
  <rect x="74" y="398" width="250" height="52" rx="26" fill="${BLUE}"/>
  <text x="199" y="432" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Free on Android</text>
</svg>`;

await sharp({
  create: { width: 1024, height: 500, channels: 4, background: NAVY },
})
  .composite([
    {
      input: Buffer.from(svgText),
      top: 0,
      left: 0,
    },
    {
      input: await sharp("reference/Future Graphic.png")
        .resize({ height: 500 })
        .png()
        .toBuffer(),
      // right-aligned promo art
      gravity: "east",
    },
  ])
  .png()
  .toFile("playstore/feature-graphic-1024x500.png");
console.log("done playstore/feature-graphic-1024x500.png");

/* ---------- 3. Phone screenshots: framed on branded cards ---------- */
const screens = [
  ["reference/Screens/01_Splash.png", "phone-1-splash"],
  ["reference/Screens/02_Onboarding.png", "phone-2-onboarding"],
  ["reference/Screens/03_Home.png", "phone-3-home"],
  ["reference/Screens/04_Checklist.png", "phone-4-checklist"],
  ["reference/Screens/05_SavedTrips.png", "phone-5-saved-trips"],
];

const CARD_W = 1080;
const CARD_H = 1920;
const PHONE_W = 720;

for (const [input, name] of screens) {
  const phone = await sharp(input)
    .resize({ width: PHONE_W })
    .png()
    .toBuffer();
  const meta = await sharp(phone).metadata();

  const frameSvg = `
  <svg width="${CARD_W}" height="${CARD_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0e213d"/>
        <stop offset="1" stop-color="#071426"/>
      </linearGradient>
    </defs>
    <rect width="${CARD_W}" height="${CARD_H}" fill="url(#cardBg)"/>
    <circle cx="980" cy="140" r="260" fill="${BLUE}" opacity="0.12"/>
    <circle cx="80" cy="1820" r="220" fill="${GREEN}" opacity="0.12"/>
    <rect x="${(CARD_W - PHONE_W) / 2 - 14}" y="${(CARD_H - meta.height) / 2 - 14}"
          width="${PHONE_W + 28}" height="${meta.height + 28}" rx="48"
          fill="none" stroke="${YELLOW}" stroke-width="10" opacity="0.85"/>
  </svg>`;

  await sharp({
    create: { width: CARD_W, height: CARD_H, channels: 4, background: "#071426" },
  })
    .composite([
      { input: Buffer.from(frameSvg), top: 0, left: 0 },
      {
        input: phone,
        top: Math.round((CARD_H - meta.height) / 2),
        left: Math.round((CARD_W - PHONE_W) / 2),
      },
    ])
    .png()
    .toFile(`playstore/${name}.png`);
  console.log(`done playstore/${name}.png`);
}

console.log("All Play Store graphics generated in ./playstore");
