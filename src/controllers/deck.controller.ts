/* eslint-disable @typescript-eslint/naming-convention */
import {repository} from "@loopback/repository";
import {DeckRepository} from "../repositories";
import {post, get, requestBody, Response, RestBindings, param} from "@loopback/rest";
import {Deck} from "../models";
import {inject} from "@loopback/core";

export class DeckController {
  constructor(
    @repository(DeckRepository) public deckRepository: DeckRepository,
    @inject(RestBindings.Http.RESPONSE) protected response: Response,
  ) {
  }

  @post('/decks')
  async create(
    @requestBody() deck: Omit<Deck, 'deck_id'>
  ): Promise<Deck> {

    const created = await this.deckRepository.create(deck);
    this.response.status(201);
    return created;
  }

  @get('/decks/{id}')
  async get(
    @param.path.string('id') deck_id: string
  ): Promise<Deck> {

    const deck = await this.deckRepository.findById(deck_id);
    this.response.status(200);
    return deck;
  }
}
