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

  @post('/decks/{deckId}/drawn-cards')
  async draw(
    @param.path.string('deckId') deckId: string,
    @param.query.number('count') amountToBeDraw: number
  ): Promise<Card[]> {

    await this.validate(deckId, amountToBeDraw);

    const drawnCards: Card[] = await this.cardRepository.draw(amountToBeDraw, deckId);
    this.response.status(200);
    return drawnCards;
  }

  private async validate(deckId: string, amountToBeDraw: number) {
    if (!amountToBeDraw) {
      throw new HttpErrors.BadRequest('Provide a "count" query parameter to define how many cards to draw.')
    }

    if (!validate(deckId)) {
      throw new HttpErrors.BadRequest('The deck id should be a valid UUID.');
    }

    if (!(await this.deckRepository.exists(deckId))) {
      throw new HttpErrors.NotFound;
    }
  }
}
