export default class FieldMenuButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        super(scene, x, y, '🍔', { fontSize: '64px', color: '#00ff00', backgroundColor: 'transparent' });
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public show() {
        this.setVisible(true);
        this.alpha = 1;
    }
}
