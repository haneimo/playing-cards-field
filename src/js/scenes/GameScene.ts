import Card from "../gameObjects/Card";
import { generateDeck } from "../utils/CardUtils";
import SubMenu from "../gameObjects/SubMenu";
import RectSelector from "../gameObjects/RectSelector";
import FieldMenuButton from "../gameObjects/FieldMenuButton";
import FieldMenu from "../gameObjects/FIeldMenu";
import CardFieldCore from "../utils/CardFieldCore";

export default class GameScene extends Phaser.Scene {
  private SYSTEM_UI_DEPTH = 100;
  private CARD_DEPTH = 1000;
  private CARD_WIDTH_NUMBERSPACE = 20;

  private CardSprities: Card[] = [];
  private keyP: Phaser.Input.Keyboard.Key;
  private keyO: Phaser.Input.Keyboard.Key;
  private selector: RectSelector;
  private subMenu: SubMenu;
  private fieldMenu: FieldMenu;
  private fieldMenuButton: FieldMenuButton;

  private core: CardFieldCore;


  private updateCardDepth() {
    this.cards.forEach((card, i) => {
      card.depth = i+this.CARD_DEPTH;
    });
  }

  // commandのリスト
  private cardMenuCommands:{[key: string]:()=>void} = {
    "setGroup": () => { console.log("setGroup") },
    "moveToField": () => { console.log("moveTo") },
    "faceUp": () => {
      // cardsの中からselectedがtrueのものを抽出する
      const selectedCards = this.cards.filter(card => card.isSelected());

      selectedCards.forEach(card =>{
        card.faceUp();
        card.clearSelected();
      });
    },
    "faceDown": () => {
      // cardsの中からselectedがtrueのものを抽出する
      const selectedCards = this.cards.filter(card => card.isSelected());

      selectedCards.forEach(card =>{
        card.faceDown();
        card.clearSelected();
      });
    },
    "sortLine": () => {
      //選択中のカードをソートし、depth順に並べる
      const selectedCards = this.cards.filter(card => card.isSelected()).sort((a, b) => a.depth - b.depth);

      // 起点は選択中のカードの中で一番左にあるカード
      const startX = Math.min(...selectedCards.map(card => card.x));
      const startY = Math.min(...selectedCards.map(card => card.y));
      const endX = Math.max(...selectedCards.map(card => card.x));
      const endY = Math.max(...selectedCards.map(card => card.y));

      selectedCards.forEach((card, i) => {
        card.movePositionWithAnimation(startX + this.CARD_WIDTH_NUMBERSPACE * i, startY);
      });      
    },
    "cancel": () => { 
      console.log("cancel");
      this.cards.filter(card => card.isSelected()).forEach(card =>{
        card.clearSelected();
      });
    }
  };

  private fieldMenuCommands:{[key: string]:()=>void} = {
    "spreadRandom": () => { 
      // cardsをランダムに配置し直す
      this.cards.forEach(card => {
        card.movePositionWithAnimation(Phaser.Math.RND.between(0, this.sys.game.config.width as number), Phaser.Math.RND.between(0, this.sys.game.config.height as number));
      });
     },
    "center": () => { 
      console.log("sort") 
      // cardsを画面中央にあつめ、カードの束を作る  
      const centerX = this.sys.game.config.width as number / 2;
      const centerY = this.sys.game.config.height as number / 2;

      this.buildStock(centerX, centerY);
    },
    "shuffle": () => { 
      // cardsをシャッフルする（カードのToplevelの順序をランダムにする）
      this.cards.sort(() => Math.random() - 0.5);
      // ソート済みのカードどおりに再背面に配置していく
      this.buildStock(this.cards[this.cards.length-1].x, this.cards[this.cards.length-1].y);
      this.updateCardDepth();
      console.log("shuffle") 
    },

    "cancel": () => { console.log("cancel") },
  };

  constructor() {
    super({ key: "game", active: false, visible: false });
  }

  public preload() {
    
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

    // 矩形セレクターを作成
    this.add.existing(this.selector = new RectSelector(this, 0, 0, this.cards));

    // Cardのサブメニューを作成
    this.add.existing(this.subMenu = new SubMenu(this, this.cardMenuCommands));

    // フィールドメニューを作成
    this.add.existing(this.fieldMenuButton = new FieldMenuButton(this, 0, 0));    
    this.add.existing(this.fieldMenu = new FieldMenu(this, this.fieldMenuCommands, ()=>{
      this.fieldMenuButton.show()
    }));

    // イベントをバインド
    this.bindEvents();

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

  // カードの束を作る
  private buildStock(x, y) {
    // カードを画面中央に集める
    this.cards.forEach((card, i) => {
      //カードは束であることがわかるように左上から1pxずつずれて少し重なるように配置する
      card.movePositionWithAnimation(x + i*1, y + i*1);
    });
  }


  // 各種イベントのバインド
  // ゲームオブジェクトは永続的に存在させ、
  // Sceneが破棄されるまではオブジェクトにバインドするイベントも基本的には永続的に存在させる
  private bindEvents() {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
      //pointerの位置にcardsがある場合は本イベントの処理を終了する
      let isCardClicked = false;
      this.cards.forEach(card => {
        if(card.getBounds().contains(pointer.x, pointer.y)) {
          isCardClicked = true;
        }
      });
      if(isCardClicked) return;

      this.subMenu.close();
      // this.targetCardsに含まれないオブジェクトをクリックした場合は矩形選択を開始する
      this.selector.startDrag(pointer.x, pointer.y);
    });
    
    // ドラッグ中のマウスの位置に合わせて矩形を描画する
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.selector.refleshRect(pointer.x, pointer.y);
    });
  
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      // ドラッグ終了時に矩形選択を終了し、矩形選択範囲を終了する
      if(this.selector.isSelecting()){
        this.selector.endDrag();
      }

      // pointerdownからの経過時間が短い場合はメニューを表示する
      if(pointer.getDuration() < 200) {
        this.subMenu.open(pointer.x, pointer.y);
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if(gameObject instanceof Card) {
        const card = (gameObject as Card)
        
        // selectedの状態のカードはgameObjectと同等の移動幅で移動させる
        this.cards.filter(c => c.isSelected() && c !== card ).forEach(otherCard => {
          otherCard.movePosition(otherCard.x + (dragX - card.x), otherCard.y + (dragY-card.y));
        });
        
        //最後にgameObjectを移動させる
        card.movePosition(dragX, dragY);
        this.subMenu.close();
        this.fieldMenu.close();
      }
    });

    // drag終了時にselectedの状態を解除する
    this.input.on("dragend", (pointer, gameObject) => {
      if(gameObject instanceof Card) {
        //cardsの選択状態を解除する
        //this.cards.forEach(card => {
        //  card.clearSelected();
        //});
      }
    });

    // カードをクリックした際にサブメニューを表示する用にバインド
    this.cards.forEach( card => {
      card.on('pointerdown', () => {
        card.setSelected()
        this.subMenu.open(card.x, card.y);
      });
    });

    // メニューボタンをクリックした時に
    // openFieldMenuメニューイベントが発生する
    this.fieldMenuButton.on('pointerdown', (pointer:PointerEvent) => {
      this.fieldMenu.open(pointer, pointer.y, this.fieldMenuButton);
    });
  }
}
