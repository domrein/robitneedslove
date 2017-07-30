/*
Paul Milham
3/5/16
*/

"use strict";

Pxl.Graphic = class Graphic {
  constructor(actor) {
    this.actor = actor;

    this.scale = new Pxl.Point(1, 1);

    this.visible = true;
    this.alpha = 1;
    this.offset = new Pxl.Point();
    this.pivot = new Pxl.Point();
    this.z = 0;

    this.blinkCount = 0;
    this.blinkRate = -1;
    this.blinkDuration = -1;
  }

  update() {
    if (this.blinkRate !== -1) {
      this.blinkCount++;
      if (this.blinkCount >= this.blinkRate) {
        this.visible = false;
      }
      if (this.blinkCount >= this.blinkRate + this.blinkDuration) {
        this.blinkCount = 0;
        this.visible = true;
      }
    }
  }
};
