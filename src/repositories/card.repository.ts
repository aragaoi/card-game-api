/* eslint-disable @typescript-eslint/naming-convention */
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocaldbDataSource} from '../datasources';
import {Card, CardRelations} from '../models';

export class CardRepository extends DefaultCrudRepository<
  Card,
  typeof Card.prototype.id,
  CardRelations
> {
  constructor(@inject('datasources.localdb') dataSource: LocaldbDataSource) {
    super(Card, dataSource);
  }

  async draw(amountToBeDraw: number, deck_id: string): Promise<Card[]> {
    const cardsToBeDraw = await this.getCardsToDraw(amountToBeDraw, deck_id);

    await Promise.all(
      cardsToBeDraw.map(card => {
        return this.update(new Card({...card, drawn: true}));
      }),
    );

    return cardsToBeDraw;
  }

  private async getCardsToDraw(amountToBeDraw: number, deck_id: string) {
    const deckCards = await super.find({
      where: {deck_id: deck_id, drawn: false},
      order: ['id'],
    });
    return deckCards.slice(0, amountToBeDraw);
  }
}
