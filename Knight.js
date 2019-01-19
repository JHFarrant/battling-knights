/**
 * Knight class, tracks state and invokes methods for individual knights on their turns
 */
class Knight {
  constructor({ name, startPosition } = {}) {
    Object.assign(this, {
      baseAttack: 1.0,
      baseDefence: 1.0,
      item: null,
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
   * Getter returns current actual defence score based on baseDefence and item modifier
   */
  get defence() {
    const { baseDefence, item } = this;
    const defenceModifier = item ? item.defence : 0;
    return baseDefence + defenceModifier;
  }

  /**
   * Method to update knights positon based on passed direction.
   * @param {string} direction - N | E | S | W
   */
  move(direction) {
    let { position: { x, y } } = this;
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