export default class AudioManager {
  constructor() {
    this.scene = null;

    this.gameplayMusic = null;

    this.buttonClickSound = null;
    this.wrongSelectionSound = null;
    this.gameOverSound = null;
    this.popSoundEffect = null;
    this.clockSound = null;
    this.starCollectionSound = null;
  }

  initialize(scene) {
    if (this.scene) return;

    this.scene = scene;

    this.gameplayMusic = scene.sound.add("gameplayMusic", {
      loop: true,
    });

    this.gameplayMusic.setVolume(0.01);

    this.buttonClickSound = scene.sound.add("buttonClickSound");

    this.wrongSelectionSound = scene.sound.add("wrongSelectionSound");
    this.wrongSelectionSound.setVolume(0.3);

    this.gameOverSound = scene.sound.add("gameOverSound");
    this.gameOverSound.setVolume(0.1);

    this.popSoundEffect = scene.sound.add("popSound");
    this.popSoundEffect.setVolume(0.05);

    this.clockSound = scene.sound.add("clockSound");
    this.clockSound.setVolume(0.2);

    this.starCollectionSound = scene.sound.add("starCollectionSound");
    this.starCollectionSound.setVolume(0.05);
  }

  playGameplayMusic() {
    if (this.gameplayMusic && !this.gameplayMusic.isPlaying) {
      this.gameplayMusic.play();
    }
  }

  pauseGameplayMusic() {
    if (this.gameplayMusic) {
      this.gameplayMusic.pause();
    }
  }

  resumeGameplayMusic() {
    if (this.gameplayMusic) {
      this.gameplayMusic.resume();
    }
  }

  stopGameplayMusic() {
    if (this.gameplayMusic) {
      this.gameplayMusic.stop();
    }
  }

  playButtonClick() {
    if (this.buttonClickSound) {
      this.buttonClickSound.play();
    }
  }

  playWrongSelection() {
    if (this.wrongSelectionSound) {
      this.wrongSelectionSound.play();
    }
  }

  playGameOver() {
    if (this.gameOverSound) {
      this.gameOverSound.play();
    }
  }

  playPop() {
    if (this.popSoundEffect) {
      this.popSoundEffect.play();
    }
  }

  playTick() {
    if (this.clockSound) {
      this.clockSound.play();
    }
  }

  playStarCollection() {
    if (this.starCollectionSound) {
      this.starCollectionSound.play();
    }
  }
}
