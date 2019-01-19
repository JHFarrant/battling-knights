const Item = require('./Item');

/**
 * Knight class, tracks state and invokes methods for individual knights on their turns
 */
class Knight {
  constructor({ name, startPosition } = {}) {
    Object.assign(this, {
      baseAttack: 1.0,
      baseDefence: 1.0,
      item: null,
      locationHistory: [],
      name,
      position: startPosition,
      status: 'ALIVE'
    });
  }

  /**
   * Getter returns current actual attack score based on baseAttack and item modifier
   */
  get attack() {
    const { baseAttack, item } = this;
    const attackModifier = item ? item.attack : 0;
    return baseAttack + attackModifier;
  }

  /**
   * Drops the knights item if equipped and updates Knight status to DEAD
   */
  die() {
    if (this.item) this.dropItem();
    this.status = 'DEAD';
  }

  /**
   * Method to drop equipped item
   * @param {object} position - position to drop item to
   */
  dropItem(position = this.position) {
    const { item } = this;
    item.drop(position);
    this.item = null;
  }

  /**
   * Method drowns knights, removing them from the game
   */
  drown() {
    if (this.item) this.dropItem(this.locationHistory.slice(-1));
    this.status = 'DROWNED';
    this.position = null;
  }
  
  /**
   * Getter returns current actual defence score based on baseDefence and item modifier
   */
  get defence() {
    const { baseDefence, item } = this;
    const defenceModifier = item ? item.defence : 0;
    return baseDefence + defenceModifier;
  }

  /**
   * Method equips the passed item to the knights inventory
   * @param {Item} item 
   */
  equipItem(item) {
    item.equip();
    this.item = item;
  }

  /**
   * Method for finding enemy knights in the knight's space
   * @param {array} space 
   */
  findEnemy(space) {
    const [enemy = null] = space.filter(el => el instanceof Knight && el !== this);
    return enemy;
  }

  /**
   * Method for finding free items in the knight's space
   * @param {array} space
   */
  findItem(space) {
    const items = space.filter(el => el instanceof Item);
    return items;
  }

  /**
   * Method to update knights positon based on passed direction. Also updates location history.
   * @param {string} direction - N | E | S | W
   */
  move(direction) {
    let { position } = this;
    this.locationHistory.push(position);
    let { x, y } = position;
    switch (direction) {
      case 'N':
        x--;
        break;
      case 'E':
        y++;
        break;
      case 'S':
        x++;
        break;
      case 'W':
        y--;
        break;
    }
    Object.assign(this.position, { x, y });
  }

  /**
   * Static method for selecting prefered item from available items. Prefers attack over defence
   * @param {array} - array of items
   * @return {Item} - best available item
   */
  static selectItem(items) {
    const [bestItem] = items.sort((itemA, itemB) => {
      const attackValue = itemB.attack - itemA.attack;
      if (attackValue) return attackValue;
      else {
        const defenceValue = itemB.defence - itemA.defence;
        return defenceValue;
      }
    });
    return bestItem;
  }

}

module.exports = Knight;