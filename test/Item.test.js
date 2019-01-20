const { expect } = require('chai');
const Item = require('../Item');
const Knight = require('../Knight');

describe('Item', () => {
  
  let knight = null;

  beforeEach(() => {
    knight = new Knight({ startPosition: { x: 1, y: 1 }})
  });

  describe('equip', () => {


    it('should set equipped to true', () => {
      const item = new Item();
      item.equip(knight);
      expect(item.equipped).to.be.true;
    });
    
  });
  
  describe('drop', () => {

    let item = null;

    beforeEach(() => {
      item = new Item({ position: { x: 2, y: 2 } });
      item.equip(knight);
    });
    
    it('should set equipped to false', () => {
      item.drop();
      expect(item.equipped).to.be.false;
    });
    
    it('should set position to the passed position', () => {
      item.drop({ x: 5, y: 5 });
      expect(item.position.x).to.equal(5);
      expect(item.position.y).to.equal(5);
    });

  });

});