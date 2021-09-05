import {Card} from "../models";
import {FRENCH_CARDS_SUITS, FRENCH_CARDS_VALUES} from "../constants/card.constants";

const buildCardDeck = (): Card[] => {
  const cards: Card[] = [];

  FRENCH_CARDS_SUITS.forEach(suit =>
    FRENCH_CARDS_VALUES.forEach(value => {
      cards.push(new Card({
        value,
        suit,
        code: `${value[0]}${suit[0]}`
      }))
    })
  );
  return cards;
};

export {buildCardDeck};