import Phaser from "phaser";

export default function playScoreRewardEffect(
  scene,
  startX,
  startY,
  amount = 10,
  onStarCollected,
  onComplete,
) {
  const targetX = scene.scoreText.x;
  const targetY = scene.scoreText.y;

  // Count how many stars reached the score
  let collected = 0;

  for (let i = 0; i < amount; i++) {
    const star = scene.add.image(startX, startY, "gameOverStar");

    star.setDepth(30);
    star.setScale(0.08);
    star.setAlpha(0);

    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

    const distance = Phaser.Math.Between(50, 110);

    const burstX = startX + Math.cos(angle) * distance;

    const burstY = startY + Math.sin(angle) * distance;

    const delay = i * 40;

    // ----------------------------------------
    // STAGE 1: STAR BURSTS OUT
    // ----------------------------------------

    scene.tweens.add({
      targets: star,

      x: burstX,
      y: burstY,

      alpha: 1,

      scale: {
        from: 0.08,
        to: 0.1,
      },

      duration: 150,

      delay,

      ease: "Back.easeOut",

      onComplete: () => {
        // ----------------------------------------
        // STAGE 2: STAR FLIES TO SCORE
        // ----------------------------------------
        scene.audioManager.playStarCollection();
        scene.tweens.add({
          targets: star,

          x: targetX,
          y: targetY,

          scale: 0.08,

          duration: 450,

          ease: "Quad.easeIn",

          onComplete: () => {
            // One star has reached the score
            collected++;

            // Add +1 to score
            if (onStarCollected) {
              onStarCollected();
            }

            // Score text punch
            scene.tweens.add({
              targets: scene.scoreText,

              scale: 1.12,

              duration: 80,

              yoyo: true,

              ease: "Back.easeOut",
            });

            star.destroy();

            // ----------------------------------------
            // ALL STARS HAVE ARRIVED
            // ----------------------------------------

            if (collected === amount && onComplete) {
              onComplete();
            }
          },
        });
      },
    });
  }
}
