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
    this.name = cardKind;

    // ゲーム画面の10%の大きさにする
    this.setScale(0.2)

    // カードをドラッグできるようにする
    this.setInteractive();
    this.scene.input.setDraggable(this);
  }

  // カードをめくる(BACKのimageに変更する)
  public flip() {
    if(this.surfaceState == "BACK") {
      this.faceUp();
    } else {
      this.faceDown();
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

  // カードを移動する
  public movePosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // アニメーションを伴ってカードを移動する。（座標を指定すると、その座標まで移動する）
  public movePositionWithAnimation(x: number, y: number) {
    // アニメーションの設定
    // 1000msかけて、x座標をx、y座標をyにする
    
    this.scene.tweens.add({
      targets: this,
      ease: 'Power2',
      props: {
        x: { value: x, duration: 500 },
        y: { value: y, duration: 500 }
      }
    });
  }

  public faceUp() {
    this.setTexture(this.cardKind);
    this.surfaceState = "FRONT";
  }

  public faceDown() {
    this.setTexture("BACK");
    this.surfaceState = "BACK";
  }

}