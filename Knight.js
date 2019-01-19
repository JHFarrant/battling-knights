/**
 * Knight class, tracks state and invokes methods for individual knights on their turns
 */
class Knight {
  constructor({ name, startPosition }) {
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
}

module.exports = Knight;