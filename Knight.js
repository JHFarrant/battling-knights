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
   * @return {array} - returns an array containing the dead knight in position 0, and their item in position 1
   */
  die() {
    const { item = null } = this;
    if (item) this.dropItem();
    Object.assign(this, {
      baseAttack: 0,
      baseDefence: 0,
      status: 'DEAD'
    });
    return [this, item];
  }

  /**
   * Method to drop equipped item, returns item
   * @param {object} position - position to drop item to
   * @return {Item} the dropped item
   */
  dropItem(position = this.position) {
    const { item } = this;
    item.drop(position);
    this.item = null;
    return item;
  }

  /**
   * Method drowns knights, removing them from the game, returns item if equipped
   * @return {Item|null} 
   */
  drown() {
    Object.assign(this, {
      baseAttack: 0,
      baseDefence: 0,
      position: null,
      status: 'DROWNED'
    });
    if (this.item) return this.dropItem(this.locationHistory.slice(-1)[0]);
    else return null;
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
    item.equip(this);
    this.item = item;
  }

  /**
   * Fight method invokes the die method on the weaker knight
   * @param {Knight} enemy 
   * @return {array} - returns an array containing the losing (dead) knight and their item
   */
  fight(enemy) {
    const surpriseBonus = 0.5;
    const attackPower = this.attack + surpriseBonus;

    if (attackPower > enemy.defence) return enemy.die();
    else return this.die();
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
    let { position, locationHistory } = this;
    this.locationHistory = [...locationHistory, Object.assign({}, position)];
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