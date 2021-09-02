/* eslint-disable @typescript-eslint/naming-convention */
import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {LocaldbDataSource} from '../datasources';
import {Deck, DeckRelations, Card} from '../models';
import {v4 as uuidv4} from 'uuid';
import {CardRepository} from './card.repository';

export class DeckRepository extends DefaultCrudRepository<Deck,
  typeof Deck.prototype.deck_id,
  DeckRelations> {
  private readonly defaultDeckProps: Omit<Deck, 'deck_id'>;

  public readonly cards: HasManyRepositoryFactory<Card, typeof Deck.prototype.deck_id>;

  constructor(
    @inject('datasources.localdb') dataSource: LocaldbDataSource, @repository.getter('CardRepository') protected cardRepositoryGetter: Getter<CardRepository>,
  ) {
    super(Deck, dataSource);
    this.cards = this.createHasManyRepositoryFactoryFor('cards', cardRepositoryGetter,);
    this.registerInclusionResolver('cards', this.cards.inclusionResolver);
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
