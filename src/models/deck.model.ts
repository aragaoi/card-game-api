import {Entity, model, property, hasMany} from '@loopback/repository';
import {Card} from './card.model';

@model({settings: {strict: false}})
export class Deck extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
    // eslint-disable-next-line @typescript-eslint/naming-convention
  deck_id: string;

  @property({
    type: 'boolean',
    required: true,
  })
  shuffled: boolean;

  @property({
    type: 'number',
  })
  remaining?: number;

  @hasMany(() => Card, {keyTo: 'deck_id'})
  cards: Card[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Deck>) {
    super(data);
  }
}

export interface DeckRelations {
  // describe navigational properties here
}

export type DeckWithRelations = Deck & DeckRelations;
