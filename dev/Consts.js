class Consts {
  constructor() {
    this.map = {};
  }

  set(key, value) {
    this.map[key] = value;
  }

  get(key) {
    return this.map[key];
  }

  getAll() {
    return this.map;
  }
}

export default new Consts();
