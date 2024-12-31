import k from "../kaplayCtx";
import { makeSonic } from "../entities/sonic";
import { makeMotobug } from "../entities/motobug";
import { makeRing } from "../entities/ring";

export default function game() {
  const citySfx = k.play("zone", { volume: 0.2, loop: true });
  k.setGravity(3100);
  const bgPieceWidth = 1920;
  let currentSetIndex = 0;

  // Define all backgrounds with their optimal scaling
  const backgroundSets = [
    // Spring Yard set (1270 x 890)
    {
      back: { sprite: "springyard-bg", scale: 1.5, opacity: 0.5 },
      middle: { sprite: "springyard-bg", scale: 1.7, opacity: 0.6 },
      front: { sprite: "springyard-bg", scale: 2.0, opacity: 0.8 }
    },
    // Carnival set (1024 x 706)
    {
      back: { sprite: "carnival-bg", scale: 1.5, opacity: 0.5 },
      middle: { sprite: "carnival-bg", scale: 1.7, opacity: 0.6 },
      front: { sprite: "carnival-bg", scale: 2.0, opacity: 0.8 }
    },
    // Green Hill set (1280 x 720)
    {
      back: { sprite: "greenhill-bg", scale: 1.5, opacity: 0.5 },
      middle: { sprite: "greenhill-bg", scale: 1.7, opacity: 0.6 },
      front: { sprite: "greenhill-bg", scale: 2.0, opacity: 0.8 }
    },
    // Chemical Plant set (1280 x 720)
    {
      back: { sprite: "chemical-bg", scale: 1.5, opacity: 0.5 },
      middle: { sprite: "chemical-bg", scale: 1.7, opacity: 0.6 },
      front: { sprite: "chemical-bg", scale: 2.0, opacity: 0.8 }
    },
    // Crystal set (960 x 540)
    {
      back: { sprite: "crystal-bg", scale: 2.0, opacity: 0.5 },
      middle: { sprite: "crystal-bg", scale: 2.2, opacity: 0.6 },
      front: { sprite: "crystal-bg", scale: 2.5, opacity: 0.8 }
    },
    // Hidden Palace set (760 x 510)
    {
      back: { sprite: "hidden-palace-bg", scale: 2.5, opacity: 0.5 },
      middle: { sprite: "hidden-palace-bg", scale: 2.7, opacity: 0.6 },
      front: { sprite: "hidden-palace-bg", scale: 3.0, opacity: 0.8 }
    }
  ];

  // Initialize available backgrounds
  let availableBackgrounds = [...Array(backgroundSets.length).keys()]; // [0, 1, 2, 3, 4, 5]

  // Create the background pieces for each layer
  const bgPieces = [
    // Back layer
    k.add([
      k.sprite(backgroundSets[0].back.sprite),
      k.pos(0, 0),
      k.scale(k.vec2(backgroundSets[0].back.scale, backgroundSets[0].back.scale)),
      k.opacity(backgroundSets[0].back.opacity),
      k.anchor("topleft"),
      "back"
    ]),
    k.add([
      k.sprite(backgroundSets[0].back.sprite),
      k.pos(bgPieceWidth, 0),
      k.scale(k.vec2(backgroundSets[0].back.scale, backgroundSets[0].back.scale)),
      k.opacity(backgroundSets[0].back.opacity),
      k.anchor("topleft"),
      "back"
    ]),
    // Middle layer
    k.add([
      k.sprite(backgroundSets[0].middle.sprite),
      k.pos(0, 0),
      k.scale(k.vec2(backgroundSets[0].middle.scale, backgroundSets[0].middle.scale)),
      k.opacity(backgroundSets[0].middle.opacity),
      k.anchor("topleft"),
      "middle"
    ]),
    k.add([
      k.sprite(backgroundSets[0].middle.sprite),
      k.pos(bgPieceWidth, 0),
      k.scale(k.vec2(backgroundSets[0].middle.scale, backgroundSets[0].middle.scale)),
      k.opacity(backgroundSets[0].middle.opacity),
      k.anchor("topleft"),
      "middle"
    ]),
    // Front layer
    k.add([
      k.sprite(backgroundSets[0].front.sprite),
      k.pos(0, 0),
      k.scale(k.vec2(backgroundSets[0].front.scale, backgroundSets[0].front.scale)),
      k.opacity(backgroundSets[0].front.opacity),
      k.anchor("topleft"),
      "front"
    ]),
    k.add([
      k.sprite(backgroundSets[0].front.sprite),
      k.pos(bgPieceWidth, 0),
      k.scale(k.vec2(backgroundSets[0].front.scale, backgroundSets[0].front.scale)),
      k.opacity(backgroundSets[0].front.opacity),
      k.anchor("topleft"),
      "front"
    ])
  ];

  const platforms = [
    k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
    k.add([k.sprite("platforms"), k.pos(384 * 4, 450), k.scale(4)]),
  ];

  const sonic = makeSonic(k.vec2(200, 745));
  sonic.setControls();
  sonic.setEvents();

  const controlsText = k.add([
    k.text("Press Space/Click/Touch to Jump!", {
      font: "mania",
      size: 64,
    }),
    k.anchor("center"),
    k.pos(k.center()),
  ]);

  const dismissControlsAction = k.onButtonPress("jump", () => {
    k.destroy(controlsText);
    dismissControlsAction.cancel();
  });

  const scoreText = k.add([
    k.text("SCORE : 0", { font: "mania", size: 72 }),
    k.pos(20, 20),
  ]);
  let score = 0;
  let scoreMultiplier = 0;
  sonic.onCollide("ring", (ring) => {
    k.play("ring", { volume: 0.5 });
    k.destroy(ring);
    score++;
    scoreText.text = `SCORE : ${score}`;
    sonic.ringCollectUI.text = "+1";
    k.wait(1, () => {
      sonic.ringCollectUI.text = "";
    });
  });
  sonic.onCollide("enemy", (enemy) => {
    if (!sonic.isGrounded()) {
      k.play("destroy", { volume: 0.5 });
      k.play("hyper-ring", { volume: 0.5 });
      k.destroy(enemy);
      sonic.play("jump");
      sonic.jump();
      scoreMultiplier += 1;
      score += 10 * scoreMultiplier;
      scoreText.text = `SCORE : ${score}`;
      if (scoreMultiplier === 1)
        sonic.ringCollectUI.text = `+${10 * scoreMultiplier}`;
      if (scoreMultiplier > 1) sonic.ringCollectUI.text = `x${scoreMultiplier}`;
      k.wait(1, () => {
        sonic.ringCollectUI.text = "";
      });
      return;
    }

    k.play("hurt", { volume: 0.5 });
    k.setData("current-score", score);
    k.go("gameover", citySfx);
  });

  let gameSpeed = 300;
  k.loop(1, () => {
    gameSpeed += 50;
  });

  const spawnMotoBug = () => {
    const motobug = makeMotobug(k.vec2(1950, 773));
    motobug.onUpdate(() => {
      if (gameSpeed < 3000) {
        motobug.move(-(gameSpeed + 300), 0);
        return;
      }
      motobug.move(-gameSpeed, 0);
    });

    motobug.onExitScreen(() => {
      if (motobug.pos.x < 0) k.destroy(motobug);
    });

    const waitTime = k.rand(0.5, 2.5);

    k.wait(waitTime, spawnMotoBug);
  };

  spawnMotoBug();

  const spawnRing = () => {
    const ring = makeRing(k.vec2(1950, 745));
    ring.onUpdate(() => {
      ring.move(-gameSpeed, 0);
    });
    ring.onExitScreen(() => {
      if (ring.pos.x < 0) k.destroy(ring);
    });

    const waitTime = k.rand(0.5, 3);

    k.wait(waitTime, spawnRing);
  };

  spawnRing();

  k.add([
    k.rect(1920, 300),
    k.opacity(0),
    k.area(),
    k.pos(0, 832),
    k.body({ isStatic: true }),
    "platform",
  ]);

  // Update function for background movement
  k.onUpdate(() => {
    // Back layer movement (slowest)
    const backPieces = bgPieces.filter(p => p.is("back"));
    if (backPieces[0].pos.x <= -bgPieceWidth) {
      backPieces[0].pos.x = backPieces[1].pos.x + bgPieceWidth;
      [bgPieces[0], bgPieces[1]] = [bgPieces[1], bgPieces[0]];
    }
    backPieces.forEach(p => p.move(-50, 0));

    // Middle layer movement
    const middlePieces = bgPieces.filter(p => p.is("middle"));
    if (middlePieces[0].pos.x <= -bgPieceWidth) {
      middlePieces[0].pos.x = middlePieces[1].pos.x + bgPieceWidth;
      [bgPieces[2], bgPieces[3]] = [bgPieces[3], bgPieces[2]];
    }
    middlePieces.forEach(p => p.move(-75, 0));

    // Front layer movement (fastest)
    const frontPieces = bgPieces.filter(p => p.is("front"));
    if (frontPieces[0].pos.x <= -bgPieceWidth) {
      frontPieces[0].pos.x = frontPieces[1].pos.x + bgPieceWidth;
      [bgPieces[4], bgPieces[5]] = [bgPieces[5], bgPieces[4]];
    }
    frontPieces.forEach(p => p.move(-100, 0));

    // Jump effect with different intensities for each layer
    bgPieces.forEach(piece => {
      let jumpOffset;
      if (piece.is("back")) {
        jumpOffset = -sonic.pos.y / 20 - 25;  // Least affected
      } else if (piece.is("middle")) {
        jumpOffset = -sonic.pos.y / 15 - 35;  // Medium effect
      } else {
        jumpOffset = -sonic.pos.y / 10 - 50;  // Most affected
      }
      piece.pos.y = jumpOffset;
    });

    // Platform movement
    if (platforms[1].pos.x < 0) {
        platforms[0].moveTo(platforms[1].pos.x + 384 * 8, 450);  // Adjusted width calculation
        platforms.push(platforms.shift());
    }

    platforms[0].move(-gameSpeed, 0);
    platforms[1].moveTo(platforms[0].pos.x + 384 * 4, 450);  // Keep consistent spacing
  });

  // Change backgrounds every 5 seconds
  k.loop(10, () => {
    // If we've used all backgrounds, reset the pool
    if (availableBackgrounds.length === 0) {
        availableBackgrounds = [...Array(backgroundSets.length).keys()];
        // Remove the current background to avoid immediate repeat
        availableBackgrounds = availableBackgrounds.filter(i => i !== currentSetIndex);
    }

    // Pick a random index from remaining backgrounds
    const randomIndex = Math.floor(Math.random() * availableBackgrounds.length);
    currentSetIndex = availableBackgrounds[randomIndex];
    
    // Remove the used background from the pool
    availableBackgrounds.splice(randomIndex, 1);

    const newSet = backgroundSets[currentSetIndex];
    
    bgPieces.forEach(piece => {
        const layer = piece.is("back") ? newSet.back : 
                     piece.is("middle") ? newSet.middle : newSet.front;
        
        k.tween(
            piece.opacity,
            0,
            0.3,
            (val) => piece.opacity = val,
            () => {
                piece.use(k.sprite(layer.sprite));
                piece.scale = k.vec2(layer.scale, layer.scale);
                k.tween(
                    piece.opacity,
                    layer.opacity,
                    0.3,
                    (val) => piece.opacity = val
                );
            }
        );
    });
  });
}