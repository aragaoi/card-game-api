// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';


import {repository} from "@loopback/repository";
import {DeckRepository} from "../repositories";
import {post, requestBody, Response, RestBindings} from "@loopback/rest";
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
  ): Promise<Deck | null> {

    const created = await this.deckRepository.create(deck);
    this.response.status(201);
    return created;
  }
}
