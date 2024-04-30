# ZeroDayComics

## backend

aiohttp ~~+ python-socketio~~

- move away from websockets since websockets are all about 2-way communication but my setup just has the client kick off initial req and keep accepting events after till done
- not very difficult to add websockets back tho since everything is so modularized

### Run

```bash
cd backend
python -m server
```

### TODO

- enable retries
- timeouts

## frontend

React UI

### Run

```bash
cd frontend
yarn # install packages
yarn start # will show up on localhost:3000
```

### TODO

- propagate socket err to UI
- refine translations second round
- support LNs
- ability to edit and move boxes

## models

### translators

- Deeplx

  ```bash
  docker run -it -p 1188:1188 ghcr.io/owo-network/deeplx:latest
  ```

- Gpt-3.5
  ```bash
  export OPENAI_API_KEY="YOUR_API_KEY"
  ```

### scrapers

- Pixiv
