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

    })

  });

});