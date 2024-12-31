import k from "./kaplayCtx";
import game from "./scenes/game";
import mainMenu from "./scenes/mainMenu";
import gameover from "./scenes/gameover";

k.loadSprite("chemical-bg", "graphics/chemical-bg.png");
k.loadSprite("carnival-bg", "graphics/carnival-bg.png");
k.loadSprite("crystal-bg", "graphics/crystal-bg.png");
k.loadSprite("greenhill-bg", "graphics/greenhill-bg.png");
k.loadSprite("hidden-palace-bg", "graphics/hidden-palace-bg.png");
k.loadSprite("springyard-bg", "graphics/springyard-bg.png");
k.loadSprite("platforms", "graphics/platforms.png");
k.loadSprite("sonic", "graphics/sonic.png",{
    sliceX: 8,
    sliceY: 2,
    anims: {
        //run-jump for sonic
        run: {from: 0, to: 7, loop: true, speed: 30},
        jump: {from: 8, to: 15, loop: true, speed: 100},
    },
});
k.loadSprite("ring", "graphics/ring.png", {
    sliceX: 16,
    sliceY: 1,
    anims: {
        spin: { from: 0, to: 15, loop: true, speed: 30 },

    },
});
//Motobug Enemies
k.loadSprite("motobug", "graphics/motobug.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
        run: {from: 0, to: 4, loop: true, speed: 8 },
    },
});
k.loadFont("mania", "fonts/mania.ttf");

k.loadSound("destroy", "sounds/Destroy.wav");
k.loadSound("hurt", "sounds/Hurt.wav");
k.loadSound("hyper-ring", "sounds/HyperRing.wav");
k.loadSound("jump", "sounds/Jump.wav");
k.loadSound("ring", "sounds/Ring.wav");
k.loadSound("zone", "sounds/GreenHill.mp3");

k.scene("main-menu", mainMenu);

k.scene("game", game);

k.scene("gameover", gameover);

k.go("main-menu");