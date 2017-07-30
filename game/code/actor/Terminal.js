/*
Paul Milham
7/30/17
*/

"use strict";

class Terminal extends Pxl.Actor {
  constructor(scene) {
    super(scene);

    this.body = new Pxl.Body();
    this.body.width = 13;
    this.body.height = 48;

    this.body.beacon.observe(this, "collided", this.onCollided);
    this.body.type = "terminal";

    this.graphics.push(new Pxl.Sprite(this));
    this.graphics[0].play("terminal");

    this.lightBulb = new Pxl.Sprite(this);
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
