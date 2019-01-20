# Battling Knights

Technical test for BBOXX.

## Set up instructions

```
// install dependencies with npm
npm install

// run test suite
npm test

// start knights battle cli
npm start
```

## Usage instructions

To use Knight Battle either enter the filepath to your moves.txt file when prompted by the Knights Battle CLI.

Alternatively, replace the default moves.txt in the root directory and enter no filepath when prompted by Knights Battle CLI.

Knight Battle outputs final_state.json to root directory, the `console.log` in index.js can be uncommented to print the same object to the CLI.

## Notes

- The project is incomplete however the game plays successfully.
- The later additions to the code base lack automated tests due to time limitations, given more time I would revise this and expand the test coverage.
- This was roughly 5.5 - 6 hours of work.