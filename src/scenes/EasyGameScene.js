import Phaser from "phaser";

import playBallPopEffect from "../effects/playBallPopEffect.js";
import playScoreRewardEffect from "../effects/playScoreRewardEffect.js";
import playLevelCompleteEffect from "../effects/playLevelCompleteEffect.js";

export default class EasyGameScene extends Phaser.Scene {
  constructor() {
    super("EasyGameScene");
  }

  init(data) {
    this.level = data?.level ?? 1;
    this.score = data?.score ?? 0;
    this.missed = data?.missed ?? 0;
    this.vowelsCollected = 0;
    this.levelCompleting = false;
    this.gameOver = false;

    ////////timer/////

    this.timeLimit = 30;
    this.timeLeft = this.timeLimit;
    this.timerEvent = null;
  }

  create() {
    this.createBackground();
    this.createHUD();
    this.createRabbit();
    this.createRaindrops();
    this.startTimer();

    this.createBallPopEmitter();

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

    drops.forEach((drop, index) => {
      this.createRaindrop(drop, index);
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
    const position = this.getDropPosition(index);

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

    this.addDropAnimation(container);
  }

  getDropPosition(index) {
    const positions = [
      { x: 160, y: 430 },
      { x: 410, y: 450 },
      { x: 680, y: 450 },
      { x: 920, y: 440 },

      { x: 250, y: 750 },
      { x: 530, y: 800 },
      { x: 800, y: 770 },

      { x: 150, y: 1100 },
      { x: 450, y: 1100 },
      { x: 760, y: 1150 },
    ];

    return positions[index];
  }

  addDropAnimation(drop) {
    this.tweens.add({
      targets: drop,
      y: drop.y + 40,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.tweens.add({
      targets: drop,
      angle: {
        from: -5,
        to: 5,
      },
      duration: 1400,
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

  handleCorrectDrop(drop) {
    this.vowelsCollected++;
    this.audioManager.playPop();

    playScoreRewardEffect(
      this,
      drop.x,
      drop.y,
      10,
      () => {
        this.score += 1;

        this.scoreText.setText(`${this.score}`);
      },
      () => {
        this.checkLevelComplete();
      },
    );

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
    if (this.levelCompleting || this.gameOver) {
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

  checkLevelComplete() {
    if (this.vowelsCollected !== 5 || this.levelCompleting) {
      return;
    }

    this.levelCompleting = true;

    this.stopTimer();

    console.log(`Level ${this.level} completed!`);

    this.input.enabled = false;

    this.showLevelComplete();
  }

  showLevelComplete() {
    this.input.enabled = false;

    playLevelCompleteEffect(this, this.level, () => {
      this.goToNextLevel();
    });
  }

  goToNextLevel() {
    if (this.level >= 10) {
      this.scene.start("GameOverScene", {
        score: this.score,
        missed: this.missed,
        level: this.level,
        won: true,
        reason: "completed",
      });

      return;
    }

    this.scene.start("EasyGameScene", {
      level: this.level + 1,
      score: this.score,
      missed: this.missed,
    });
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
