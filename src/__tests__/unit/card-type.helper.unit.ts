import {expect} from '@loopback/testlab';
import {buildCardDeck} from '../../helpers/card-type.helper';
import {Card} from '../../models';

const frenchCardSuits = ['SPADES', 'CLUBS', 'DIAMONDS', 'HEARTS'];
const frenchCardsValues = [
  'ACE',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'VALET',
  'DAME',
  'KING',
];

describe('CardTypeHelper.buildCardDeck', () => {
  describe('default type', () => {
    describe('should build a standard 52-card deck of French playing cards', () => {
      let cards: Card[];
      beforeEach(() => {
        cards = buildCardDeck();
      });

      it('should return 52 cards', () => {
        expect(cards).length(52);
      });

      frenchCardSuits.forEach(suit =>
        frenchCardsValues.forEach(value => {
          it(`should have one ${value} ${suit} card`, () => {
            expect(
              cards?.filter(card => card.suit === suit && card.value === value),
            ).length(1);
          });
        }),
      );
    });
  });
});
