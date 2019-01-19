/**
 * Item class for tracking state of items, items confer bonuses on the knights who equip them
 */
class Item {
  constructor({ name, attack = 0, defence = 0, startPosition } = {}) {
    Object.assign(this, {
      attack,
      defence,
      name,
      position: startPosition
    });
  }
}

module.exports = Item;