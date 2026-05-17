# Tide Calculator

A small command-line tool for predicting ocean tide heights based on
lunar and solar tidal constituents.

## Usage

    node src/index.js --location 40.7128 --date 2026-05-17

The tool prints a 24-hour table of predicted tide heights for the
given latitude and date.

## How it works

The calculator combines three primary tidal constituents:

- M2 — principal lunar semi-diurnal
- S2 — principal solar semi-diurnal
- K1 — lunar diurnal

Each constituent contributes a cosine wave at its characteristic
period. The sum is scaled by a latitude factor to produce the
predicted height.

## Project layout

    src/
      index.js          Entry point and CLI parsing
      calculator.js     Core tidal math
      formatters.js     Output formatting helpers
      constants.js      Astronomical constants
    tests/
      calculator.test.js

## Testing

    npm test

Uses the built-in Node test runner. No external dependencies.
