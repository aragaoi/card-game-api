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
}
