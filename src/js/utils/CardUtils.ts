import { CardNumber } from '../definsion/CardNumber';
import { Suit } from '../definsion/Suit';


export const generateDeck = function*(): Generator<string> {
    yield "J_A";
    yield "J_N2";
    for( const suit in Suit) {
      if (suit === 'J') continue;
      for( const num in CardNumber) {
        yield suit + "_" +  num;
      };
    }
}