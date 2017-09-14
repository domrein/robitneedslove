/*
Paul Milham
7/29/17
*/

import Scene from "../../../pxl/scene/Scene.js";
import Actor from "../../../pxl/actor/Actor.js";
import Body from "../../../pxl/actor/Body.js";
import Sprite from "../../../pxl/actor/Sprite.js";
import Text from "../../../pxl/actor/Text.js";

import Terminal from "../actor/Terminal.js";
import Mote from "../actor/Mote.js";
import Robot from "../actor/Robot.js";
import Bat from "../actor/Bat.js";
import Laser from "../actor/Laser.js";

export default class PlayScene extends Scene {
  constructor(game) {
    super(game);

    this.physics.collisionPairs = [
      ["enemy", "laser"],
      ["player", "battery"],
      ["terminal", "battery"],
    ];

    this.input.beacon.observe(this, "keyPressed", this.onKeyPressed);

    const background = new Actor(this);
    background.body = new Body();
    background.graphics.push(new Sprite(background));
    background.graphics[0].play("background");
    background.graphics[0].z = -1;
    this.addActor(background);

    this.player = new Robot(this);
    this.player.body.x = 12 * 5;
    this.player.body.y = 195;
    this.addActor(this.player);

    const foreground = new Actor(this);
    foreground.body = new Body();
    foreground.graphics.push(new Sprite(foreground));
    foreground.graphics[0].play("foreground");
    foreground.graphics[0].z = 2;
    this.addActor(foreground);

    const terminal = new Terminal(this);
    terminal.body.y = 150;
    terminal.graphics[0].z = -1;
    this.addActor(terminal);

    const actor = new Actor(this);
    actor.body = new Body();
    actor.body.x = 3;
    actor.body.y = 3;
    this.scoreText = new Text(actor);
    this.scoreText.prefix = "Score: ";
    this.scoreText.text = 0;
    this.scoreText.size = 10;
    this.scoreText.z = 3;
    actor.graphics.push(this.scoreText);
    this.addActor(actor);

    this.count = 0;
    this.spawnRate = 0.99;
    this.lastSpawnCount = 0;
    this.score = 0;
  }

  update() {
    super.update();

    this.count++;
    this.lastSpawnCount++;

    if (this.count % 300 === 0) {
      this.spawnRate -= 0.001;
    }
    if (this.count % 60 === 0) {
      this.score++;
      this.scoreText.text = this.score;
    }

    // lock player to screen
    if (this.player.body.x < 24) {
      this.player.body.x = 24;
    }
    if (this.player.body.x > this.game.width - this.player.body.width) {
      this.player.body.x = this.game.width - this.player.body.width;
    }
    if (this.player.body.y < 0) {
      this.player.body.y = 0;
    }
    if (this.player.body.y > this.game.height - this.player.body.height) {
      this.player.body.y = this.game.height - this.player.body.height;
    }

    // robot controls
    if (this.input.keys.ArrowLeft) {
      this.player.moveBody(true);
    }
    else if (this.input.keys.ArrowRight) {
      this.player.moveBody(false);
    }
    if (this.input.keys.ArrowUp) {
      this.player.moveHead(true);
    }
    else if (this.input.keys.ArrowDown) {
      this.player.moveHead(false);
    }

    // generate motes
    if (Math.random() > 0.95) {
      const mote = new Mote(this);
      mote.graphics[0].z = 1;
      mote.body.x = Math.random() * this.game.width;
      mote.body.y = Math.random() * this.game.height;
      this.addActor(mote);
    }
    if (Math.random() > this.spawnRate || this.lastSpawnCount > 60) {
      this.lastSpawnCount = 0;
      const bat = new Bat(this);
      this.addActor(bat);
    }
  }

  onKeyPressed(source, key) {
    // shoot laser
    if (key === "z") {
      this.player.fire();
    }
    // poop energy
    if (key === "x") {
      this.player.poop();
    }
  }
}
