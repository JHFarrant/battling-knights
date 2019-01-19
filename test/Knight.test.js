const { expect } = require('chai');
const Knight = require('../Knight');
const Item = require('../Item');

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

    it('should push the last position to locationHistory', () => {
      knight.move('N');
      expect(knight.locationHistory[0].x).to.equal(4);
    });
  
  });

  describe('equipItem', () => {

    let knight2 = null;

    beforeEach(() => {
      knight2 = new Knight();
    });

    it('should enter the item to the knights item slot', () => {
      knight2.equipItem(new Item());
      expect(knight2.item).to.be.an.instanceOf(Item);
    });

  });

  describe('dropItem', () => {
    
    let knight3 = null;
    let item;

    beforeEach(() => {
      knight3 = new Knight({ startPosition: { x: 0, y: 0 } });
      item = new Item();
      knight3.equipItem(item);
    });

    it('should remove the item from the knights inventory', () => {
      knight3.dropItem();
      expect(knight3.item).to.be.null;
    });
    
    it('should set the item position to the passed value', () => {
      knight3.dropItem({ x: 1, y: 0 });
      expect(item.position).to.deep.equal({ x: 1, y: 0 });
    });
    
    it('if no value passed it should set the item position to the knights current position', () => {
      knight3.dropItem();
      expect(item.position).to.deep.equal({ x: 0, y: 0 });
    });

  });

  describe('drown', () => {

    let knight4 = null;

    beforeEach(() => {
      knight4 = new Knight({ startPosition: { x: 0, y: 0 } });
    });

    it('should set the status of the knight to DROWNED', () => {
      knight4.drown();
      expect(knight4.status).to.equal('DROWNED');
    });

    it('should remove any item from the knights inventory', () => {
      knight4.drown();
      expect(knight4.item).to.be.null;
    });

    it('should set the position of the knight to null', () => {
      knight4.drown();
      expect(knight4.position).to.be.null;
    });

  });

});