"use strict";

Pxl.ColorRectangle = class ColorRectangle extends Pxl.Graphic {
  constructor(actor) {
    super(actor);

    this.width = 0;
    this.height = 0;
    this.color = "#000";
  }
};
