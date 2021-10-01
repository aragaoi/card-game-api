/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {DeckRepository} from '../repositories';
import {
  post,
  get,
  requestBody,
  Response,
  RestBindings,
  param,
} from '@loopback/rest';
import {Card, Deck} from '../models';
import {inject} from '@loopback/core';
import {buildCardDeck} from "../helpers/card-type.helper";
import {shuffle} from "../helpers/array.helper";

export class DeckController {
  constructor(
    @repository(DeckRepository) public deckRepository: DeckRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {
  }

  @post('/decks')
  async create(@requestBody() deck: Omit<Deck, 'deck_id'>): Promise<Deck> {
    const deckCards = buildCardDeck();

    deck.remaining = deck?.remaining ?? deckCards.length;
    const createdDeck = await this.deckRepository.create(deck);

    await this.createDeckCards(createdDeck, deckCards);
    this.response.status(201);
    return createdDeck;
  }

  @get('/decks/{id}')
  async get(@param.path.string('id') deck_id: string): Promise<Deck> {
    const deck = await this.deckRepository.findById(deck_id, {
      include: [
        {
          relation: 'cards',
          scope: {fields: ['value', 'suit', 'code', 'deck_id'], where: {drawn: false}},
        },
      ],
    });
    this.response.status(200);
    return deck;
  }

  private async createDeckCards({deck_id, shuffled, remaining}: Deck, cards: Card[]): Promise<void> {
    if (shuffled) {
      cards = shuffle(cards);
    }
    cards = cards.slice(0, remaining);
    await Promise.all(
      cards.map(card => this.deckRepository.cards(deck_id).create(card), this),
    );
  }
}
