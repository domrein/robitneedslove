"use strict";

class Game extends Pxl.Game {
  constructor() {
    super(320, 240, PlayScene, Pxl.Canvas2dRenderer, "canvas");

    this.score = 0;

    this.inputRelay.preventDefaults = [
      // controls
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "z",
      "x",
      // block scrolling
      " ",
    ];

    // preload assets
    this.preloader.addImage("assets/sprites.png");

    this.preloader.addAudio("assets/audio/EnemyDie.wav", "enemyDie");
    this.preloader.addAudio("assets/audio/EnemyHit.wav", "enemyHit");
    this.preloader.addAudio("assets/audio/Laser.wav", "laser");
    this.preloader.addAudio("assets/audio/Poop.wav", "poop");
    this.preloader.addAudio("assets/audio/RobotBatteryGet.wav", "robotBatteryGet");
    this.preloader.addAudio("assets/audio/TerminalBatteryGet.wav", "terminalBatteryGet");

    // this.preloader.addAudio("assets/audio/BGMusic.mp3", "bgMusic");

    this.spriteStore.frameData = {
      "assets/sprites.png": {"RobotArms1":{"x":432,"y":240,"width":16,"height":16},"RobotBody1":{"x":336,"y":240,"width":16,"height":16},"RobotHead1":{"x":448,"y":240,"width":16,"height":16},"RobotHead2":{"x":400,"y":240,"width":16,"height":16},"RobotNeck1":{"x":416,"y":240,"width":16,"height":16},"Background1":{"x":320,"y":0,"width":320,"height":240},"Foreground1":{"x":0,"y":0,"width":320,"height":240},"Burst1":{"x":464,"y":240,"width":16,"height":16},"Burst2":{"x":480,"y":240,"width":16,"height":16},"Burst3":{"x":496,"y":240,"width":16,"height":16},"Burst4":{"x":512,"y":240,"width":16,"height":16},"Laser1":{"x":272,"y":240,"width":16,"height":16},"Bat1":{"x":288,"y":240,"width":16,"height":16},"Bat2":{"x":304,"y":240,"width":16,"height":16},"Bat3":{"x":320,"y":240,"width":16,"height":16},"Bat4":{"x":256,"y":240,"width":16,"height":16},"Bat5":{"x":352,"y":240,"width":16,"height":16},"Bat6":{"x":368,"y":240,"width":16,"height":16},"Battery1":{"x":384,"y":240,"width":16,"height":16},"Terminal1":{"x":32,"y":240,"width":32,"height":64},"Terminal2":{"x":64,"y":240,"width":32,"height":64},"Terminal3":{"x":0,"y":240,"width":32,"height":64},"Terminal4":{"x":128,"y":240,"width":32,"height":64},"Terminal5":{"x":160,"y":240,"width":32,"height":64},"Terminal6":{"x":192,"y":240,"width":32,"height":64},"Terminal7":{"x":224,"y":240,"width":32,"height":64},"Terminal8":{"x":96,"y":240,"width":32,"height":64},"LightBulb1":{"x":528,"y":240,"width":16,"height":16},"LightBulb2":{"x":544,"y":240,"width":16,"height":16},"LightBulb3":{"x":560,"y":240,"width":16,"height":16},"LightBulb4":{"x":576,"y":240,"width":16,"height":16}},
    };
    this.spriteStore.animData = {
      robotBody: {frames: ["RobotBody1"], frameRate: 1, looping: false},
      robotHead: {frames: ["RobotHead2", "RobotHead2", "RobotHead2", "RobotHead2", "RobotHead2", "RobotHead1"], frameRate: 8, looping: true},
      background: {frames: ["Background1"], frameRate: 1, looping: false},
      foreground: {frames: ["Foreground1"], frameRate: 1, looping: false},
      burst: {frames: ["Burst1", "Burst2", "Burst3", "Burst4"], frameRate: 3, looping: false},
      laser: {frames: ["Laser1"], frameRate: 1, looping: false},
      bat: {frames: ["Bat1", "Bat2", "Bat3", "Bat4", "Bat5", "Bat6"], frameRate: 6, looping: true},
      battery: {frames: ["Battery1"], frameRate: 1, looping: false},
      terminal: {frames: ["Terminal1", "Terminal2", "Terminal3", "Terminal4", "Terminal5", "Terminal6", "Terminal7", "Terminal8", "Terminal1", "Terminal8", "Terminal1", "Terminal8"], frameRate: 15, looping: true},
      lightBulbGreen: {frames: ["LightBulb1"], frameRate: 1, looping: false},
      lightBulbYellow: {frames: ["LightBulb2"], frameRate: 1, looping: false},
      lightBulbRed: {frames: ["LightBulb3"], frameRate: 1, looping: false},
      lightBulbBlink: {frames: ["LightBulb3", "LightBulb4"], frameRate: 20, looping: true},
      lightBulbDead: {frames: ["LightBulb4"], frameRate: 1, looping: false},
    };
  }
}
