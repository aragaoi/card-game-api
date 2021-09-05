/* eslint-disable @typescript-eslint/naming-convention */
import {HttpErrors, param, post, Response, RestBindings} from "@loopback/rest";
import {Card} from "../models";
import {repository} from "@loopback/repository";
import {CardRepository, DeckRepository} from "../repositories";
import {inject} from "@loopback/core";
import {validate} from "uuid";

export class CardController {
  constructor(
    @repository(CardRepository) public cardRepository: CardRepository,
    @repository(DeckRepository) public deckRepository: DeckRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {
  }

  @post('/decks/{deck_id}/drawn-cards')
  async draw(
    @param.path.string('deck_id') deck_id: string,
    @param.query.number('count') amountToBeDraw: number
  ): Promise<{ cards: Card[] }> {

    await this.validate(deck_id, amountToBeDraw);

    const drawnCards: Card[] = await this.cardRepository.draw(amountToBeDraw, deck_id);
    this.response.status(200);
    return {
      cards: drawnCards.map(({value, suit, code}) => (new Card({value, suit, code})))
    };
  }

  private async validate(deck_id: string, amountToBeDraw: number) {
    if (!amountToBeDraw) {
      throw new HttpErrors.BadRequest('Provide a "count" query parameter to define how many cards to draw.')
    }

    if (!validate(deck_id)) {
      throw new HttpErrors.BadRequest('The deck id should be a valid UUID.');
    }

    if (!(await this.deckRepository.exists(deck_id))) {
      throw new HttpErrors.NotFound;
    }
  }
}
