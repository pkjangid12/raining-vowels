import Phaser from "phaser";

import playBallPopEffect from "../effects/playBallPopEffect.js";
import playScoreRewardEffect from "../effects/playScoreRewardEffect.js";

export default class EasyGameScene extends Phaser.Scene {
  constructor() {
    super("EasyGameScene");
  }

  init(data) {
    this.level = data?.level ?? 1;
    this.score = data?.score ?? 0;
    this.missed = data?.missed ?? 0;
    this.levelCompleting = false;
    this.gameOver = false;

    ////////timer/////

    this.timeLimit = 120;
    this.timeLeft = this.timeLimit;
    this.timerEvent = null;
    this.dropSpawnEvent = null;
  }

  create() {
    this.createBackground();
    this.createHUD();
    this.createRabbit();
    this.createBallPopEmitter();
    this.createRaindrops();
    this.startDropSpawner();
    this.startTimer();

    this.audioManager = this.registry.get("audioManager");

    this.audioManager.playGameplayMusic();

    console.log(this.audioManager.gameplayMusic.volume);
    console.log(this.audioManager.popSoundEffect.volume);
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
  // HUD
  // ----------------------------------------

  createHUD() {
    this.createScorePanel();
    this.createMissedPanel();
    this.createLevelText();
  }

  createScorePanel() {
    this.scorePanel = this.add.image(250, 145, "scorePanel");

    this.scorePanel.setScale(1.2);

    // Score
    this.scoreText = this.add.text(330, 170, `${this.score}`, {
      fontFamily: "Arial Rounded MT Bold, Arial",
      fontSize: "62px",
      fontStyle: "bold",
      color: "#34234d",
    });

    this.scoreText.setOrigin(0.5);

    // Timer
    this.timerText = this.add.text(120, 160, `${this.timeLeft}`, {
      fontFamily: "Arial Rounded MT Bold, Arial",
      fontSize: "58px",
      fontStyle: "bold",
      color: "#34234d",
    });

    this.timerText.setOrigin(0.5);
  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,

      callback: () => {
        this.timeLeft--;

        this.timerText.setText(`${this.timeLeft}`);

        // Play tick during final 10 seconds
        if (this.timeLeft <= 10 && this.timeLeft > 0) {
          this.audioManager.playTick();
        }

        this.updateTimerAppearance();

        if (this.timeLeft <= 0) {
          this.handleTimeUp();
        }
      },

      loop: true,
    });
  }

  updateTimerAppearance() {
    if (this.timeLeft <= 10) {
      this.timerText.setColor("#e53935");

      this.tweens.add({
        targets: this.timerText,
        scale: 1.1,
        duration: 150,
        yoyo: true,
        ease: "Sine.easeInOut",
      });
    }
  }

  handleTimeUp() {
    if (this.levelCompleting || this.gameOver) {
      return;
    }

    this.stopTimer();

    this.gameOver = true;

    this.input.enabled = false;

    this.time.delayedCall(1200, () => {
      this.scene.start("GameOverScene", {
        score: this.score,
        missed: this.missed,
        level: this.level,
        won: false,
        reason: "time",
      });
    });
  }

  stopTimer() {
    if (this.timerEvent) {
      this.timerEvent.remove();

      this.timerEvent = null;
    }

    if (this.dropSpawnEvent) {
      this.dropSpawnEvent.remove();

      this.dropSpawnEvent = null;
    }
  }

  showTimeUpMessage() {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.4,
    );

    overlay.setDepth(50);

    const message = this.add.text(width / 2, height / 2, "TIME UP! ⏰", {
      fontFamily: "Fredoka",
      fontSize: "72px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#e53935",
      strokeThickness: 10,
    });

    message.setOrigin(0.5);
    message.setDepth(51);
  }

  createMissedPanel() {
    this.missedPanel = this.add.image(
      this.scale.width - 220,
      145,
      "missedPanel",
    );

    this.missedPanel.setScale(0.1);

    this.missedText = this.add.text(
      this.scale.width - 250,
      170,
      `${this.missed} / 10`,
      {
        fontFamily: "Arial Rounded MT Bold, Arial",
        fontSize: "58px",
        fontStyle: "bold",
        color: "#34234d",
      },
    );

    this.missedText.setOrigin(0.5);
  }

  createLevelText() {
    this.levelText = this.add.text(
      this.scale.width / 2,
      55,
      `LEVEL ${this.level}`,
      {
        fontFamily: "Arial Rounded MT Bold, Arial",
        fontSize: "46px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#1672d4",
        strokeThickness: 10,
      },
    );

    this.levelText.setOrigin(0.5);
  }

  // ----------------------------------------
  // RABBIT
  // ----------------------------------------

  createRabbit() {
    this.bunny = this.add.image(
      this.scale.width / 2 - 250,
      this.scale.height - 280,
      "playRabbit",
    );

    this.bunny.setScale(0.2);

    this.addRabbitAnimation();
  }

  addRabbitAnimation() {
    // Left-right sway
    this.tweens.add({
      targets: this.bunny,
      x: this.bunny.x + 15,
      duration: 1400,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Subtle up-down bob (slightly different duration so it doesn't sync perfectly — feels more organic)
    this.tweens.add({
      targets: this.bunny,
      y: this.bunny.y - 10,
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Tiny rotation wobble (in radians — very small angle)
    this.tweens.add({
      targets: this.bunny,
      angle: 3, // degrees, since Phaser's `angle` prop is in degrees (not `rotation`, which is radians)
      duration: 1600,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  // ----------------------------------------
  // RAINDROPS
  // ----------------------------------------

  createRaindrops() {
    const drops = this.getLevelDrops();

    drops.slice(0, 4).forEach((drop, index) => {
      this.createRaindrop(drop, index);
    });
  }

  startDropSpawner() {
    this.dropSpawnEvent = this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => {
        if (!this.gameOver && !this.levelCompleting) {
          const drop = Phaser.Utils.Array.GetRandom(this.getLevelDrops());
          this.createRaindrop(drop, 0);
        }
      },
    });
  }

  getLevelDrops() {
    const drops = [
      {
        letter: "A",
        texture: "dropGreen",
      },
      {
        letter: "E",
        texture: "dropRed",
      },
      {
        letter: "I",
        texture: "dropPurple",
      },
      {
        letter: "O",
        texture: "dropGolden",
      },
      {
        letter: "U",
        texture: "dropBlue",
      },

      {
        letter: "B",
        texture: "dropPink",
      },
      {
        letter: "C",
        texture: "dropLightBlue",
      },
      {
        letter: "D",
        texture: "dropLightGreen",
      },
      {
        letter: "K",
        texture: "dropSkyBlue",
      },
      {
        letter: "T",
        texture: "dropYellow",
      },
    ];

    return Phaser.Utils.Array.Shuffle(drops);
  }

  createRaindrop(dropData, index) {
    const position = this.getDropPosition();

    const container = this.add.container(position.x, position.y);

    const dropImage = this.add.image(0, 0, dropData.texture);

    dropImage.setScale(0.15);

    const letter = this.add.text(0, 10, dropData.letter, {
      fontFamily: "Fredoka",
      fontSize: "72px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#1764c0",
      strokeThickness: 7,
    });

    letter.setOrigin(0.5);

    container.add([dropImage, letter]);

    container.setSize(dropImage.displayWidth, dropImage.displayHeight);

    container.setInteractive({
      useHandCursor: true,
    });

    container.letter = dropData.letter;

    container.isVowel = this.isVowel(dropData.letter);

    container.on("pointerdown", () => this.onRaindropClicked(container));

    this.addDropAnimation(container, index);
  }

  getDropPosition() {
    const margin = 100;

    return {
      x: Phaser.Math.Between(margin, this.scale.width - margin),
      y: Phaser.Math.Between(-260, -80),
    };
  }

  addDropAnimation(drop, index) {
    const groundY = this.scale.height - 220;
    const landingY = groundY - drop.height / 2;

    this.tweens.add({
      targets: drop,
      y: landingY,
      duration: Phaser.Math.Between(7000, 9000),
      delay: index * 450,
      ease: "Linear",
      onComplete: () => this.handleMissedDrop(drop, groundY),
    });

    this.tweens.add({
      targets: drop,
      angle: Phaser.Math.Between(-8, 8),
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  // ----------------------------------------
  // HELPERS
  // ----------------------------------------

  isVowel(letter) {
    return ["A", "E", "I", "O", "U"].includes(letter);
  }

  // ----------------------------------------
  // TEMPORARY CLICK HANDLER
  // ----------------------------------------

  onRaindropClicked(drop) {
    if (!drop.active) {
      return;
    }

    drop.active = false;

    // Play pop effect at the clicked raindrop
    playBallPopEffect(this, drop.x, drop.y, 20);

    if (drop.isVowel) {
      this.handleCorrectDrop(drop);
    } else {
      this.handleWrongDrop(drop);
    }
  }

  handleMissedDrop(drop, groundY) {
    if (!drop.active || this.gameOver || this.levelCompleting) {
      return;
    }

    drop.active = false;
    drop.y = groundY - drop.height / 2;

    this.tweens.add({
      targets: drop,
      y: drop.y - 28,
      duration: 110,
      yoyo: true,
      ease: "Sine.easeOut",
      onComplete: () => this.burstMissedDrop(drop, groundY),
    });
  }

  burstMissedDrop(drop, groundY) {
    playBallPopEffect(this, drop.x, groundY, 20);

    const burst = this.add.circle(drop.x, groundY, 24, 0xffffff, 0);
    burst.setStrokeStyle(8, 0xffffff, 0.9).setDepth(9);

    this.tweens.add({
      targets: burst,
      scale: 2.2,
      alpha: 0,
      duration: 300,
      ease: "Cubic.easeOut",
      onComplete: () => burst.destroy(),
    });

    this.tweens.killTweensOf(drop);
    this.tweens.add({
      targets: drop,
      scale: 1.35,
      alpha: 0,
      duration: 220,
      ease: "Back.easeIn",
      onComplete: () => drop.destroy(),
    });
  }

  handleCorrectDrop(drop) {
    this.audioManager.playPop();

    playScoreRewardEffect(this, drop.x, drop.y, 10, () => {
      this.score += 1;

      this.scoreText.setText(`${this.score}`);
    });

    this.showCorrectFeedback(drop);

    this.removeRaindrop(drop);
  }

  handleWrongDrop(drop) {
    this.audioManager.playWrongSelection();

    this.score -= 5;

    this.score = Math.max(0, this.score);

    this.missed++;

    this.scoreText.setText(`${this.score}`);

    this.missedText.setText(`${this.missed} / 10`);

    this.showWrongFeedback(drop);

    this.removeRaindrop(drop);

    // Maximum 10 mistakes allowed
    if (this.missed >= 10) {
      this.handleMissedLimit();
    }
  }

  handleMissedLimit() {
    if (this.missed < 10 || this.levelCompleting || this.gameOver) {
      return;
    }

    this.gameOver = true;

    this.stopTimer();

    this.input.enabled = false;

    console.log("Game Over: Missed limit reached!");

    this.time.delayedCall(1200, () => {
      this.scene.start("GameOverScene", {
        score: this.score,
        missed: this.missed,
        level: this.level,
        won: false,
        reason: "missed",
      });
    });
  }

  completeLevel() {
    this.scene.start("EasyGameScene", {
      level: this.level + 1,
      score: this.score,
      missed: this.missed,
    });
  }

  removeRaindrop(drop) {
    this.tweens.killTweensOf(drop);

    this.tweens.add({
      targets: drop,
      scale: 1.4,
      alpha: 0,
      duration: 250,
      ease: "Back.easeIn",

      onComplete: () => {
        drop.destroy();
      },
    });
  }

  showCorrectFeedback(drop) {
    const text = this.add.text(drop.x, drop.y, "+10 ⭐", {
      fontFamily: "Arial Rounded MT Bold, Arial",
      fontSize: "38px",
      fontStyle: "bold",
      color: "#20b83c",
      stroke: "#ffffff",
      strokeThickness: 7,
    });

    text.setOrigin(0.5);
    text.setDepth(20);

    this.tweens.add({
      targets: text,
      y: text.y - 80,
      alpha: 0,
      duration: 600,
      onComplete: () => {
        text.destroy();
      },
    });
  }

  showWrongFeedback(drop) {
    const text = this.add.text(drop.x, drop.y, "-5 ⭐", {
      fontFamily: "Arial Rounded MT Bold, Arial",
      fontSize: "38px",
      fontStyle: "bold",
      color: "#e53935",
      stroke: "#ffffff",
      strokeThickness: 7,
    });

    text.setOrigin(0.5);
    text.setDepth(20);

    this.tweens.add({
      targets: text,
      y: text.y - 80,
      alpha: 0,
      duration: 600,
      onComplete: () => {
        text.destroy();
      },
    });

    this.cameras.main.shake(120, 0.003);
  }

  createBallPopEmitter() {
    this.ballPopEmitter = this.add.particles(0, 0, "flares", {
      frame: ["red", "yellow", "green"],

      lifespan: 500,

      speed: {
        min: 100,
        max: 220,
      },

      scale: {
        start: 0.6,
        end: 0,
      },

      gravityY: 100,

      blendMode: "ADD",

      emitting: false,
    });

    this.ballPopEmitter.setDepth(10);
  }
}
