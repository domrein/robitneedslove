/*
Paul Milham
7/29/17
*/

import Actor from "../pxl/actor/Actor.js";
import Body from "../pxl/actor/Body.js";
import ColorRectangle from "../pxl/actor/ColorRectangle.js";

export default class Mote extends Actor {
  constructor(scene) {
    super(scene);

    this.body = new Body();
    this.body.velocity.m = Math.random() * .05;
    this.body.velocity.d = Math.PI * .5;

    this.graphics.push(new ColorRectangle(this));
    this.graphics[0].color = "#6E626A";
    this.graphics[0].width = this.graphics[0].height = Math.round(Math.random() * 1 + 1);
    this.graphics[0].alpha = 0;

    const alpha = .3 + Math.random() * .1;
    this.scene.tween.add(
      this.graphics[0],
      "alpha",
      0,
      alpha,
      100,
      "linear"
    );
    const tween = this.scene.tween.add(
      this.graphics[0],
      "alpha",
      alpha,
      0,
      100,
      "linear",
      {delay: 300}
    );
    tween.beacon.observe(this, "completed", () => {
      this.alive = false;
    });
  }

  update() {
    super.update();
  }
}
