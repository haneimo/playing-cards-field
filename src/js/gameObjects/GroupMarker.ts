import Card from "./Card";

export default class GroupMarker extends Phaser.GameObjects.Text {
    name: string;
    isOrderble: boolean = false;
    viewScale: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, name: string) {
        super(scene, x, y, "●" + name, { color: "#FFFFFF", fontSize: "64px" });
        
        this.setAlpha(1);
        this.setInteractive();
        this.name = name;

        this.scene.add.existing(this);
    }

    getName(): string {
        return this.name;
    }

    moveTo(x, y){
        //xy位置にアニメーションする
        this.scene.tweens.add({
            targets: this,
            props: {
            x: x,
            y: y,
            duration: 500,
            ease: 'Power2'
            }
        });
    }

}
