/*
Paul Milham
7/30/17
*/

"use strict";

class Bat extends Pxl.Actor {
  constructor(scene) {
    super(scene);

    this.body = new Pxl.Body();
    this.body.width = 16;
    this.body.height = 16;
    // move this to playscene?
    if (Math.random() > .5) {
      this.body.velocity.m = .3 + Math.random() * .2;
      this.body.x = -16;
    }
    else {
      this.body.velocity.m = (.3 + Math.random() * .2) * -1;
      this.body.x = this.scene.game.width + 16;
    }
    this.body.y = Math.random() * 180 + 4;

    this.body.beacon.observe(this, "collided", this.onCollided);
    this.body.type = "enemy";

    this.graphics.push(new Pxl.Sprite(this));
    this.graphics[0].play("bat");
  }

  update() {
    super.update();
    if (this.body.x < -100 || this.body.x > this.scene.game.width + 100) {
      this.alive = false;
    }
  }

  onCollided() {
    // take a few hits to die?
    // drop battery
    this.alive = false;
    for (let i = 0; i < ~~(Math.random() * 2); i++) {
      const battery = new Battery(this.scene);
      battery.body.x = this.body.x;
      battery.body.y = this.body.y;
      battery.body.velocity.d = Math.random() * Math.PI * 1.75 + Math.PI * .5;
      battery.body.velocity.m = 3;
      this.scene.addActor(battery);
    }
    this.scene.game.audioMixer.play("enemyDie");
  }
}
