const { expect } = require('chai');
const Knight = require('../Knight');

describe('Knight', () => {

  describe('move', () => {

    let knight = null;

    beforeEach(() => {
      knight = new Knight({ startPosition: { x: 5, y: 5 } });
    });

    it('should reduce the value of x by 1 if passed N', () => {
      knight.move('N');
      expect(knight.position.x).to.equal(4);
    });

    it('should increase the value of x by 1 if passed S', () => {
      knight.move('S');
      expect(knight.position.x).to.equal(6);
    });

    it('should not effect the value of y if passed S or N', () => {
      knight.move('S');
      expect(knight.position.y).to.equal(5);
      knight.move('N');
      expect(knight.position.y).to.equal(5);
    });

    it('should increase the value of y by 1 if passed E', () => {
      knight.move('E');
      expect(knight.position.y).to.equal(6);
    });

    it('should decrease the value of y by 1 if passed W', () => {
      knight.move('W');
      expect(knight.position.y).to.equal(4);
    });

    it('should not effect the value of x if passed E or W', () => {
      knight.move('E');
      expect(knight.position.x).to.equal(5);
      knight.move('W');
      expect(knight.position.x).to.equal(5);
    });
  
  });

});