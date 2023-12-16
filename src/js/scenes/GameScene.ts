import Card from "../gameObjects/Card";
import { generateDeck } from "../utils/CardUtils";
import SubMenu from "../gameObjects/SubMenu";

export default class GameScene extends Phaser.Scene {
  private cards: Card[] = [];
  private keyP: Phaser.Input.Keyboard.Key;
  private keyO: Phaser.Input.Keyboard.Key;

  //commandのリスト
  private subMenuCommands:{[key: string]:()=>void} = {
    "moveTo": () => { console.log("moveTo") },
    "flip": () => {
      // cardsの中からselectedがtrueのものを抽出する
      const selectedCards = this.cards.filter(card => card.isSelected());

      selectedCards.forEach(card =>{
        card.flip();
        card.clearSelected();
      });

    },
    "cancel": () => { console.log("cancel")}
  };

  constructor() {
    super({ key: "game", active: false, visible: false });
  }

  public preload() {
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/tilemap.json");
    
  }

  private camera: Phaser.Cameras.Scene2D.Camera;

  public create() {
    this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);

    this.drawGrid(this.game);

    // カードを作成する
    for (const cardSimbol of generateDeck()) {
      const cardX = Phaser.Math.RND.between(0, this.sys.game.config.width as number);
      const cardY = Phaser.Math.RND.between(0, this.sys.game.config.height as number);
      console.log(cardSimbol)
      this.cards.push(new Card(this, cardSimbol, cardX, cardY));
    }

    // カメラを作成する
    const gameWidth = this.sys.game.config.width as number;
    const gameHeight = this.sys.game.config.height as number;
    this.cameras.main.setSize(gameWidth, gameHeight); // カメラのサイズを設定

    // openSubMenuイベントをバインド
    this.events.on("openSubMenu", (target: Card) => {
      // サブメニューを表示する
      this.add.existing(new SubMenu(this, target, this.subMenuCommands));
    });
  }

  public update(time: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.keyP)) {
      this.cameras.main.zoom *= 1.1; // ズームイン
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyO)) {
      this.cameras.main.zoom /= 1.1; // ズームアウト
    }
  }

  private drawGrid(
    game: Phaser.Game, gridSize: number = 64, 
    gridColor: number = 0xFFFFFFFF, 
    gridAlpha: number = 0.5, 
    gridWidth: number = 2) {
      // グリッドを描画するためのグラフィックスオブジェクトを作成
      const graphics = this.add.graphics();

      // グリッドを描画
      graphics.lineStyle(gridWidth, gridColor, gridAlpha);
      for (let x = 0; x < this.cameras.main.width; x += gridSize) {
        graphics.moveTo(x, 0);
        graphics.lineTo(x, this.cameras.main.height);
      }
      for (let y = 0; y < this.cameras.main.height; y += gridSize) {
        graphics.moveTo(0, y);
        graphics.lineTo(this.cameras.main.width, y);
      }
      graphics.strokePath();
  
  }
}
