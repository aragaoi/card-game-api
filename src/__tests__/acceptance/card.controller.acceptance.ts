/* eslint-disable @typescript-eslint/naming-convention */
import {Client, expect} from '@loopback/testlab';
import {CardGameApiApplication} from '../..';
import {setupApplication} from './test-helper';
import {DeckRepository} from "../../repositories";

describe('CardController', () => {
  let app: CardGameApiApplication;
  let client: Client;
  let deckRepository: DeckRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    deckRepository = await app.getRepository(DeckRepository);
  });

  after(async () => {
    await app.stop();
  });

  describe('POST /decks/:deck_id/drawn-cards', () => {
    before('populate decks', async () => {
      await deckRepository.create({
        deck_id: 'd83db9ec-feff-4afb-8fd0-5c1c5b23cdd4',
        shuffled: false,
        remaining: 3
      });
    });

    it('should draw the specified amount of cards', async () => {
      const deckUUID = 'd83db9ec-feff-4afb-8fd0-5c1c5b23cdd4';
      const cardsAmount = 2;
      const res = await client.post(`/decks/${deckUUID}/drawn-cards?count=${cardsAmount}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).to.be.eql({
        cards: [
          {
            value: "ACE",
            suit: "SPADES",
            code: "AS"
          },
          {
            value: "KING",
            suit: "HEARTS",
            code: "KH"
          }
        ]
      });
    });

    it('should return error for missing count parameter', async () => {
      const deckUUID = 'd83db9ec-feff-4afb-8fd0-5c1c5b23cdd4';
      const res = await client.post(`/decks/${deckUUID}/drawn-cards`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body?.error?.message).to.be
        .eql('Provide a "count" query parameter to define how many cards to draw.');
    });


    it('should return error for nonexistent deck_id', async () => {
      const deckUUID = '288e8402-a36d-4dd1-b912-31c5396e69df';
      const cardsAmount = 3;
      await client.post(`/decks/${deckUUID}/drawn-cards?count=${cardsAmount}`)
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should return error for missing deck_id', async () => {
      const deckUUID = '';
      const cardsAmount = 3;
      await client.post(`/decks/${deckUUID}/drawn-cards?count=${cardsAmount}`)
        .expect('Content-Type', /json/)
        .expect(404);
    });

    it('should return error for invalid deck_id', async () => {
      const deckUUID = 'invalid-a36d-4dd1-b912-31c5396e69df';
      const cardsAmount = 3;
      const res = await client.post(`/decks/${deckUUID}/drawn-cards?count=${cardsAmount}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).to.be.eql('The deck id should be a valid UUID.');
    });
  });
});