import Phaser from "phaser";
import { createBackground } from "../utils/helper";

export default class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super("LevelSelectScene");
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Background
    createBackground(this, "preload-bg");

    const logo = this.add
      .image(centerX, centerY * 0.37, "preload-logo")
      .setScale(0.28);

    const instruction = this.add
      .image(centerX, centerY * 0.85, "gameInctructions")
      .setScale(0.28);

    const bunny = this.add
      .image(centerX, centerY * 1.5, "bunny")
      .setScale(0.28);

    // this.tweens.add({
    //   targets: bunny,
    //   x: bunny.x + 20, // move 20px to the right of its current position
    //   duration: 1200,
    //   ease: "Sine.easeInOut",
    //   yoyo: true, // comes back to original position
    //   repeat: -1, // loop forever
    // });

    // Left-right sway
    this.tweens.add({
      targets: bunny,
      x: bunny.x + 15,
      duration: 1400,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Subtle up-down bob (slightly different duration so it doesn't sync perfectly — feels more organic)
    this.tweens.add({
      targets: bunny,
      y: bunny.y - 10,
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Tiny rotation wobble (in radians — very small angle)
    this.tweens.add({
      targets: bunny,
      angle: 3, // degrees, since Phaser's `angle` prop is in degrees (not `rotation`, which is radians)
      duration: 1600,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // ---------- Play Button ----------
    const BASE_SCALE = 0.3;
    const HOVER_SCALE = 0.32;
    const PRESS_SCALE = 0.29;

    const button = this.add
      .image(centerX, height - 220, "playBtn")
      .setScale(BASE_SCALE);
    button.setInteractive({ useHandCursor: true });

    // helper so every tween call is consistent
    const tweenScaleTo = (targetScale, duration = 150) => {
      this.tweens.killTweensOf(button); // stop any tween in progress first
      this.tweens.add({
        targets: button,
        scaleX: targetScale,
        scaleY: targetScale,
        duration,
        ease: "Sine.easeOut",
      });
    };

    button.on("pointerover", () => {
      tweenScaleTo(HOVER_SCALE, 150);
    });

    button.on("pointerout", () => {
      tweenScaleTo(BASE_SCALE, 150);
    });

    button.on("pointerdown", () => {
      tweenScaleTo(PRESS_SCALE, 80); // faster, snappier press-down feel
      tweenScaleTo(BASE_SCALE, 100);

      this.cameras.main.fadeOut(350);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("EasyGameScene");
      });
    });

    // button.on("pointerup", () => {
    //   tweenScaleTo(BASE_SCALE, 100);

    //   this.cameras.main.fadeOut(350);

    //   this.cameras.main.once("camerafadeoutcomplete", () => {
    //     this.scene.start("EasyGameScene");
    //   });
    // });
  }
}
