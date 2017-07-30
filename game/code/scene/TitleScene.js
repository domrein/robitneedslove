/*
Paul Milham
3/26/16
*/

"use strict";

class TitleScene extends Pxl.Scene {
  constructor(game) {
    super(game);
    this.count = 0;

    this.input.beacon.observe(this, "keyPressed", this.onKeyPressed);
    this.input.beacon.observe(this, "touchStarted", this.onTouchStarted);

    this.background = new Pxl.Actor(this);
    this.background.graphics.push(new Pxl.ColorRectangle(this.background));
    this.background.graphics[0].width = this.game.width;
    this.background.graphics[0].height = this.game.height;
    this.background.graphics[0].color = "#3a0065";
    this.background.graphics[0].alpha = 0.6;
    this.background.graphics[0].z = -2;
    this.background.body = new Pxl.Body();
    this.addActor(this.background);

    this.phantomText = new Pxl.Actor(this);
    this.phantomText.graphics.push(new Pxl.Text(this.phantomText, "PHANTOM"));
    this.phantomText.graphics[0].size = 20;
    this.phantomText.graphics[0].font = "Creepster";
    this.phantomText.body = new Pxl.Body();
    this.phantomText.body.x = this.game.width / 2 - 35;
    this.phantomText.body.y = 20;
    this.addActor(this.phantomText);

    this.frightText = new Pxl.Actor(this);
    this.frightText.graphics.push(new Pxl.Text(this.frightText, "FRIGHT"));
    this.frightText.graphics[0].size = 20;
    this.frightText.graphics[0].font = "Creepster";
    this.frightText.body = new Pxl.Body();
    this.frightText.body.x = this.game.width / 2 - 26;
    this.frightText.body.y = 40;
    this.addActor(this.frightText);

    this.instructionsText = new Pxl.Actor(this);
    this.instructionsText.graphics.push(new Pxl.Text(this.instructionsText, "Use the arrow keys to avoid the phantoms!"));
    this.instructionsText.graphics[0].size = 5;
    this.instructionsText.graphics[0].font = "Creepster";
    this.instructionsText.body = new Pxl.Body();
    this.instructionsText.body.x = this.game.width / 2 - 43;
    this.instructionsText.body.y = 75;
    this.addActor(this.instructionsText);

    this.startText = new Pxl.Actor(this);
    this.startText.graphics.push(new Pxl.Text(this.startText, "Press any key to play"));
    this.startText.graphics[0].size = 7;
    this.startText.graphics[0].font = "Creepster";
    this.startText.graphics[0].blinkRate = 60;
    this.startText.graphics[0].blinkDuration = 60;
    this.startText.body = new Pxl.Body();
    this.startText.body.x = this.game.width / 2 - 28;
    this.startText.body.y = 105;
    this.addActor(this.startText);
  }

  update() {
    super.update();
    this.count++;

    if (this.count % 120 === 0) {
      this.camera.shake(2, 10);
    }

    // add sparkles
    if (this.count % 2 === 0) {
      const sparkle = new Pxl.Actor(this);
      sparkle.graphics.push(new Pxl.ColorRectangle(sparkle));
      const size = ~~(Math.random() * 2 + 1);
      sparkle.graphics[0].width = size;
      sparkle.graphics[0].height = size;
      sparkle.graphics[0].color = "#111";
      // sparkle.graphics[0].color = "#3a0065";
      sparkle.graphics[0].alpha = 1;
      sparkle.graphics[0].z = Math.random() > .5 ? -1 : 1;
      sparkle.body = new Pxl.Body();
      sparkle.body.velocity.d = Math.PI * .4 + Math.random() * Math.PI * .2;
      sparkle.body.velocity.m = Math.random() * .5 + .1;
      sparkle.body.x = ~~(Math.random() * this.game.width - size);
      sparkle.body.y = ~~(Math.random() * this.game.height - size);
      this.addActor(sparkle);
      const tween = this.tween.add(
        sparkle.graphics[0],
        "alpha",
        sparkle.graphics[0].alpha,
        0,
        ~~(Math.random() * 90 + 60),
        "linear"
      );
      tween.beacon.observe(this, "completed", () => {
        sparkle.alive = false;
      });
    }
  }

  onActorRemoved() {
  }

  onKeyPressed(target, keyCode) {
    this.startGame();
  }

  onTouchStarted(target, touch) {
    this.startGame();
  }

  startGame() {
    this.beacon.emit("completed", PlayScene);
  }
}
