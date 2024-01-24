import { CardNumber } from "../definsion/CardNumber";
import { Suit } from "../definsion/Suit";
import { generateDeck } from "../utils/CardUtils";

export default class LoaderScene extends Phaser.Scene {

  public async preload() {
    const configPath = './assets/images/skins/irasutoya/';

    for( const cardSimbol of generateDeck() ){
      console.log(cardSimbol)
      this.load.image(cardSimbol, configPath + cardSimbol + ".PNG")
    }
    this.load.image("BACK", configPath + "BACK.PNG")
  }

  public create() {
    this.scene.start("game");
  }
}
