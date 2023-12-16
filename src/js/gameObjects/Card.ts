import GameScene from "../scenes/GameScene";
import { CardSurfaceType } from "../definsion/CardSurfaceType";

export default class Card extends Phaser.GameObjects.Sprite{
  public scene: GameScene;
  private selected: boolean = false;
  private cardKind: string;
  surfaceState: CardSurfaceType = "FRONT";

  // カーソルを描画するためのグラフィックスオブジェクトを作成
  private sprite: Phaser.GameObjects.Sprite;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: GameScene, cardKind:string, x: number, y: number) {
    super(scene, x, y, cardKind);
    this.scene.add.existing(this);
    this.cardKind = cardKind;
    
    // ゲーム画面の10%の大きさにする
    this.setScale(0.2)

    // カードをドラッグできるようにする
    this.setInteractive();

    //ロングタップした際に表示されるサブメニュー枠を作成するイベントをバインド
    this.on("pointerdown", () => {
      // タップした際に最前面に表示する
      this.scene.children.bringToTop(this);

      // 1秒間の間にpointerupイベントが発生しなかった場合に、longpressイベントを発生させる
      const starX = this.x;
      const starY = this.y;
      this.scene.time.addEvent({
        delay: 250,
        callback: () => {
          if(!this.selected) return;

          //タップ時の座標と離した時の座標が近い場合にlongpressイベントを発生させる
          const calcDistance = (x1, y1, x2, y2) => {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
          }
          if(calcDistance(starX, starY, this.x, this.y) < 10){
            this.emit("longpress", this);
          }
        }
      });
    });
 
    // ロングタップした際に表示されるサブメニュー枠を作成
    // (openSubMenuイベントを発生させる)
    this.on("longpress", () => {
      this.scene.events.emit("openSubMenu", this);
    });

    this.scene.input.setDraggable(this);
    let starX = 0;
    let starY = 0;

    this.scene.input.on("dragstart", (pointer, gameObject) => {
      if(gameObject == this) {
        this.setSelected()
        starX = this.x;
        starY = this.y;
      }
    });
    this.scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if(gameObject == this) {
        this.x = dragX;
        this.y = dragY;
      }
    });
    this.scene.input.on("dragend", (pointer, gameObject) => {
      if(gameObject == this) {

        //タップ時の座標と離した時の座標が近い場合、seletedの変更はしない
        const calcDistance = (x1, y1, x2, y2) => {
          return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }
        if(calcDistance(starX, starY, this.x, this.y) < 10){
          return;
        }
        this.clearSelected();
      }
    });
  }

  // カードをめくる(BACKのimageに変更する)
  public flip() {
    if(this.surfaceState == "BACK") {
      this.setTexture(this.cardKind);
      this.surfaceState = "FRONT";
    } else {
      this.setTexture("BACK");
      this.surfaceState = "BACK";
    }
  }

  // カードの選択状態を返す
  public isSelected() {
    return this.selected;
  }

  // 選択状態を解除する
  public clearSelected() {
    this.clearTint();
    this.selected = false;
  }

  // カードを選択状態にする
  public setSelected() {
    this.setTint(0x00ff00);
    this.selected = true;
  }

}