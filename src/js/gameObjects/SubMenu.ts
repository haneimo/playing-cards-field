import Card from "./Card";

// CardSpriteをロングタップした際に表示されるサブメニュー枠
export default class SubMenu extends Phaser.GameObjects.Container {
    private menuItem: Phaser.GameObjects.Text;
    private target: Card[]

    constructor(scene: Phaser.Scene, 
        target: Card, 
        commands:{[index: string]:()=>void}) {

        super(scene, target.x, target.y);
        // クリッカブルなアイテム(text)をリスト分だけ枠内に作成

        Object.keys(commands).forEach((commandName, i) => {
            // y座標をアイテムの高さ分ずらす
            const textSize = 32;
            const item = scene.add.text(0, i*(textSize-textSize/12), commandName, { fontSize: String(textSize) + 'px', color: '#00ff00', backgroundColor: '#ffffff' });
            item.setInteractive();
            item.on('pointerdown', commands[commandName]);
            this.add(item);
        }); // Add closing parenthesis here

        // 次回のクリック時にサブメニュー枠を削除する
        this.scene.input.on('pointerdown', (pointer, gameObject) => {
            // ppointerの位置がmenuItemかtargetから10px以上離れていた場合にサブメニュー枠を削除する
            this.destroy()
        });

        // ドラッグが開始され、ドラッグ対象のオブジェクトが20px以上移動した場合にサブメニュー枠を削除する
        let dragStartX = 0;
        let dragStartY = 0;
        this.scene.input.on('dragstart', (pointer, gameObject) => {
            dragStartX = pointer.x;
            dragStartY = pointer.y;
        });
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if(this.calcDistance(pointer.x, pointer.y, dragStartX, dragStartY) > 20){
                this.destroy()
            }
        });

    }

    private calcDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

}