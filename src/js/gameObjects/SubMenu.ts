import Card from "./Card";

// CardSpriteをタップした際に表示されるサブメニュー枠
export default class SubMenu extends Phaser.GameObjects.Container {
    private menuItem: Phaser.GameObjects.Text;
    private target: Card[]

    constructor(scene: Phaser.Scene, 
        commands:{[index: string]:()=>void}) {
        super(scene, 0, 0);
        this.setVisible(false);// 初期状態では非表示にする

        // クリッカブルなアイテム(text)をリスト分だけ枠内に作成

        Object.keys(commands).forEach((commandName, i) => {
            // y座標をアイテムの高さ分ずらす
            const textSize = 32;
            const item = scene.add.text(0, i*(textSize-textSize/12), commandName, { fontSize: String(textSize) + 'px', color: '#00ff00', backgroundColor: '#ffffff' });
            item.setInteractive();
            item.on('pointerdown', ()=>{
                commands[commandName]();
                // refleshGameDepthイベントを発火する
                this.scene.events.emit("updateGameDepth");
                this.close()
            });
            this.add(item);
        }); // Add closing parenthesis here
    }

    public open(x, y){
        this.setVisible(true);
        this.setPosition(x, y);
    }

    public close(){
        this.setVisible(false);
    }
}