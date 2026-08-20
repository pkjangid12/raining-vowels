import Phaser from "phaser";
import { createBackground } from "../utils/helper";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("PreloaderScene");
  }

  preload() {
    const { width, height } = this.scale;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    //-----------------------------------
    // Background
    //-----------------------------------
    createBackground(this, "preload-bg");

    ///////////////logo////////////////////
    const logo = this.add
      .image(centerX, centerY * 0.45, "preload-logo")
      .setScale(0.3);
    //-----------------------------------
    // Progress Bar Settings
    //-----------------------------------

    const barWidth = 650;
    const barHeight = 60;
    const radius = 20;

    const barX = (width - barWidth) * 0.5;
    // const barY = height - 265; // Adjust until it matches your artwork

    // Match this Y position with the empty bar in your background.
    const barY = centerY + 555;

    //-----------------------------------
    // Outer Border
    //-----------------------------------

    const border = this.add.graphics();

    border.lineStyle(8, 0xffff00, 1);

    border.strokeRoundedRect(
      centerX - barWidth / 2,
      barY,
      barWidth,
      barHeight,
      radius,
    );

    //-----------------------------------
    // Progress Fill
    //-----------------------------------

    const fill = this.add.graphics();

    //-----------------------------------
    // Percentage
    //-----------------------------------

    const percentText = this.add
      .text(centerX, barY + 30, "0%", {
        fontFamily: "Arial",
        fontSize: "42px",
        fontStyle: "bold",
        color: "#f3f30d",
      })
      .setOrigin(0.5);

    //-----------------------------------
    // Loader Events
    //-----------------------------------

    this.load.on("progress", (value) => {
      fill.clear();

      const fillWidth = (barWidth - 10) * value;

      // Blue gradient
      //   fill.fillGradientStyle(
      //     0x48c8ff, // top-left
      //     0x1688ff, // top-right
      //     0x1f7cff, // bottom-left
      //     0x0d63ff, // bottom-right
      //     1,
      //   );

      //////////////red gradient////////////
      //   fill.fillGradientStyle(
      //     0xff3b30, // top-left
      //     0xe0201a, // top-right
      //     0xcc1111, // bottom-left
      //     0x990000, // bottom-right
      //     1,
      //   );

      ////////////baby pink gradient////////
      fill.fillGradientStyle(
        0xfb1565, // top-left (your base color)
        0xfb1565, // top-right
        0xc10c4c, // bottom-left (darker shade)
        0xc10c4c, // bottom-right
        1,
      );

      fill.fillRoundedRect(barX + 5, barY + 5, fillWidth, barHeight - 10, 16);

      // Diagonal glossy stripes
      fill.lineStyle(10, 0xffffff, 0.08);

      for (let x = -40; x < fillWidth; x += 30) {
        fill.beginPath();

        fill.moveTo(barX + 5 + x, barY + barHeight - 5);

        fill.lineTo(barX + 35 + x, barY + 5);

        fill.strokePath();
      }

      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    //-----------------------------------
    // Load Game Assets
    //-----------------------------------

    // Backgrounds
    this.load.image(
      "playBtn",
      assetPath("Assets/Images/PreloaderScene/Start.png"),
    );
    this.load.image(
      "gameInctructions",
      assetPath("Assets/Images/PreloaderScene/Howtoplay.png"),
    );

    this.load.image(
      "bunny",
      assetPath("Assets/Images/PreloaderScene/Rabbit.png"),
    );

    // ==========================================
    // EASY GAME SCENE ASSETS
    // ==========================================

    this.load.image("dropBlue", assetPath("Assets/Images/gameScene/blue.png"));

    this.load.image(
      "dropGolden",
      assetPath("Assets/Images/gameScene/golden.png"),
    );

    this.load.image(
      "dropGreen",
      assetPath("Assets/Images/gameScene/green.png"),
    );

    this.load.image(
      "dropLightBlue",
      assetPath("Assets/Images/gameScene/lightBlue.png"),
    );

    this.load.image(
      "dropLightGreen",
      assetPath("Assets/Images/gameScene/lightGreen.png"),
    );

    this.load.image("dropPink", assetPath("Assets/Images/gameScene/pink.png"));

    this.load.image(
      "dropPurple",
      assetPath("Assets/Images/gameScene/purple.png"),
    );

    this.load.image("dropRed", assetPath("Assets/Images/gameScene/red+.png"));

    this.load.image(
      "dropSkyBlue",
      assetPath("Assets/Images/gameScene/skyBlue.png"),
    );

    this.load.image(
      "dropYellow",
      assetPath("Assets/Images/gameScene/yellow.png"),
    );

    // ==========================================
    // GAME UI
    // ==========================================

    this.load.image(
      "scorePanel",
      assetPath("Assets/Images/gameScene/Score.png"),
    );

    this.load.image(
      "missedPanel",
      assetPath("Assets/Images/gameScene/Missed.png"),
    );

    // ==========================================
    // CHARACTER
    // ==========================================

    this.load.image(
      "playRabbit",
      assetPath("Assets/Images/gameScene/Play Rabbit.png"),
    );

    // ==========================================
    // GAME OVER SCENE
    // ==========================================

    this.load.image(
      "gameOverPopup",
      assetPath("Assets/Images/gameOverScene/popup.png"),
    );

    this.load.image(
      "gameOverHome",
      assetPath("Assets/Images/gameOverScene/home.png"),
    );

    this.load.image(
      "missedIcon",
      assetPath("Assets/Images/gameOverScene/MissedVowels.png"),
    );

    this.load.image(
      "gameOverPlayAgain",
      assetPath("Assets/Images/gameOverScene/PlayAgain.png"),
    );

    this.load.image(
      "gameOverRabbit",
      assetPath("Assets/Images/gameOverScene/Rabbit.png"),
    );

    this.load.image(
      "gameOverStar",
      assetPath("Assets/Images/gameOverScene/Star.png"),
    );

    this.load.image(
      "gameOverStarEmpty",
      assetPath("Assets/Images/gameOverScene/Star2.png"),
    );

    this.load.image(
      "gameOverScoreLabel",
      assetPath("Assets/Images/gameOverScene/Yourscore.png"),
    );

    this.load.image(
      "gameOverOverlay",
      assetPath("Assets/Images/gameOverScene/overlay.png"),
    );

    this.load.atlas(
      "flares",
      assetPath("Assets/Particles/flares.png"),
      assetPath("Assets/Particles/flares.json"),
    );

    ///////////audio//////////////

    this.load.audio("gameplayMusic", assetPath("Assets/Audio/bgSound.mp3"));
    this.load.audio(
      "buttonClickSound",
      assetPath("Assets/Audio/buttonClickSound.mp3"),
    );
    this.load.audio(
      "gameOverSound",
      assetPath("Assets/Audio/gameOverSound.mp3"),
    );
    this.load.audio(
      "wrongSelectionSound",
      assetPath("Assets/Audio/wrongSelectionSound.mp3"),
    );
    this.load.audio("popSound", assetPath("Assets/Audio/popSound.mp3"));
    this.load.audio(
      "clockSound",
      assetPath("Assets/Audio/clock-tick-single-gfx-sound.mp3"),
    );

    this.load.audio(
      "starCollectionSound",
      assetPath("Assets/Audio/starCollectionSound.mp3"),
    );

    //-----------------------------------
    // Complete
    //-----------------------------------

    this.load.once("complete", () => {
      this.cameras.main.fadeOut(350);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("LevelSelectScene");
      });
    });
  }

  create() {
    const graphics = this.make.graphics({ x: 0, y: 0 });

    const audioManager = this.registry.get("audioManager");

    audioManager.initialize(this);

    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(8, 8, 8);
    graphics.generateTexture("sparkle-particle", 16, 16);
    graphics.destroy();
  }
}
