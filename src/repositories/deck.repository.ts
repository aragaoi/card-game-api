/* eslint-disable @typescript-eslint/naming-convention */
import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository,} from '@loopback/repository';
import {LocaldbDataSource} from '../datasources';
import {Card, Deck, DeckRelations} from '../models';
import {CardRepository} from './card.repository';
import {buildCardDeck} from '../helpers/card-type.helper';
import {shuffle} from '../helpers/array.helper';

export class DeckRepository extends DefaultCrudRepository<Deck,
  typeof Deck.prototype.deck_id,
  DeckRelations> {
  public readonly cards: HasManyRepositoryFactory<Card,
    typeof Deck.prototype.deck_id>;

  constructor(
    @inject('datasources.localdb') dataSource: LocaldbDataSource,
    @repository.getter('CardRepository')
    protected cardRepositoryGetter: Getter<CardRepository>,
  ) {
    super(Deck, dataSource);
    this.cards = this.createHasManyRepositoryFactoryFor(
      'cards',
      cardRepositoryGetter,
    );
    this.registerInclusionResolver('cards', this.cards.inclusionResolver);
  }

  async create(deck: Partial<Deck>): Promise<Deck> {
    const createdDeck = await super.create(deck);

    await this.createDeckCards(createdDeck);
    return createdDeck;
  }

  private async createDeckCards({deck_id, remaining, shuffled}: Deck): Promise<void> {
    let cards = buildCardDeck();
    if (shuffled) {
      cards = shuffle(cards);
    }
    cards = cards.slice(0, remaining);
    await Promise.all(
      cards.map(card => this.cards(deck_id).create(card), this),
    );
  }
}
