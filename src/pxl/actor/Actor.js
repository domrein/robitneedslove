import Beacon from "../core/Beacon.js";

export default class Actor {
  constructor(scene) {
    this.scene = scene;
    this.beacon = new Beacon(this);
    this.alive = true;
    this.body = null;
    this.graphics = [];
    this.brains = [];
    this.brainBeacon = new Beacon(this);
  }

  update() {
    // TODO: actors should have states built in?
    // seems an alive and "dead" state are always needed where the body is left on the ground
    if (this.alive) {
      for (const graphic of this.graphics) {
        graphic.update();
      }
      for (const brain of this.brains) {
        brain.update();
      }
    }
  }
};
