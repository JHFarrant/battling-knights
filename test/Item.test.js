const { expect } = require('chai');
const Item = require('../Item');

describe('Item', () => {

  describe('equip', () => {

    it('should set equipped to true', () => {
      const item = new Item();
      item.equip();
      expect(item.equipped).to.be.true;
    });
    
  });
  
  describe('drop', () => {

    let item = null;

    beforeEach(() => {
      item = new Item({ position: { x: 2, y: 2 } });
      item.equip();
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