const Knight = require('./Knight');

/**
 * Main game class, tracks the overall game state, initiates each turn, and exports final output.
 */
class Game {
  /**
   * Creates game instance from game config object
   * @param {object} gameConfig - turns, knights, items, boardSize
   */
  constructor({ turns, knights = {}, items = {}, boardSize }) {
    Object.assign(this, {
      board: Game.createBoard(boardSize),
      items,
      knights,
      turns,
      turnHistory: []
    });

    Object.values(knights).forEach((knight) => this.placeOnBoard(knight));
    Object.values(items).forEach((item) => this.placeOnBoard(item));

  }

  /**
   * Static function to create game board based on passed size object
   * @param {object} boardSize - object with x and y props 
   * @return {array} - game board as 3d array
   */
  static createBoard({ x = 8, y = 8 } = {}) {
    const columns = Array.from({ length: x });
    const board = columns.map(col => {
      const row = Array.from({ length: y }).map(row => {
        const space = [];
        return space;
      });
      return row;
    });
    return board;
  }

  /**
   * Creates results object of game outcome to be saved as final_state.json
   */
  createResultsObject() {
    const { knights, items } = this;

    const knightResultsArr = Object.values(knights)
      .map(({
        name, position, status, item, attack, defence
      }) => ({
        [name]: [
          position && [position.x, position.y],
          status,
          item && item.name,
          attack,
          defence
        ]
      }));

    const itemResultsArr = Object.values(items)
      .map(({
        name, position, equipped
      }) => ({
        [name]: [
          position && [position.x, position.y],
          equipped
        ]
      }));

    const resultObj = [...knightResultsArr, ...itemResultsArr]
      .reduce((acc, cur) => Object.assign(acc, cur), {});

    return resultObj;

  }

  /**
   * Creates array of turn objects from txt turn string.
   * @param {string} turnString
   * @return {array} - turns
   */
  static parseTurnString(turnString) {
    const stepsString = turnString.match(/^GAME-START\n([\s|\S]*)\nGAME-END$/);
    if (!stepsString) throw new SyntaxError('Invalid turnString in moves.txt');

    const stepsArr = stepsString[1].split('\n');
    const turns = stepsArr.map((step) => {
      const [knight, direction] = step.split(':');
      Game.validateStep(knight, direction);
      return { knight, direction };
    });
    return turns;
  }

  /**
   * Method to playthrough full game, recursively calls self until their are no more turns to play 
   */
  play() {
    this.playTurn();
    if (0 < this.turns.length) this.play();
  }

  /**
   * Places game pieces (items/knights) on board based on their position value and returns bool based on success.
   * @param {Knight|Item} piece - custom class with position object
   * @return {boolean} - true if piece placed, false if not
   */
  placeOnBoard(piece) {
    const { x, y } = piece.position;

    const row = this.board[x];
    const column = row ? row[y] : null;
    if (column instanceof Array) {
      column.push(piece);
      return true;
    }
    else return false;
  }

  /**
   * Handles combat phase of game turn, finding enemy, fighting and updating board with result
   * @param {Knight} knight 
   * @param {array}} space 
   */
  playCombatPhase(knight, space) {
    const enemy = knight.findEnemy(space);
    if (enemy) {
      const [loser, item] = knight.fight(enemy);
      this.removeRemainingTurns(loser.name);
      if (item) this.placeOnBoard(item);
    }
  }

  /**
   * Handles item phase of game turn, finding, equipping and removing item from board
   * @param {Knight} knight - active knight for this turn
   * @param {array} space - space occupied by the knight
   */
  playItemPhase(knight, space) {
    if (knight.item) return null;

    const items = knight.findItem(space);
    if (items.length) {
      const item = Knight.selectItem(items);
      if (item) {
        knight.equipItem(item);
        this.removeFromBoard(item);
      }
    }
  }

  /**
   * Handles movement phase of game turn, including possible drowning, returns success or failure on move
   * @param {Knight} knight - active knight for this turn
   * @param {string} direction - direction to move (N | E | S | W)
   * @return {boolean} - returns if movement was success
   */
  playMovementPhase(knight, direction) {
    this.removeFromBoard(knight);
    knight.move(direction);
    const moveSuccessful = this.placeOnBoard(knight);
    if (!moveSuccessful) {
      const item = knight.drown();
      if (item) this.placeOnBoard(item);
      this.removeRemainingTurns(knight.name);
    }
    return moveSuccessful;
  }

  /**
   * Method for initiating each turn and executing the associated actions via the phase methods, also updates the turns array
   */
  playTurn() {
    const [turn, ...remainingTurns] = this.turns;
    this.turnHistory.push(turn);
    this.turns = remainingTurns;

    const { knight: knightName, direction } = turn;
    const knight = this.knights[knightName];

    const moveSuccessful = this.playMovementPhase(knight, direction);
    if (moveSuccessful) {
      const { x, y } = knight.position;
      const space = this.board[x][y];
      this.playItemPhase(knight, space);
      this.playCombatPhase(knight, space);
    }

  }

  /**
   * Removes all the remaining turns for a dead knight who has either drowned or died
   * @param {string} deadKnight - name property from the dead knight
   */
  removeRemainingTurns(deadKnight) {
    const { turns } = this;
    this.turns = turns.filter(({ knight }) => knight !== deadKnight.slice(0, 1));
  }

  /**
   * Removes game pieces from board, relies on the position object to find the piece
   * @param {Knight|Item} piece - custom class with position object
   */
  removeFromBoard(piece) {
    const { x, y } = piece.position;
    const idx = this.board[x][y].indexOf(piece);
    this.board[x][y].splice(idx, 1);
  }

  /**
   * Static method to validate knight and direction in step using validKnight and validDirection enums
   * @param {string} knight 
   * @param {string} direction 
   */
  static validateStep(knight, direction) {
    const { validKnights, validDirections } = this;
    const isValidKnight = validKnights[knight];
    const isValidDirection = validDirections[direction];
    if (!isValidKnight || !isValidDirection) throw new SyntaxError('Invalid knight or direction in step');
  }

  /**
   * Static getter returns a valid directions enum
   */
  static get validDirections() {
    return {
      N: 'N',
      E: 'E',
      S: 'S',
      W: 'W'
    }
  }

  /**
   * Static getter returns a valid knights enum
   */
  static get validKnights() {
    return {
      R: 'R',
      G: 'G',
      B: 'B',
      Y: 'Y'
    }
  }

}

module.exports = Game;