# Internship Front 2026

React 19 frontend for the internship AI chat app, built with [Vite](https://vite.dev).

## Setup

```bash
npm install
cp .env.example .env.local   # optional: override the backend API URL
```

By default the app talks to the backend at `http://localhost:8080`. Set `VITE_API_BASE_URL`
in `.env.local` (gitignored) to point elsewhere.

## Available Scripts

### `npm run dev` (alias: `npm start`)

Runs the app in development mode with hot module reload.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Runs the test suite once with [Vitest](https://vitest.dev) + React Testing Library.
Use `npm run test:watch` for interactive watch mode.

### `npm run build`

Builds the app for production into the `dist` folder.

### `npm run preview`

Serves the production build from `dist` locally, for a final sanity check before deploying.

### `npm run format` / `npm run format:check`

Formats (or checks formatting of) all source files with [Prettier](https://prettier.io).

## Docker

```bash
docker build -t internship-front .
docker run -p 8081:80 internship-front
```

Serves the production build via nginx on port 80 inside the container (mapped to `8081` above),
with SPA fallback routing for `react-router`. Pass `--build-arg VITE_API_BASE_URL=https://api.example.com`
if the backend isn't at `http://localhost:8080`.

## Project structure

- `src/api` — axios client and chat API calls
- `src/components` — presentational/UI components
- `src/context` — React Context providers (auth, active chat session)
- `src/hooks` — reusable stateful logic (chat conversation flow)
- `src/pages` — route-level page components
