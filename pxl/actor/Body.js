"use strict";

Pxl.Body = class extends Pxl.Rectangle {
  constructor() {
    super();

    this.beacon = new Pxl.Beacon(this);

    this.type = "none";
    this.mass = null; // for use in shared collision resolution
    this.velocity = new Pxl.Vector();
    this.friction = null;
    this.gravity = new Pxl.Vector();
  }

  calcAngle(body) {
    const myCenter = new Pxl.Point(this.x + this.width / 2, this.y + this.height / 2);
    const otherCenter = new Pxl.Point(body.x + body.width / 2, body.y + body.height / 2);
    const xDist = myCenter.x - otherCenter.x;
    const yDist = myCenter.y - otherCenter.y;
    return Math.atan2(yDist, xDist);
  }
};
