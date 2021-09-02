/* eslint-disable @typescript-eslint/naming-convention */
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocaldbDataSource} from '../datasources';
import {Card, CardRelations} from '../models';

export class CardRepository extends DefaultCrudRepository<Card,
  typeof Card.prototype.id,
  CardRelations> {
  constructor(
    @inject('datasources.localdb') dataSource: LocaldbDataSource,
  ) {
    super(Card, dataSource);
  }

  async draw(amountToBeDraw: number, deckId: string): Promise<Card[]> {
    

    const cardsToBeDraw = await this.getCardsToDraw(amountToBeDraw, deckId);

    await Promise.all(
      cardsToBeDraw.map((card) => {
        return super.update({...card, drawn: true} as Card);
      })
    );
    return cardsToBeDraw;
  }

  private async getCardsToDraw(amountToBeDraw: number, deckId: string) {
    const deckCards = await super.find({
      where: {deck_id: deckId, drawn: false},
      order: ['id']
    });
    return deckCards.slice(0, amountToBeDraw);
  }
}
