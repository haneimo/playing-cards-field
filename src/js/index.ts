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

  // チャットウィンドウを追加
  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";
  document.body.appendChild(chatWindow);

  // チャットウインドウにはゲーム/チャットログを表示する
  const chatLog = document.createElement("div");
  chatLog.id = "cgat-log";
  chatWindow.appendChild(chatLog);

  // チャットウインドウにはチャット入力欄を表示する
  const chatInput = document.createElement("input");
  chatInput.id = "chat-input";
  chatInput.type = "text";
  chatInput.placeholder = "チャットを入力";
  chatInput.maxLength = 50;
  chatWindow.appendChild(chatInput);
  

  // チャットウインドウはレスポンシブにする
  // 画面が横長の場合はゲーム画面の右に表示する
  // 画面が縦長の場合はゲーム画面の下に表示する
  if (window.innerWidth > window.innerHeight) {
    chatWindow.style.position = "absolute";
    chatWindow.style.top = "0";
    chatWindow.style.right = "0";
  } else {
    chatWindow.style.position = "absolute";
    chatWindow.style.bottom = "0";
    chatWindow.style.left = "0";
  }
});
