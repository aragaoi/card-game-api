/* eslint-disable @typescript-eslint/naming-convention */
import {Client, expect} from '@loopback/testlab';
import {CardGameApiApplication} from '../..';
import {fakeCards, setupApplication} from './test-helper';
import {CardRepository, DeckRepository} from '../../repositories';

const uuidPattern = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
);

describe('DeckController', () => {
  let app: CardGameApiApplication;
  let client: Client;
  let deckRepository: DeckRepository;
  let cardRepository: CardRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    deckRepository = await app.getRepository(DeckRepository);
    cardRepository = await app.getRepository(CardRepository);
  });

  after(async () => {
    await app.stop();
  });

  describe('POST /decks', () => {
    it('should create a new deck with the specified properties', async () => {
      const res = await client
        .post('/decks')
        .send({
          deck_id: '521b0293-01f7-44c2-9990-27079eb2352d',
          shuffled: false,
          remaining: 3,
        })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).to.be.eql({
        deck_id: '521b0293-01f7-44c2-9990-27079eb2352d',
        shuffled: false,
        remaining: 3,
      });
    });

    it('should create a new deck with default values', async () => {
      const res = await client
        .post('/decks')
        .send({})
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body?.deck_id).to.match(uuidPattern);
      expect(res.body).to.containEql({
        shuffled: false,
        remaining: 52,
      });
    });
  });

  describe('GET /decks', () => {
    before('populate decks', async () => {
      const deck = await deckRepository.create({
        deck_id: 'c64fb35c-f117-4219-a921-131c3bbd5857',
        shuffled: false,
        remaining: 3,
      });
      await cardRepository.createAll(
        fakeCards().map((card) => ({...card, deck_id: deck.deck_id})),
      );
    });

    it('should return the specified deck', async () => {
      const deckUUID = 'c64fb35c-f117-4219-a921-131c3bbd5857';
      const res = await client
        .get(`/decks/${deckUUID}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.containEql({
        deck_id: 'c64fb35c-f117-4219-a921-131c3bbd5857',
        shuffled: false,
        remaining: 3,
      });
      expect(res.body?.cards).to.be.length(3);
    });

    it('should return error for missing deck_id', async () => {
      const deckUUID = '';
      await client
        .get(`/decks/${deckUUID}`)
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should return error for invalid deck_id', async () => {
      const deckUUID = 'abcd1234-qwert9876';
      await client
        .get(`/decks/${deckUUID}`)
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });
});
