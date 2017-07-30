"use strict";

Pxl.DataStore = class {
  constructor() {
    this.data = {};
  }

  addData(data, name) {
    this.data[name] = data;
  }
};
