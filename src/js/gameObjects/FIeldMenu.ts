import { calcDistance } from "../utils/GameUtils";

export default class FieldMenu extends Phaser.GameObjects.Container {
    constructor(scene, commands:{[index: string]:()=>void}, closeCallback:()=>void) {
        super(scene);
        this.scene.add.existing(this);
        this.setInteractive();

        //commandsの数だけメニューを作成
        Object.keys(commands).forEach((commandName, i) => {
            const textSize = 32;
            const item = scene.add.text(0, i*(textSize-textSize/12), commandName, { fontSize: String(textSize) + 'px', color: '#00ff00', backgroundColor: '#ffffff' });
            item.setInteractive();
            item.on('pointerdown', ()=>{
                commands[commandName]();
                closeCallback();
                this.close();
            });
            this.add(item);
        });

        this.setVisible(false);
    }

    //画面の四隅のいずれかをオプションで指定できるようにする
    open(x, y, button: Phaser.GameObjects.Text) {
        // x, y座標から最寄りの四隅の座標を判定し、showPotison変数に'leftUp', 'rightUp', 'leftDown', 'rightDown'のいずれかを代入する 
        let options = '';
        const leftUp = calcDistance(x, y, 0, 0);
        const rightUp = calcDistance(x, y, this.scene.game.config.width, 0);
        const leftDown = calcDistance(x, y, 0, this.scene.game.config.height);
        const rightDown = calcDistance(x, y, this.scene.game.config.width, this.scene.game.config.height);
        const min = Math.min(leftUp, rightUp, leftDown, rightDown);
        if (min === leftUp) options = 'leftUp';
        if (min === rightUp) options = 'rightUp';
        if (min === leftDown) options = 'leftDown';
        if (min === rightDown) options = 'rightDown';

        
        this.setPosition(button.width, button.height);

        // 画面の四隅によって表示位置を変える
        // 画面の右上に表示する場合
        if (options === 'rightUp') {
            this.x -= this.width - button.width;
        }
        // 画面の左下に表示する場合
        if (options === 'leftDown') {
            this.y -= this.height - button.height;
        }
        // 画面の右下に表示する場合
        if (options === 'rightDown') {
            this.x -= this.width - button.width;
            this.y -= this.height - button.height;
        }
        this.setVisible(true);
    }

    public close() {
        this.setVisible(false);
    }
}