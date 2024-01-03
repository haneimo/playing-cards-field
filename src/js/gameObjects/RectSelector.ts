//矩形選択オブジェクト
import Card from "./Card";

export default class RectSelector extends Phaser.GameObjects.Graphics {
    private targetCards: Card[] = [];
    private startX: number;
    private startY: number;
    //getterを作成
    private _isSelecting: boolean = false;
    public isSelecting() {
        return this._isSelecting;
    }

    //マウスドラッグにともなって矩形を描画し、その範囲内にあるオブジェクトをselectedの状態にする
    constructor(scene: Phaser.Scene, startX: number, startY: number, cards: Card[]) {
        super(scene);
        this.scene.add.existing(this);
        this.targetCards = cards;

        // graphicsの原点を左上にする
        this.x = 0;
        this.y = 0;
    }

    public startDrag(x: number, y: number) {
        // マウスのドラッグ開始位置を記録
        this.startX = x;
        this.startY = y;

        // ドラッグ開始時にselectedの状態を解除する
        this.targetCards.forEach((card: Card) => {
            card.clearSelected();
        });

        this._isSelecting = true;
    }

    public refleshRect(pointerX: number, pointerY: number) {
        if (!this.isSelecting()) return;
        this.clear();
        this.lineStyle(2, 0xff0000);
        this.strokeRect(this.startX, this.startY, pointerX - this.startX, pointerY - this.startY);

        // ドラッグ中にselectedの状態を解除する
        this.clearSelected();

        // ドラッグ開始位置と終了位置を比較し、矩形選択範囲を決定する
        const startX = Math.min(this.startX, pointerX);
        const startY = Math.min(this.startY, pointerY);

        const endX = Math.max(this.startX, pointerX);
        const endY = Math.max(this.startY, pointerY);

        // 矩形選択範囲内にあるオブジェクトを取得
        const selectedCards = this.targetCards.filter((card: Card) => {
            return (
                startX <= card.x &&
                startY <= card.y &&
                card.x <= endX &&
                card.y <= endY 
            );
        });
        // selectedの状態にする
        selectedCards.forEach((card: Card) => {
            card.setSelected();
        });
    }

    public endDrag() {
        // オブジェクトは永続的に存在させ、線自体を削除する
        this._isSelecting = false;
        this.clear();
    }

    private clearSelected() {
        // ドラッグ開始時にselectedの状態を解除する
        this.targetCards.forEach((card: Card) => {
            card.clearSelected();
        });
    }
}