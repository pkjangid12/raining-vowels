export default function playBallPopEffect(scene, x, y) {
  const emitter = scene.ballPopEmitter;

  if (!emitter || !emitter.active) {
    return;
  }

  // Move the reusable emitter to the effect position
  emitter.setPosition(x, y);

  // Emit particles
  emitter.explode(16);
}
