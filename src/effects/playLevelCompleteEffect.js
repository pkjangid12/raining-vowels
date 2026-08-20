import Phaser from "phaser";

export default function playLevelCompleteEffect(scene, level, onComplete) {
  const { width, height } = scene.scale;

  // ----------------------------------------
  // OVERLAY
  // ----------------------------------------

  const overlay = scene.add.rectangle(
    width / 2,
    height / 2,
    width,
    height,
    0x000000,
    0.35,
  );

  overlay.setDepth(50);
  overlay.setAlpha(0);

  scene.tweens.add({
    targets: overlay,
    alpha: 1,
    duration: 250,
  });

  // ----------------------------------------
  // RABBIT
  // ----------------------------------------

  const rabbit = scene.add.image(width / 2, height / 2 + 80, "gameOverRabbit");

  rabbit.setDepth(52);
  rabbit.setScale(0);
  rabbit.setAlpha(0);

  scene.tweens.add({
    targets: rabbit,
    scale: 0.22,
    alpha: 1,
    duration: 450,
    ease: "Back.easeOut",
  });

  // Bunny celebration bounce
  scene.tweens.add({
    targets: rabbit,
    y: rabbit.y - 25,
    duration: 300,
    delay: 450,
    yoyo: true,
    repeat: 2,
    ease: "Sine.easeInOut",
  });

  // ----------------------------------------
  // LEVEL COMPLETE TEXT
  // ----------------------------------------

  const levelText = scene.add.text(
    width / 2,
    height / 2 - 300,
    `LEVEL ${level}\nCOMPLETE!`,
    {
      fontFamily: "Fredoka",
      fontSize: "72px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#1764c0",
      strokeThickness: 10,
      align: "center",
    },
  );

  levelText.setOrigin(0.5);
  levelText.setDepth(53);
  levelText.setScale(0);
  levelText.setAlpha(0);

  scene.tweens.add({
    targets: levelText,
    scale: 1,
    alpha: 1,
    duration: 450,
    ease: "Back.easeOut",
  });

  // ----------------------------------------
  // AMAZING TEXT
  // ----------------------------------------

  const messages = [
    "AMAZING!",
    "GREAT JOB!",
    "YOU DID IT!",
    "SUPER CATCH!",
    "VOWEL MASTER!",
  ];

  const randomMessage = Phaser.Utils.Array.GetRandom(messages);

  const messageText = scene.add.text(
    width / 2,
    height / 2 + 300,
    randomMessage,
    {
      fontFamily: "Fredoka",
      fontSize: "48px",
      fontStyle: "bold",
      color: "#ffd83d",
      stroke: "#ffffff",
      strokeThickness: 8,
    },
  );

  messageText.setOrigin(0.5);
  messageText.setDepth(53);
  messageText.setScale(0);
  messageText.setAlpha(0);

  scene.tweens.add({
    targets: messageText,
    scale: 1,
    alpha: 1,
    duration: 350,
    delay: 350,
    ease: "Back.easeOut",
  });

  // ----------------------------------------
  // CONFETTI
  // ----------------------------------------

  createConfetti(scene, width, height);

  // ----------------------------------------
  // FINISH
  // ----------------------------------------

  scene.time.delayedCall(1900, () => {
    if (onComplete) {
      onComplete();
    }
  });
}

// ========================================
// CONFETTI
// ========================================

function createConfetti(scene, width, height) {
  const confetti = scene.add.particles(0, 0, "flares", {
    frame: ["red", "yellow", "green"],

    lifespan: 1200,

    speed: {
      min: 180,
      max: 420,
    },

    angle: {
      min: 250,
      max: 290,
    },

    gravityY: 500,

    scale: {
      start: 0.18,
      end: 0,
    },

    alpha: {
      start: 1,
      end: 0,
    },

    quantity: 2,

    emitting: false,
  });

  confetti.setDepth(54);

  // Left burst
  confetti.explode(18, width * 0.15, height * 0.38);

  // Right burst
  confetti.explode(18, width * 0.85, height * 0.38);

  scene.time.delayedCall(600, () => {
    if (confetti.active) {
      confetti.destroy();
    }
  });
}
