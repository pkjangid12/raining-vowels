export function createBackground(scene, textureKey) {
  const { width, height } = scene.scale;

  return scene.add
    .image(width * 0.5, height * 0.5, textureKey)
    .setDisplaySize(width, height);
}
