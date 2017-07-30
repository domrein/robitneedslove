/*
Paul Milham
7/29/17
*/

"use strict";

class Robot extends Pxl.Actor {
  constructor(scene) {
    super(scene);

    this.batteryCount = 0;

    this.body = new Pxl.Body();
    this.body.width = this.body.height = 16;
    this.body.beacon.observe(this, "collided", this.onCollided);
    this.body.type = "player";

    this.bodySprite = new Pxl.Sprite(this);
    this.bodySprite.offset.y = -1;
    this.bodySprite.play("robotBody");
    this.graphics.push(this.bodySprite);

    this.headSprite = new Pxl.Sprite(this);
    this.headSprite.offset.y = -9;
    this.headSprite.play("robotHead");
    this.graphics.push(this.headSprite);

    this.neckGraphic = new Pxl.ColorRectangle(this);
    this.neckGraphic.offset.x = 7;
    this.neckGraphic.width = 2;
    this.neckGraphic.height = 0;
    this.neckGraphic.color = "#696A6A";
    this.graphics.push(this.neckGraphic);

    this.neckGraphicShadow = new Pxl.ColorRectangle(this);
    this.neckGraphicShadow.offset.x = 8;
    this.neckGraphicShadow.width = 1;
    this.neckGraphicShadow.height = 0;
    this.neckGraphicShadow.color = "#595652";
    this.graphics.push(this.neckGraphicShadow);

    this.burstSprite = new Pxl.Sprite(this);
    this.burstSprite.play("burst");
    this.burstSprite.offset.y = this.headSprite.offset.y - 2;
    this.graphics.push(this.burstSprite);
  }

  update() {
    super.update();
  }

  moveHead(up) {
    up ? this.headSprite.offset.y -= 2 : this.headSprite.offset.y += 2;
    if (this.headSprite.offset.y > -9) {
      this.headSprite.offset.y = -9;
    }
    else if (this.headSprite.offset.y < -190) {
      this.headSprite.offset.y = -190;
    }
    this.neckGraphic.height = Math.abs(this.headSprite.offset.y) - 10;
    this.neckGraphic.offset.y = (Math.abs(this.headSprite.offset.y) - 10) * -1 + 6;
    this.neckGraphicShadow.height = Math.abs(this.headSprite.offset.y) - 10;
    this.neckGraphicShadow.offset.y = (Math.abs(this.headSprite.offset.y) - 10) * -1 + 6;
    this.burstSprite.offset.y = this.headSprite.offset.y - 2;
  }

  moveBody(left) {
    this.flipped = !left;
    if (left) {
      this.body.x -= 1;
    }
    else {
      this.body.x += 1;
    }
    this.headSprite.flip = this.flipped;
    this.bodySprite.flip = this.flipped;
    if (this.flipped) {
      this.neckGraphicShadow.offset.x = 7;
      this.burstSprite.offset.x = 1;
    }
    else {
      this.neckGraphicShadow.offset.x = 8;
      this.burstSprite.offset.x = 0;
    }
  }

  fire() {
    this.burstSprite.play("burst");
    const laser = new Laser(this.scene);
    laser.body.velocity.d = this.flipped ? 0 : Math.PI;
    laser.body.x = this.body.x;
    laser.body.y = this.body.y + this.headSprite.offset.y + 2;
    this.scene.addActor(laser);
    this.scene.game.audioMixer.play("laser");
  }

  poop() {
    if (this.batteryCount) {
      this.batteryCount--;
      const battery = new Battery(this.scene);
      if (this.flipped) {
        battery.body.x = this.body.x - 8;
        battery.body.velocity.d = Math.random() * Math.PI * .4 + Math.PI * 1.1;
      }
      else {
        battery.body.x = this.body.x + this.body.width;
        battery.body.velocity.d = Math.random() * Math.PI * .4 + Math.PI * 1.6;
      }
      battery.body.y = this.body.y + 10;
      battery.body.velocity.m = 5;
      this.scene.addActor(battery);
      this.scene.game.audioMixer.play("poop");
    }
  }

  getBattery() {
    this.batteryCount++;
    this.scene.game.audioMixer.play("robotBatteryGet");
  }

  onCollided(targer, collidee) {
    if (collidee.type === "battery") {
      this.getBattery();
    }

    // this.scene.camera.shake(4, 60 * 2);
    // const numBits = Math.floor(Math.random() * 10) + 100;
    // for (let i = 0; i < numBits; i++) {
    //   const bit = new MoveyBit(this.scene, "squarey", this.body.x, this.body.y);
    //   this.scene.addActor(bit);
    // }
    // this.alive = false;
  }
}