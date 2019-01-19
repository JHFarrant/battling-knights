const { expect } = require('chai');
const Game = require('../Game');

const movesString = `GAME-START
R:S
R:S
B:E
G:N
Y:N
GAME-END`;

describe('Game', () => {

  describe('static parseTurnString', () => {

    describe('with valid input', () => {

      it('should accept a string', () => {
        expect(() => Game.parseTurnString(movesString)).to.not.throw(Error);
      });

      it('should return an array', () => {
        expect(Game.parseTurnString(movesString)).to.be.an.instanceOf(Array);
      });

      it('should return objects in the array', () => {
        expect(Game.parseTurnString(movesString)[0]).to.be.an('object');
      });

      it('should return objects with the correct properties', () => {
        expect(Game.parseTurnString(movesString)[0]).to.have.a.property('knight');
        expect(Game.parseTurnString(movesString)[0]).to.have.a.property('direction');
      });

    });

    describe('with invalid input', () => {

      it('should throw a type error with no argument supplied', () => {
        expect(() => Game.parseTurnString()).to.throw(TypeError);
      });
      
      it('should throw a type error with non-string arguments', () => {
        expect(() => Game.parseTurnString({})).to.throw(TypeError);
        expect(() => Game.parseTurnString(2)).to.throw(TypeError);
        expect(() => Game.parseTurnString([])).to.throw(TypeError);
        expect(() => Game.parseTurnString(NaN)).to.throw(TypeError);
      });

      it('should throw a syntax error with a string missing GAME-START & GAME-END', () => {
        const invalidMoveStringA = `R:S\nR:S\nB:E\nG:N\nY:N`;
        expect(() => Game.parseTurnString(invalidMoveStringA)).to.throw(SyntaxError);
      });

      it('should throw a syntax error with invalid turn instructions', () => {
        const invalidMoveStringB = `GAME-START\nH:S\nF:S\nZ:E\nGAME-END`;
        expect(() => Game.parseTurnString(invalidMoveStringB)).to.throw(SyntaxError);
        const invalidMoveStringC = `GAME-START\nR:Z\nR:Z\nB:P\nGAME-END`;
        expect(() => Game.parseTurnString(invalidMoveStringC)).to.throw(SyntaxError);
      });

    });

  });

  describe('static createBoard', () => {

    it('should return an array at the top level', () => {
      expect(Game.createBoard({ x: 1, y: 1 })).to.be.an.instanceOf(Array);
    });

    it('should return an array at the middle level', () => {
      expect(Game.createBoard({ x: 1, y: 1 })[0]).to.be.an.instanceOf(Array);
    });
    
    it('should return an array at the bottom level', () => {
      expect(Game.createBoard({ x: 1, y: 1 })[0][0]).to.be.an.instanceOf(Array);
    });
    
    it('should return as many columns as the passed x value', () => {
      expect(Game.createBoard({ x: 10, y: 1 }).length).to.equal(10);
    });

    it('should return as many rows as the passed y value', () => {
      expect(Game.createBoard({ x: 1, y: 10 })[0].length).to.equal(10);
    });

  });

  describe('placeOnBoard', () => {

    let game2 = null;
    let gamePiece2 = { position: { x: 5, y: 5 } };

    beforeEach(() => {
      game2 = new Game({
        boardSize: { x: 10, y: 10 },
        knights: { gamePiece2 }
      });
    });

    it('should place the passed piece based on its position value', () => {
      const gamePiece = { position: { x: 0, y: 0 } };
      game2.placeOnBoard(gamePiece);
      expect(game2.board[0][0][0]).to.equal(gamePiece);
    });

    it('should not effect other pieces occupying the same space', () => {
      const gamePiece = { position: { x: 5, y: 5 } };
      game2.placeOnBoard(gamePiece);
      expect(game2.board[5][5][0]).to.equal(gamePiece2);
    });
    
    it('should return true for a successfully placed piece', () => {
      const gamePiece = { position: { x: 0, y: 0 } };
      const pieceOnBoard = game2.placeOnBoard(gamePiece);
      expect(pieceOnBoard).to.be.true;
    });

    it('should return false for an unplaceable piece', () => {
      const gamePiece = { position: { x: -1, y: 0 } };
      const pieceOnBoard = game2.placeOnBoard(gamePiece);
      expect(pieceOnBoard).to.be.false;
    });

  });

  describe('removeFromBoard', () => {

    let game3 = null;
    let gamePiece1 = null;
    let gamePiece2 = null;
    let gamePiece3 = null;
    let gamePiece4 = null;

    beforeEach(() => {
      gamePiece1 = { position: { x: 0, y: 0 } };
      gamePiece2 = { position: { x: 9, y: 9 } };
      gamePiece3 = { name: 'Axe', position: { x: 5, y: 5 } };
      gamePiece4 = { name: 'Dagger', position: { x: 5, y: 5 } };

      game3 = new Game({
        boardSize: { x: 10, y: 10 },
        knights: { gamePiece1, gamePiece2 },
        items: { gamePiece3, gamePiece4 }
      });
    });

    it('should remove the passed piece from the board', () => {
      game3.removeFromBoard(gamePiece1);
      expect(game3.board[0][0]).to.be.an.instanceOf(Array).that.is.empty;
      game3.removeFromBoard(gamePiece2);
      expect(game3.board[9][9]).to.be.an.instanceOf(Array).that.is.empty;
    });

    it('should not affect the other pieces on the board', () => {
      game3.removeFromBoard(gamePiece1);
      expect(game3.board[9][9][0]).to.equal(gamePiece2);
    });

    it('should only remove the targeted piece from a space with multiple pieces', () => {
      game3.removeFromBoard(gamePiece4);
      expect(game3.board[5][5].length).to.equal(1);
      expect(game3.board[5][5][0]).to.equal(gamePiece3);
    });

  });

});