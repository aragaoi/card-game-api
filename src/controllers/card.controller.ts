/* eslint-disable @typescript-eslint/naming-convention */
import {HttpErrors, param, post, Response, RestBindings} from '@loopback/rest';
import {Card} from '../models';
import {repository} from '@loopback/repository';
import {CardRepository, DeckRepository} from '../repositories';
import {inject} from '@loopback/core';
import {validate} from 'uuid';

export class CardController {
  constructor(
    @repository(CardRepository) public cardRepository: CardRepository,
    @repository(DeckRepository) public deckRepository: DeckRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {}

  @post('/decks/{deck_id}/drawn-cards')
  async draw(
    @param.path.string('deck_id') deckId: string,
    @param.query.number('count') amountToBeDraw: number,
  ): Promise<{cards: Card[]}> {
    await this.validateDraw(deckId, amountToBeDraw);

    const cardsToBeDraw = await this.getCardsToDraw(amountToBeDraw, deckId);
    await this.drawCards(cardsToBeDraw);
    await this.updateRemainingCardsOnDeck(deckId, amountToBeDraw);

    this.response.status(200);
    return {
      cards: cardsToBeDraw.map(
        ({value, suit, code}) => new Card({value, suit, code}),
      ),
    };
  }

  private async drawCards(cardsToBeDraw: Card[]): Promise<void> {
    await Promise.all(
      cardsToBeDraw.map(card => {
        return this.cardRepository.update(new Card({...card, drawn: true}));
      }, this),
    );
  }

  private async getCardsToDraw(
    amountToBeDraw: number,
    deckId: string,
  ): Promise<Card[]> {
    const deckCards = await this.cardRepository.find({
      where: {deck_id: deckId, drawn: false},
      order: ['id'],
    });
    return deckCards.slice(0, amountToBeDraw);
  }

  private async updateRemainingCardsOnDeck(
    deckId: string,
    amountToBeDraw: number,
  ): Promise<void> {
    const deck = await this.deckRepository.findById(deckId);
    const {remaining = 0} = deck;
    deck.remaining =
      remaining > amountToBeDraw ? remaining - amountToBeDraw : 0;
    await this.deckRepository.update(deck);
  }

  private async validateDraw(
    deckId: string,
    amountToBeDraw: number,
  ): Promise<void> {
    if (!deckId || !validate(deckId)) {
      throw new HttpErrors.BadRequest('The deck id should be a valid UUID.');
    }

    const deck = await this.deckRepository.findById(deckId);
    if (!deck) {
      throw new HttpErrors.NotFound();
    }

    if (!amountToBeDraw) {
      throw new HttpErrors.BadRequest(
        'Provide a "count" query parameter to define how many cards to draw.',
      );
    }

    if (deck?.remaining) {
      if (
        !Number.isInteger(amountToBeDraw) ||
        amountToBeDraw < 1 ||
        amountToBeDraw > deck.remaining
      ) {
        throw new HttpErrors.BadRequest(
          `The "count" parameter should be an integer between 1 and ${deck.remaining}.`,
        );
      }
    } else {
      throw new HttpErrors.BadRequest('This deck has no remaining cards.');
    }
  }
}
