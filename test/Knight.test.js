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

  describe('findItem', () => {

    let knight5 = null;

    beforeEach(() => {
      knight5 = new Knight();
    });
    
    it('should return an array', () => {
      expect(knight5.findItem([])).to.be.an.instanceOf(Array);
    });

    it('should return an empty array if no items in space', () => {
      expect(knight5.findItem([])).to.be.an.instanceOf(Array).that.is.empty;
    });
    
    it('should return an array with a single item in if one item in space', () => {
      expect(knight5.findItem([new Item()]).length).to.equal(1);
    });
    
    it('should return an array with multiple items in if multiple items in space', () => {
      const item1 = new Item('Axe');
      const item2 = new Item('Dagger');
      const item3 = new Item('Helmet');
      const space = [item1, item2, item3]
      expect(knight5.findItem(space)[0]).to.equal(item1);
      expect(knight5.findItem(space)[1]).to.equal(item2);
      expect(knight5.findItem(space)[2]).to.equal(item3);
    });

    it('should not return any knights in the space', () => {
      expect(knight5.findItem([knight5, new Item()]).length).to.equal(1);
    });

  });

  describe('static selectItem', () => {

    let item1 = new Item({ attack: 1 });
    let item2 = new Item({ attack: 1, defence: 1 });
    let item3 = new Item({ defence: 1 });
    let item4 = new Item({ attack: 2 });
    
    it('should return an item', () => {
      const items = [item1, item2, item3, item4];
      expect(Knight.selectItem(items)).to.be.an.instanceOf(Item);
    });
    
    it('should prefer items with strongest attack', () => {
      const items = [item2, item3, item1, item4];
      expect(Knight.selectItem(items)).to.equal(item4);
    });
    
    it('should prefer items with highest overall stats', () => {
      const items = [item3, item2, item1];
      expect(Knight.selectItem(items)).to.equal(item2);
    });

  });

  describe('findEnemy', () => {

    let knight6 = null;

    beforeEach(() => {
      knight6 = new Knight();
    });

    it('it should return null if no enemy knights in space', () => {
      expect(knight6.findEnemy([])).to.be.null;
    });
    
    it('should return an instance of Knight if an enemy knight in space', () => {
      const enemy = new Knight();
      expect(knight6.findEnemy([knight6, enemy])).to.equal(enemy);
    });

    it('should not return the Knight it is called on', () => {
      expect(knight6.findEnemy([knight6])).to.be.null;
    });

  });

  describe('die', () => {

    it('should set the knight\'s status to DEAD', () => {
      const knight = new Knight();
      knight.die();
      expect(knight.status).to.equal('DEAD');
    });

    it('should remove an equipped item', () => {
      const knight = new Knight();
      knight.equipItem(new Item());
      knight.die();
      expect(knight.item).to.be.null;
    });

  });

  describe('fight', () => {

    let knight7 = null;
    let knight8 = null;
    let defenceItem = new Item({ defence: 2 });
    let attackItem = new Item({ attack: 2 });

    beforeEach(() => {
      knight7 = new Knight();
      knight8 = new Knight();
    });

    it('should set the knight\'s status to DEAD if the enemy had greater defence', () => {
      knight8.equipItem(defenceItem);
      knight7.fight(knight8);
      expect(knight7.status).to.equal('DEAD');
    });

    it('should leave the enemy\'s status unchanged if the enemy had greater defence', () => {
      knight8.equipItem(defenceItem);
      knight7.fight(knight8);
      expect(knight8.status).to.equal('ALIVE');
    });
    
    it('should set the enemy\'s status to DEAD if the knight had greater attack', () => {
      knight7.equipItem(attackItem);
      knight7.fight(knight8);
      expect(knight8.status).to.equal('DEAD');
    });

    it('should set the enemy\'s status to DEAD if the knight had equal attack (due to surpise bonus)', () => {
      knight7.fight(knight8);
      expect(knight8.status).to.equal('DEAD');
    });

    it('should leave the knight\'s status unchanged if the enemy had equal or lesser defence', () => {
      knight7.fight(knight8);
      expect(knight7.status).to.equal('ALIVE');
    });

    it('should not be affected by the enemy\'s attack', () => {
      knight8.equipItem(attackItem);
      knight7.fight(knight8);
      expect(knight8.status).to.equal('DEAD');
    });

  });

});