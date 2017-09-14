/*
Paul Milham
7/30/17
*/

import Actor from "../../../pxl/actor/Actor.js";
import Body from "../../../pxl/actor/Body.js";
import Sprite from "../../../pxl/actor/Sprite.js";

import PlayScene from "../scene/PlayScene.js";

export default class Terminal extends Actor {
  constructor(scene) {
    super(scene);

    this.body = new Body();
    this.body.width = 13;
    this.body.height = 48;

    this.body.beacon.observe(this, "collided", this.onCollided);
    this.body.type = "terminal";

    this.graphics.push(new Sprite(this));
    this.graphics[0].play("terminal");

    this.lightBulb = new Sprite(this);
    this.lightBulb.offset.x = 2;
    this.lightBulb.offset.y = 2;
    this.lightBulb.play("lightBulbGreen");
    this.graphics.push(this.lightBulb);

    this.maxLife = 3000;
    this.life = this.maxLife;
    this.bulbPhaseDuration = 500;
  }

  update() {
    super.update();

    this.life--;
    if (this.life >= this.bulbPhaseDuration * 4) {
      this.lightBulb.play("lightBulbGreen");
    }
    else if (this.life >= this.bulbPhaseDuration * 3) {
      this.lightBulb.play("lightBulbYellow");
    }
    else if (this.life >= this.bulbPhaseDuration * 2) {
      this.lightBulb.play("lightBulbRed");
    }
    else if (this.life >= this.bulbPhaseDuration * 1) {
      if (this.lightBulb.anim.name !== "lightBulbBlink") {
        this.lightBulb.play("lightBulbBlink");
      }
    }
    else {
      this.lightBulb.play("lightBulbDead");
      this.scene.beacon.emit("completed", PlayScene);
    }
  }

  onCollided(target, collidee) {
    if (collidee.type === "battery") {
      this.scene.game.audioMixer.play("terminalBatteryGet");
      this.life += this.bulbPhaseDuration;
      if (this.life >= this.maxLife) {
        this.life = this.maxLife;
      }
    }
  }
}
