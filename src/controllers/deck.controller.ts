/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from '@loopback/repository';
import {DeckRepository} from '../repositories';
import {get, HttpErrors, param, post, requestBody, Response, RestBindings,} from '@loopback/rest';
import {Card, Deck} from '../models';
import {inject} from '@loopback/core';
import {buildCardDeck} from "../helpers/card-type.helper";
import {shuffle} from "../helpers/array.helper";
import {validate} from "uuid";

export class DeckController {
  constructor(
    @repository(DeckRepository) public deckRepository: DeckRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {
  }

  @post('/decks')
  async create(@requestBody() deck: Omit<Deck, 'deck_id' | 'cards'>): Promise<Deck> {
    const deckCards = buildCardDeck();

    this.validateCreate(deck, deckCards.length);

    deck.remaining = deck?.remaining ?? deckCards.length;
    const createdDeck = await this.deckRepository.create(deck);

    await this.createDeckCards(createdDeck, deckCards);
    this.response.status(201);
    return createdDeck;
  }

  @get('/decks/{id}')
  async get(@param.path.string('id') deckId: string): Promise<Deck> {
    this.validateDeckId(deckId);

    const deck = await this.deckRepository.findById(deckId, {
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

  private validateCreate({deck_id: deckId, remaining, cards}: Partial<Deck>, maxCards: number): void {
    this.validateDeckId(deckId);

    const minCards = 0;
    if (remaining) {
      if (
        !Number.isInteger(remaining) ||
        remaining < minCards ||
        remaining > maxCards
      ) {
        throw new HttpErrors.BadRequest(
          `The "remaining" attribute should be an integer between ${minCards} and ${maxCards}.`,
        );
      }
    }

    if (cards?.length) {
      throw new HttpErrors.BadRequest('The cards are not allowed at the deck creation.');
    }
  }

  private validateDeckId(deckId: string | undefined): void {
    if (deckId && !validate(deckId)) {
      throw new HttpErrors.BadRequest('The deck id should be a valid UUID.');
    }
  }
}
