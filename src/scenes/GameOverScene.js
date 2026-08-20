import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  init(data) {
    this.score = data?.score ?? 0;
    this.won = data?.won ?? false;
    this.missed = data?.missed ?? 0;
    this.reason = data?.reason ?? "time";
  }

  create() {
    this.audioManager = this.registry.get("audioManager");
    this.audioManager.stopGameplayMusic();
    this.audioManager.playGameOver();

    this.createBackground();
    this.createOverlay();
    this.createPopup();
    // this.createResultMessage();
    this.createRabbit();
    this.createScore();
    this.createMissed();
    this.createStars();
    this.createButtons();

    console.log(this.missed);
  }

  // ----------------------------------------
  // BACKGROUND
  // ----------------------------------------

  createBackground() {
    this.background = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "preload-bg",
    );

    this.background.setDisplaySize(this.scale.width, this.scale.height);
  }

  // ----------------------------------------
  // OVERLAY
  // ----------------------------------------

  createOverlay() {
    this.overlay = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "gameOverOverlay",
    );

    this.overlay.setDisplaySize(this.scale.width, this.scale.height);

    this.overlay.setAlpha(0.8).setInteractive();
  }

  // ----------------------------------------
  // POPUP
  // ----------------------------------------

  createPopup() {
    this.popup = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2 - 30,
      "gameOverPopup",
    );

    this.popup.setScale(0.25, 0.25);
  }

  // ----------------------------------------
  // RESULT MESSAGE
  // ----------------------------------------

  createResultMessage() {
    const message = this.won ? "GREAT JOB!" : "TIME UP!";

    const color = this.won ? "#20b83c" : "#e53935";

    this.resultText = this.add.text(this.scale.width / 2, 500, "GREAT JOB!", {
      fontFamily: "Fredoka",
      fontSize: "64px",
      fontStyle: "bold",
      color,
      stroke: "#ffffff",
      strokeThickness: 8,
    });

    this.resultText.setOrigin(0.5).setDepth(1);
  }

  // ----------------------------------------
  // RABBIT
  // ----------------------------------------

  createRabbit() {
    this.rabbit = this.add.image(this.scale.width / 2, 450, "gameOverRabbit");

    this.rabbit.setScale(0.22);

    this.tweens.add({
      targets: this.rabbit,
      y: this.rabbit.y - 12,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  // ----------------------------------------
  // SCORE
  // ----------------------------------------

  createScore() {
    this.scoreLabel = this.add.image(
      this.scale.width / 2,
      890,
      "gameOverScoreLabel",
    );

    this.scoreLabel.setScale(0.25);

    this.scoreText = this.add.text(this.scale.width / 2, 900, `${this.score}`, {
      fontFamily: "Fredoka",
      fontSize: "48px",
      fontStyle: "bold",
      color: "#34234d",
    });

    this.scoreText.setOrigin(0.5);

    this.levelText = this.add.text(
      this.scale.width / 2,
      950,
      this.reason === "time" ? "120 SECOND RUN COMPLETE!" : "RUN FINISHED!",
      {
        fontFamily: "Fredoka",
        fontSize: "30px",
        fontStyle: "bold",
        color: "#34527a",
      },
    );

    this.levelText.setOrigin(0.5);
  }

  createMissed() {
    this.missedLabel = this.add.image(this.scale.width / 2, 1110, "missedIcon");

    this.missedLabel.setScale(0.25);

    this.missedText = this.add.text(
      this.scale.width / 2,
      1145,
      `${this.missed}`,
      {
        fontFamily: "Fredoka",
        fontSize: "48px",
        fontStyle: "bold",
        color: "#34234d",
      },
    );

    this.missedText.setOrigin(0.5);

    // this.levelText = this.add.text(
    //   this.scale.width / 2,
    //   950,
    //   this.won ? "All 10 levels completed!" : `Reached Level ${this.level}`,
    //   {
    //     fontFamily: "Fredoka",
    //     fontSize: "30px",
    //     fontStyle: "bold",
    //     color: "#34527a",
    //   },
    // );

    // this.levelText.setOrigin(0.5);
  }

  // ----------------------------------------
  // STARS
  // ----------------------------------------

  createStars() {
    const totalStars = 5;

    const earnedStars = this.calculateStars();

    const spacing = 115;

    const startX = this.scale.width / 2 - ((totalStars - 1) * spacing) / 2;

    this.stars = [];

    for (let i = 0; i < totalStars; i++) {
      const star = this.add.image(
        startX + i * spacing,
        1400,
        i < earnedStars ? "gameOverStar" : "gameOverStarEmpty",
      );

      star.setScale(0.2);

      this.stars.push(star);
    }
  }

  calculateStars() {
    if (this.missed === 0) {
      return 5;
    }

    if (this.missed <= 2) {
      return 4;
    }

    if (this.missed <= 4) {
      return 3;
    }

    if (this.missed <= 6) {
      return 2;
    }

    if (this.missed <= 8) {
      return 1;
    }

    return 0;
  }

  // ----------------------------------------
  // BUTTONS
  // ----------------------------------------

  createButtons() {
    this.createPlayAgainButton();
    this.createHomeButton();
  }

  createPlayAgainButton() {
    this.playAgainButton = this.add.image(
      this.scale.width / 2 - 200,
      1680,
      "gameOverPlayAgain",
    );

    this.playAgainButton.setScale(0.25);

    this.makeButtonInteractive(this.playAgainButton, () => {
      this.scene.start("EasyGameScene", {
        level: 1,
        score: 0,
      });
    });
  }

  createHomeButton() {
    this.homeButton = this.add.image(
      this.scale.width / 2 + 250,
      1680,
      "gameOverHome",
    );

    this.homeButton.setScale(0.22);

    this.makeButtonInteractive(this.homeButton, () => {
      this.scene.start("LevelSelectScene");
    });
  }

  // ----------------------------------------
  // BUTTON INTERACTION
  // ----------------------------------------

  makeButtonInteractive(button, callback) {
    button.setInteractive({
      useHandCursor: true,
    });

    button.on("pointerover", () => {
      this.tweens.add({
        targets: button,
        scale: button.scaleX * 1.05,
        duration: 120,
      });
    });

    button.on("pointerout", () => {
      this.tweens.add({
        targets: button,
        scale: button.scaleX / 1.05,
        duration: 120,
      });
    });

    button.on("pointerdown", (pointer, localX, localY, event) => {
      // Stop this click from reaching the next scene
      event.stopPropagation();

      // Disable current scene input
      this.input.enabled = false;

      callback();
    });
  }
}
