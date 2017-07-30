"use strict";

const gulp = require("gulp");
const spritesmith = require("gulp.spritesmith");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const fs = require("fs");


gulp.task("compile", function () {
  try {
    fs.unlinkSync("dist/app.js");
  }
  catch (err) {
  }

  return gulp.src([
      "../PxlNew/core/Globals.js",
      "../PxlNew/actor/Actor.js",
      "../PxlNew/actor/Brain.js",
      "../PxlNew/actor/Graphic.js",
      "../PxlNew/core/AudioMixer.js",
      "../PxlNew/core/Beacon.js",
      "../PxlNew/core/Canvas2dRenderer.js",
      "../PxlNew/core/Game.js",
      "../PxlNew/core/InputRelay.js",
      "../PxlNew/core/Point.js",
      "../PxlNew/core/Preloader.js",
      "../PxlNew/core/SaveData.js",
      "../PxlNew/scene/Camera.js",
      "../PxlNew/scene/Input.js",
      "../PxlNew/scene/Physics.js",
      "../PxlNew/scene/Scene.js",
      "../PxlNew/scene/SceneDirector.js",
      "../PxlNew/core/SpriteStore.js",
      "../PxlNew/actor/Sprite.js",
      "../PxlNew/actor/Text.js",
      "../PxlNew/core/Rectangle.js",
      "../PxlNew/actor/Body.js",
      "code/actor/Squarey.js",
      "code/actor/Movey.js",
      "code/actor/MoveyBit.js",
      "code/scene/PlayScene.js",
      "code/Game.js",
      "index.js",
  ]).pipe(babel())
    .pipe(concat("app.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("sprite", function () {
  const spriteData = gulp.src(["assets/images/*.png", "assets/images/*.jpg"]).pipe(spritesmith({
    imgName: "sprites.png",
    cssName: "sprites.json",
    cssTemplate: data => {
      const spriteObj = {};
      for (const sprite of data.sprites) {
        spriteObj[sprite.name] = {
          x: sprite.x,
          y: sprite.y,
          width: sprite.width,
          height: sprite.height,
        };
      }

      return JSON.stringify(spriteObj);
    },
  }));

  return spriteData.pipe(gulp.dest("assets/"));
});

gulp.task("default", ["sprite", "compile"]);
