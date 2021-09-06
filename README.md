# card-game-api

An API to handle decks and cards to be used in any card game.

## Install dependencies

To install all necessary dependencies for this application, execute:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`, execute:

```sh
npm ci
```

## Run the application

You can run the application inside a Docker container or directly in the host environment.

### With Docker

To run inside a container (it needs the [Docker](https://www.docker.com/) properly installed on the environment),
execute the following commands:

- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

### Without Docker

To run in the host, execute:

```sh
npm start
```

You can also run `node .` to skip the build step.

## API

The application serves an API at http://localhost:3000.

[Documentation on Postman](https://documenter.getpostman.com/view/8780242/U16gPSmz)

The following methods are available.

#### Ping

`GET /ping`

To verify if the API is running.

#### Create a new Deck

`POST /decks`

Body:

```
{
    "deck_id": "62814f64-68dc-42ad-9321-1eea62a72e9e", // UUID v4
    "shuffled": false,
    "remaining": 52
}
```

#### Open a Deck

`GET /decks/{deck_id}`

#### Draw a card from a deck

A `count` parameter needs to be provided.

`POST /decks/{deck_id}/drawn-cards?count=2`

## Other commands

### Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

### Run the tests

To run the unit and acceptance (e2e) tests, execute the command:

```sh
npm test
```

This application was initially generated
using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) starting from the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).
