import {Card} from "../models";
import {FRENCH_CARDS_SUITS, FRENCH_CARDS_VALUES} from "../constants/card.constants";

const buildCardDeck = (): Card[] => {
  const cards: Card[] = [];

  FRENCH_CARDS_SUITS.forEach(suit =>
    FRENCH_CARDS_VALUES.forEach(value => {
      cards.push(new Card({
        value,
        suit,
        code: `${value.length > 2 ? value[0] : value}${suit[0]}` // use the 2 digits when value is 10
      }))
    })
  );
  return cards;
};

export {buildCardDeck};