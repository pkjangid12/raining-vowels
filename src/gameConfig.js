import Phaser from "phaser";

import BootScene from "./scenes/BootScene";
import PreloaderScene from "./scenes/PreloaderScene";
import LevelSelectScene from "./scenes/LevelSelectScene";
import EasyGameScene from "./scenes/EasyGameScene.js";
import GameOverScene from "./scenes/GameOverScene";

const gameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#2fc4f5",
  width: 1080,
  height: 1920,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 480,
    },
    max: {
      width: 1440,
      height: 2560,
    },
  },

  render: {
    antialias: true,
    antialiasGL: true,
    pixelArt: false,
    roundPixels: false,
    powerPreference: "high-performance",
  },

  input: {
    activePointers: 3,
    touch: {
      capture: true,
    },
  },

  scene: [
    BootScene,
    PreloaderScene,
    LevelSelectScene,
    EasyGameScene,
    GameOverScene,
  ],
};

export default gameConfig;
