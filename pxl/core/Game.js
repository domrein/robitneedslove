"use strict";
// // requestAnimationFrame polyfill
// var lastTime = 0;
// if (!window.requestAnimationFrame) {
//   ["webkit", "moz"].forEach(function(vendor) {
//     window.requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
//   });
// }
//
// if (!window.requestAnimationFrame) {
//   window.requestAnimationFrame = function(callback, element) {
//     var currTime = new Date().getTime();
//     var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//     var id = window.setTimeout(function(){callback(currTime + timeToCall);}, timeToCall);
//     lastTime = currTime + timeToCall;
//     return id;
//   };
// }
// // end requestAnimationFrame polyfill

Pxl.Game = class {
  constructor(width, height, firstSceneClass, rendererClass, canvasId) {
    this.renderer = new rendererClass(this, canvasId);
    this.beacon = new Pxl.Beacon(this);

    this.inputRelay = new Pxl.InputRelay(this);

    this.width = width;
    this.height = height;
    window.addEventListener("resize", () => this.onDisplayResize());
    this.onDisplayResize();

    this.firstSceneClass = firstSceneClass;
    this.scenes = [];
    this.sceneDirector = new Pxl.SceneDirector(this.scenes, this);
    this.lastTime = -1;
    this.time = -1;
    this.updateRate = 1000 / 60;
    this.deltaTime = 0;
    this.spriteStore = new Pxl.SpriteStore();
    this.audioMixer = new Pxl.AudioMixer();
    this.dataStore = new Pxl.DataStore();

    this.preloader = new Pxl.Preloader();
    // TODO: logic is inconsistent with handling loading
    this.preloader.beacon.observe(this.spriteStore, "imageLoaded", (source, image, name) => this.spriteStore.addImage(image, name));
    this.preloader.beacon.observe(this.spriteStore, "completed", () => {
      if (this.dataStore.data.frameData) {
        this.spriteStore.frameData = this.dataStore.data.frameData;
      }
      if (this.dataStore.data.animData) {
        this.spriteStore.animData = this.dataStore.data.animData;
      }
      this.spriteStore.buildAnims();
    });
    this.preloader.beacon.observe(this.audioMixer, "audioContextCreated", this.audioMixer.onContextCreated);
    this.preloader.beacon.observe(this.audioMixer, "audioLoaded", this.audioMixer.onAudioLoaded);
    this.preloader.beacon.observe(this.dataStore, "dataLoaded", (source, data, name) => this.dataStore.addData(data, name));
    this.preloader.beacon.observe(this, "completed", this.onPreloaderCompleted);

    this.saveData = new Pxl.SaveData();
  }

  init() {
    this.preloader.load();
  }

  update(event) {
    this.time = new Date().getTime();
    if (this.lastTime == -1) {
      this.lastTime = this.time;
    }
    this.deltaTime += this.time - this.lastTime;
    this.lastTime = this.time;
    // if we've missed a ton of frames, then the user has navigated away or something, so just skip them
    if (this.deltaTime > this.updateRate * 10) {
      this.deltaTime = 0;
    }
    var scene, i;
    while (this.deltaTime > this.updateRate) {
      for (i = 0; i < this.scenes.length; i++) {
        scene = this.scenes[i];
        if (!scene.paused) {
          scene.update();
        }
      }
      this.deltaTime -= this.updateRate;
    }

    this.renderer.render();

    window.requestAnimationFrame(event => this.update(event));
  }

  onPreloaderCompleted(source) {
    this.preloader.beacon.ignore(this, "completed", this.onPreloaderCompleted);
    this.sceneDirector.addScene(this.firstSceneClass);
    this.update();
  }

  onDisplayResize() {
    // find display size and get ratio
    var widthRatio = window.innerWidth / this.width;
    var heightRatio = window.innerHeight / this.height;
    this.displayRatio = widthRatio;
    if (this.height * widthRatio > window.innerHeight) {
      this.displayRatio = heightRatio;
    }
    this.displayOffsetX = Math.round(window.innerWidth - this.width * this.displayRatio) / 2;
    this.displayOffsetY = Math.round(window.innerHeight - this.height * this.displayRatio) / 2;

    document.getElementById("canvas").width = this.width * this.displayRatio;
    document.getElementById("canvas").height = this.height * this.displayRatio;
    // TODO: make sure the fullscreen toggling is correct and unprefix it
    if (!document.webkitFullscreenElement) {
      document.getElementById("canvas").style.marginLeft = this.displayOffsetX  + "px";
      document.getElementById("canvas").style.marginTop = this.displayOffsetY  + "px";
    }
    else {
      document.getElementById("canvas").style.marginLeft = "0px";
      document.getElementById("canvas").style.marginTop = "0px";
    }

    this.beacon.emit("displayResized", null);
  }
};
