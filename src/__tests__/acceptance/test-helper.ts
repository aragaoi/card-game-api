import {CardGameApiApplication} from '../..';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new CardGameApiApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export function fakeCards() {
  return [
    {
      code: "AS",
      suit: "SPADES",
      value: "ACE",
    },
    {
      code: "2S",
      suit: "SPADES",
      value: "2",
    },
    {
      code: "3S",
      suit: "SPADES",
      value: "3",
    }
  ];
}

export interface AppWithClient {
  app: CardGameApiApplication;
  client: Client;
}
