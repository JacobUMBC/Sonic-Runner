import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";

export default function mainMenu() {
  if (!k.getData("best-score")) k.setData("best-score", 0);
  k.onButtonPress("jump", () => k.go("game"));

  // Define all available backgrounds with their proper scaling
  const backgrounds = [
    { sprite: "chemical-bg", scale: 2.0 },      // 1280 x 720
    { sprite: "greenhill-bg", scale: 2.0 },     // 1280 x 720
    { sprite: "carnival-bg", scale: 2.0 },      // 1024 x 706
    { sprite: "crystal-bg", scale: 2.5 },       // 960 x 540
    { sprite: "hidden-palace-bg", scale: 3.0 }, // 760 x 510
    { sprite: "springyard-bg", scale: 2.0 }     // 1270 x 890
  ];

  // Pick a random background
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  const bgPieceWidth = 1920;
  const bgPieces = [
    k.add([
      k.sprite(randomBg.sprite), 
      k.pos(0, 0), 
      k.scale(randomBg.scale), 
      k.opacity(0.8)
    ]),
    k.add([
      k.sprite(randomBg.sprite),
      k.pos(1920, 0),
      k.scale(randomBg.scale),
      k.opacity(0.8),
    ]),
  ];

  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
    k.add([k.sprite("platforms"), k.pos(384, 450), k.scale(4)]),
  ];

  k.add([
    k.text("SONIC RING RUN", { font: "mania", size: 96 }),
    k.anchor("center"),
    k.pos(k.center().x, 200),
  ]);

  k.add([
    k.text("Press Space/Click/Touch to Play", { font: "mania", size: 32 }),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 200),
  ]);

  makeSonic(k.vec2(200, 745));
  const gameSpeed = 4000;

  k.onUpdate(() => {
    if (bgPieces[1].pos.x < 0) {
      bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
      bgPieces.push(bgPieces.shift());
    }

    bgPieces[0].move(-100, 0);
    bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);

    if (platforms[1].pos.x < 0) {
      platforms[0].moveTo(platforms[1].pos.x + platforms[1].width * 4, 450);
      platforms.push(platforms.shift());
    }

    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
  });
}