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
      turns
    });

    Object.values(knights).forEach((knight) => this.placeOnBoard(knight));
    Object.values(items).forEach((item) => this.placeOnBoard(item));

  }

  /**
   * Static function to create game board based on passed size object
   * @param {object} boardSize - object with x and y props 
   * @return {array} - game board as 3d array
   */
  static createBoard({ x, y }) {
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