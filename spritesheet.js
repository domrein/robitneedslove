"use strict";

// Load in dependencies
const spritesmith = require("spritesmith");
const fs = require("fs");
const util = require("util");

spritesmith.run = util.promisify(spritesmith.run);
fs.writeFile = util.promisify(fs.writeFile);

// Generate our spritesheet
const sprites = [
  "assets/images/RobotArms1.png",
  "assets/images/RobotBody1.png",
  "assets/images/RobotHead1.png",
  "assets/images/RobotHead2.png",
  "assets/images/RobotNeck1.png",
  "assets/images/Background1.png",
  "assets/images/Foreground1.png",
  "assets/images/Burst1.png",
  "assets/images/Burst2.png",
  "assets/images/Burst3.png",
  "assets/images/Burst4.png",
  "assets/images/Laser1.png",
  "assets/images/Bat1.png",
  "assets/images/Bat2.png",
  "assets/images/Bat3.png",
  "assets/images/Bat4.png",
  "assets/images/Bat5.png",
  "assets/images/Bat6.png",
  "assets/images/Battery1.png",
  "assets/images/Terminal1.png",
  "assets/images/Terminal2.png",
  "assets/images/Terminal3.png",
  "assets/images/Terminal4.png",
  "assets/images/Terminal5.png",
  "assets/images/Terminal6.png",
  "assets/images/Terminal7.png",
  "assets/images/Terminal8.png",
  "assets/images/LightBulb1.png",
  "assets/images/LightBulb2.png",
  "assets/images/LightBulb3.png",
  "assets/images/LightBulb4.png",
];
(async () => {
  const result = await spritesmith.run({src: sprites});
  await fs.writeFile("assets/sprites.png", result.image);
  const coords = {};
  for (const [file, coord] of Object.entries(result.coordinates)) {
    coords[file.replace("assets/images/", "").replace(".png", "")] = coord;
  }
  await fs.writeFile("assets/sprites.json", JSON.stringify(coords));
})();
