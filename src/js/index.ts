import "phaser";
import LoaderScene from "./scenes/LoaderScene";
import GameScene from "./scenes/GameScene";
import { GameConstants } from "./definsion/GameConstants";

const gameWidth = GameConstants.GAME_SCREEN_WIDTH;
const gameHeight = GameConstants.GAME_SCREEN_HEIGHT;

const calclatedWidthZoom = window.innerWidth / gameWidth;
const calclatedHeightZoom = window.innerHeight / gameHeight;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  parent: "main-game", // "game-container
  zoom: calclatedWidthZoom < calclatedHeightZoom ? calclatedWidthZoom : calclatedHeightZoom,
  input: {
    keyboard: true,
    gamepad: true,
  },
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
  },
  scene: [LoaderScene, GameScene],
  dom: {
    createContainer: true,
  },  
};

window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
  const canvas = game.canvas as HTMLCanvasElement;
  canvas.id = "main-game";

  window.addEventListener("resize", () => {
    const calclatedWidthZoom = window.innerWidth / gameWidth;
    const calclatedHeightZoom = window.innerHeight / gameHeight;
    const zoom = calclatedWidthZoom < calclatedHeightZoom ? calclatedWidthZoom : calclatedHeightZoom;
    game.scale.setZoom(zoom);
  });
});
