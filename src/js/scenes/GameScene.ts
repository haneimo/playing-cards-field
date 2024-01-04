import Card from "../gameObjects/Card";
import { generateDeck } from "../utils/CardUtils";
import SubMenu from "../gameObjects/SubMenu";
import FieldMenuButton from "../gameObjects/FieldMenuButton";
import FieldMenu from "../gameObjects/FIeldMenu";
import { generateAveragePosition } from "../utils/GameUtils";

export default class GameScene extends Phaser.Scene {
  private SYSTEM_UI_DEPTH = 10000;
  private CARD_DEPTH = 1000;
  private CARD_WIDTH_NUMBERSPACE = 20;

  private cards: Card[] = [];
  private keyP: Phaser.Input.Keyboard.Key;
  private keyO: Phaser.Input.Keyboard.Key;
  private KeyI: Phaser.Input.Keyboard.Key;
  private KeyU: Phaser.Input.Keyboard.Key;

  private subMenu: SubMenu;
  private fieldMenu: FieldMenu;
  private fieldMenuButton: FieldMenuButton;
  private multiSelectMode: boolean = false;
  private camera_radius: number = 0;

  private updateGameDepth() {
    //menuのdepthを手前に設定する
    this.subMenu.depth = this.SYSTEM_UI_DEPTH;
    this.fieldMenu.depth = this.SYSTEM_UI_DEPTH;
    this.fieldMenuButton.depth = this.SYSTEM_UI_DEPTH;
    
    this.cards.forEach((card, i) => {
      card.depth = i+this.CARD_DEPTH;
    });
  }

  // commandのリスト
  private cardMenuCommands:{[key: string]:()=>void} = {
    "onMultiSelect":()=>{
      // 複数選択モードを有効にする
      this.multiSelectMode = true;
    },
    "offMultiSelect":()=>{
      // 複数選択モードを無効にする
      this.multiSelectMode = false;
      // 選択中のカードをクリアする
      this.cards.filter(card => card.isSelected()).forEach(card =>{
        card.clearSelected();
      });
    },
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
      //選択中のカードを抽出する
      const selectedCards = this.cards.filter(card => card.isSelected())
      
      // 起点は選択中のカードの中で一番左にあるカード
      const startX = Math.min(...selectedCards.map(card => card.x));
      const startY = Math.min(...selectedCards.map(card => card.y));

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
    "handOutCards" : () => {
      // cardsのgroupを変更する
      const groups = [{name: "group1", isOrderble: true},
      {name: "group2", isOrderble: true},
      {name: "group3", isOrderble: true},
      {name: "group4", isOrderble: true}];

      this.cards.forEach(card => {
        card.setGroup(groups[Phaser.Math.RND.between(0, groups.length-1)]);
      });

      // 表示順制御のためsortする
      this.sortGroup();

      // グループごとにカードを束にする
      const groupsCard:Card[][] = Object.values(this.cards.reduce((stocker, currentCard) => {
        if( currentCard.getGroup().name in stocker) {
          stocker[currentCard.getGroup().name].push(currentCard);
        }else {
          stocker[currentCard.getGroup().name] = [currentCard];
        }
        return stocker;
      }, {}))

      let i=0;
      for( const pos of generateAveragePosition(
        this.sys.game.config.width as number, 
        this.sys.game.config.height as number, 
        groupsCard.length)){
          this.buildStock(groupsCard[i], pos.x, pos.y);
          i++;
      }
    },
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

      this.buildStock(this.cards, centerX, centerY);
    },
    "shuffle": () => { 
      // 対象カードの左上のカードを取得する
      const topLeftCard = this.cards.reduce((minCard, card) => {
        if(card.x < minCard.x && card.y < minCard.y) {
          return card;
        } else {
          return minCard;
        }
      });

      // cardsをシャッフルする（カードのToplevelの順序をランダムにする）
      this.cards.sort(() => Math.random() - 0.5);
      // ソート済みのカードどおりに再背面に配置していく
      this.buildStock(this.cards, topLeftCard.x, topLeftCard.y );
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
    this.KeyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.KeyU = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);

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

    // Cardのサブメニューを作成
    this.add.existing(this.subMenu = new SubMenu(this, this.cardMenuCommands));

    // フィールドメニューを作成
    this.add.existing(this.fieldMenuButton = new FieldMenuButton(this, 0, 0));    
    this.add.existing(this.fieldMenu = new FieldMenu(this, this.fieldMenuCommands));

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
    if (Phaser.Input.Keyboard.JustDown(this.KeyI)) {
      this.cameras.main.setRotation(this.camera_radius += 0.1); // 回転
    }
    if (Phaser.Input.Keyboard.JustDown(this.KeyU)) {
      this.cameras.main.setRotation(this.camera_radius -= 0.1); // 回転
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
  private buildStock(targetCards: Card[], x:number, y:number) {    
    // カードを画面中央に集める
    targetCards.forEach((card, i) => {
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

    // カードをクリックした際にサブメニューを表示する用にバインド
    this.cards.forEach( card => {
      card.on('pointerdown', () => {
        if(!this.multiSelectMode) {
          this.cards.forEach(card => card.clearSelected());
        }
        card.setSelected()
        this.subMenu.open(card.x, card.y);
      });
    });

    // メニューボタンをクリックした時に
    // openFieldMenuメニューイベントが発生する
    this.fieldMenuButton.on('pointerdown', (pointer:PointerEvent) => {
      this.fieldMenu.open(pointer, pointer.y, this.fieldMenuButton);
    });

    // refleshGameDepthメニューイベントが発生した場合の処理
    this.events.on('updateGameDepth', () => {
      this.updateGameDepth();
    });

  }


  // カードの情報からdepthを設定する
  private sortGroup() {
    // カードをグループ(あいうえお順)＞カード番号＞カードのスートの順(Spade/Heart/Clab/Diamondでソートする

    this.cards.sort((a, b) => {
      // グループ名は文字列なので、文字列の大小比較(辞書順)を行う
      if(a.getGroup().name == b.getGroup().name) {
        return 0;
      } else {
        return a.getGroup().name > b.getGroup.name ? 1 : -1;
      }
    });
  }
}
