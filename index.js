const fs = require('fs');
const readline = require('readline');
const Game = require('./Game');
const Item = require('./Item');
const Knight = require('./Knight');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`Welcome to Knights Battle!\n`);

rl.question('To begin battling your knights enter the filepath to your moves.txt:\n', (path) => {

  if (!path) path = './moves.txt';

  if(!/\.txt$/.test(path)) throw new TypeError('Invalid path/file, require file of type .txt');

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err;
    else {

      const turns = Game.parseTurnString(data);

      const knights = {
        R: new Knight({
          name: 'Red',
          startPosition: { x: 0, y: 0 }
        }),
        B: new Knight({
          name: 'Blue',
          startPosition: { x: 7, y: 0 }
        }),
        G: new Knight({
          name: 'Green',
          startPosition: { x: 7, y: 7 }
        }),
        Y: new Knight({
          name: 'Yellow',
          startPosition: { x: 0, y: 7 }
        })
      };

      const items = {
        A: new Item({
          name: 'Axe',
          attack: 2,
          startPosition: { x: 2, y: 2 }
        }),
        D: new Item({
          name: 'Dagger',
          attack: 1,
          startPosition: { x: 2, y: 5 }
        }),
        M: new Item({
          name: 'MagicStaff',
          attack: 1,
          defence: 1,
          startPosition: { x: 5, y: 2 }
        }),
        H: new Item({
          name: 'Helmet',
          defence: 1,
          startPosition: { x: 5, y: 5 }
        })
      };

      const boardSize = { x: 8, y: 8 }

      const game = new Game({
        turns,
        knights,
        items,
        boardSize
      });

      game.play();

      console.log(game.createResultsObject());

      fs.writeFile('./final_state.json', JSON.stringify(game.createResultsObject()), (err) => {
        if (err) throw err;
        else console.log('Success! Open ./final_state.json to see game results.');
      });
    }
  });

  rl.close();
})