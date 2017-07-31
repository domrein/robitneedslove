/*
Paul Milham
7/30/17
*/

"use strict";

class Battery extends Pxl.Actor {
  constructor(scene) {
    super(scene);

    this.life = 300;

    this.body = new Pxl.Body();
    this.body.width = 8;
    this.body.height = 8;
    this.body.gravity = new Pxl.Vector(.1, Math.PI * .5);

    this.body.beacon.observe(this, "collided", this.onCollided);
    this.body.type = "battery";

    this.graphics.push(new Pxl.Sprite(this));
    this.graphics[0].offset.x = -6;
    this.graphics[0].play("battery");
    this.floor = Math.random() * 4 + 189;
  }

  update() {
    super.update();

    this.life--;
    if (!this.life) {
      this.alive = false;
    }

    // lock to screen
    if (this.body.x + 8 > this.scene.game.width) {
      this.body.x = this.scene.game.width - 8;
      if (this.body.velocity.d > 0) {
        this.body.velocity.d = Math.abs(Math.PI * .5 - this.body.velocity.d) + Math.PI * .5;
      }
      else {
        this.body.velocity.d = Math.abs(this.body.velocity.d - Math.PI * 1.5) + Math.PI;
      }
    }
    else if (this.body.x < 0) {
      this.body.x = 0;
      if (this.body.velocity.d > Math.PI) {
        this.body.velocity.d = Math.abs(Math.PI * 1.5 - this.body.velocity.d) + Math.PI * 1.5;
      }
      else {
        this.body.velocity.d = Math.abs(Math.PI - this.body.velocity.d) + 0;
      }
    }

    if (this.body.y > this.floor) {
      this.body.y = this.floor;
      // make battery bounce on floor
      if (this.body.velocity.d >= Math.PI * .5) {
        this.body.velocity.d = Math.abs(Math.PI - this.body.velocity.d) + Math.PI;
      }
      else {
        this.body.velocity.d = Math.PI * 1.5 + this.body.velocity.d;
      }
      this.body.velocity.m *= .5;
    }
  }

  onCollided(target, collidee) {
    this.alive = false;
  }
}
