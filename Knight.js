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
   * Method to drop equipped item
   * @param {object} position - position to drop item to
   */
  dropItem(position = this.position) {
    const { item } = this;
    Object.assign(item, {
      position,
      equipped: false
    });
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
    this.item = item;
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
}

module.exports = Knight;