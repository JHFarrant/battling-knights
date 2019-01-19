/**
 * Item class for tracking state of items, items confer bonuses on the knights who equip them
 */
class Item {
  constructor({ name, attack = 0, defence = 0, startPosition } = {}) {
    Object.assign(this, {
      attack,
      defence,
      equipped: false,
      name,
      position: startPosition
    });
  }

  /**
   * Method to update item state as equipped
   */
  equip() {
    this.equipped = true;
  }

  /**
   * Method to update item state as unequipped and return it to the board
   * @param {object} position - object with x y properties to return item to
   */
  drop(position) {
    this.position = position;
    this.equipped = false;
  }

}

module.exports = Item;