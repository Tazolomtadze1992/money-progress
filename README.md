# MoneyPot Progress Journey — Prototype

A mobile prototype for a savings goal progress screen with an SVG journey map, animated marker, and checkpoint activation.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
```

## Features

- Mobile phone mockup (390×844) with Georgian UI labels
- SVG path-based journey route with marker movement via `getPointAtLength()`
- Active route reveal via `stroke-dasharray` / `stroke-dashoffset`
- Checkpoints aligned to the same path geometry
- External controls: 0% / 25% / 50% / 75% / 100%, slider, and "Simulate saving"
