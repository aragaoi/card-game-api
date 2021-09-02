/* eslint-disable @typescript-eslint/naming-convention */
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {LocaldbDataSource} from '../datasources';
import {Deck, DeckRelations} from '../models';
import {v4 as uuidv4} from 'uuid';

export class DeckRepository extends DefaultCrudRepository<Deck,
  typeof Deck.prototype.deck_id,
  DeckRelations> {
  private readonly defaultDeckProps: Omit<Deck, 'deck_id'>;

  constructor(
    @inject('datasources.localdb') dataSource: LocaldbDataSource,
  ) {
    super(Deck, dataSource);
    this.defaultDeckProps = {
      shuffled: false,
      remaining: 52,
    };
  }


  async create(deck: Omit<Deck, 'deck_id'> | undefined) {
    const filledDeck = {
      ...this.defaultDeckProps,
      ...deck,
      deck_id: deck?.deck_id ?? uuidv4()
    }
    return super.create(filledDeck);
  }
}
