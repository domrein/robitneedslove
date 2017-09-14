/*
Paul Milham
7/29/17
*/

import Actor from "../pxl/actor/Actor.js";
import Body from "../pxl/actor/Body.js";
import Sprite from "../pxl/actor/Sprite.js";

export default class Laser extends Actor {
  constructor(scene) {
    super(scene);

    this.body = new Body();
    this.body.width = 16;
    this.body.height = 2;
    this.body.velocity.m = 8;
    this.body.beacon.observe(this, "collided", this.onCollided);
    this.body.type = "laser";

    this.graphics.push(new Sprite(this));
    this.graphics[0].offset.y = -6;
    this.graphics[0].play("laser");
    this.hitSomething = false;
  }

  update() {
    super.update();
    if (this.body.x < -100 || this.body.x > this.scene.game.width + 100) {
      this.alive = false;
    }
  }

  onCollided() {
    this.alive = false;
  }
}
