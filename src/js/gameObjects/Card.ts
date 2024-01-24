import GameScene from "../scenes/GameScene";
import { CardSurfaceType } from "../definsion/CardSurfaceType";
import { GameConstants } from "../definsion/GameConstants";
import GroupMerker from "./GroupMarker";

export default class Card extends Phaser.GameObjects.Sprite{
  public scene: GameScene;
  private selected: boolean = false;
  private cardKind: string;
  surfaceState: CardSurfaceType = "FRONT";
  private group: GroupMerker;

  private sprite: Phaser.GameObjects.Sprite;


  constructor(scene: GameScene, cardKind:string, x: number, y: number) {
    super(scene, x, y, cardKind);
    this.scene.add.existing(this);
    this.cardKind = cardKind;
    this.name = cardKind;

    this.setInteractive();
    
    // カードの画像をGAME_CARD_WIDTH x GAME_CARD_HEIGHTにリサイズする
    this.displayWidth = GameConstants.GAME_CARD_WIDTH;
    this.displayHeight = GameConstants.GAME_CARD_HEIGHT;    
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

  public getGroup() {
    return this.group;
  }

  public setGroup(group: GroupMerker) {
    this.group = group;
  }

  public getSuit() {
    return this.cardKind.split("_")[0];
  }

  public getCardNumber() {
    return this.cardKind.split("_")[1];
  }

}