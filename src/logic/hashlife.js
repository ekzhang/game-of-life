import { encode, decode } from './rle'

class TreeNode {
  constructor(nw, ne, sw, se) {
    this.nw = nw, this.ne = ne, this.sw = sw, this.se = se
    if (typeof nw !== 'object') {
      this.pop = nw + ne + sw + se
      this.level = 1
    }
    else {
      this.pop = nw.pop + ne.pop + sw.pop + se.pop
      this.level = nw.level + 1
    }
    this.result = {}
    this.id = Math.random()
  }

  static hash(nw, ne, sw, se) {
    // Crappy hash function statistically, but hopefully it's good enough :/
    return 0.3870661942527105 * (nw.id || nw) + 0.7760699850060107 * (ne.id || ne)
      + 0.2888132005064035 * (sw.id || sw) + 0.5184920551312162 * (se.id || se)
  }

  static create(nw, ne, sw, se) {
    const hsh = this.hash(nw, ne, sw, se)
    if (this.pool.has(hsh))
      return this.pool.get(hsh)
    const obj = new this(nw, ne, sw, se)
    this.pool.set(hsh, obj)
    return obj
  }

  static emptyTree(level) {
    if (level === 1)
      return this.create(false, false, false, false)
    const n = this.emptyTree(level - 1)
    return this.create(n, n, n, n)
  }

  expand() {
    const e = this.constructor.emptyTree(this.level - 1)
    return this.constructor.create(
      this.constructor.create(e, e, e, this.nw),
      this.constructor.create(e, e, this.ne, e),
      this.constructor.create(e, this.sw, e, e),
      this.constructor.create(this.se, e, e, e)
    )
  }

  getBit(x, y) {
    if (this.level === 1)
      return x < 0 ? (y < 0 ? this.nw : this.sw) : (y < 0 ? this.ne : this.se)
    const val = Math.pow(2, this.level - 2)
    if (x < 0) {
      if (y < 0)
        return this.nw.getBit(x + val, y + val)
      else
        return this.sw.getBit(x + val, y - val)
    }
    else {
      if (y < 0)
        return this.ne.getBit(x - val, y + val)
      else
        return this.se.getBit(x - val, y - val)
    }
  }

  setBit(x, y, c) {
    if (this.level === 1) {
      if (x < 0) {
        if (y < 0)
          return this.constructor.create(c, this.ne, this.sw, this.se)
        else
          return this.constructor.create(this.nw, this.ne, c, this.se)
      }
      else {
        if (y < 0)
          return this.constructor.create(this.nw, c, this.sw, this.se)
        else
          return this.constructor.create(this.nw, this.ne, this.sw, c)
      }
    }
    const val = Math.pow(2, this.level - 2)
    if (x < 0) {
      if (y < 0)
        return this.constructor.create(this.nw.setBit(x + val, y + val, c), this.ne, this.sw, this.se)
      else
        return this.constructor.create(this.nw, this.ne, this.sw.setBit(x + val, y - val, c), this.se)
    }
    else {
      if (y < 0)
        return this.constructor.create(this.nw, this.ne.setBit(x - val, y + val, c), this.sw, this.se)
      else
        return this.constructor.create(this.nw, this.ne, this.sw, this.se.setBit(x - val, y - val, c))
    }
  }

  centeredSubnode() {
    return this.constructor.create(this.nw.se, this.ne.sw, this.sw.ne, this.se.nw)
  }

  vertical(south) {
    return this.constructor.create(this.sw, this.se, south.nw, south.ne)
  }

  centeredVertical(south) {
    return this.constructor.create(this.sw.se, this.se.sw, south.nw.ne, south.ne.nw)
  }

  horizontal(east) {
    return this.constructor.create(this.ne, east.nw, this.se, east.sw)
  }

  centeredHorizontal(east) {
    return this.constructor.create(this.ne.se, east.nw.sw, this.se.ne, east.sw.nw)
  }

  centeredSubSubnode() {
    return this.constructor.create(this.nw.se.se, this.ne.sw.sw, this.sw.ne.ne, this.se.nw.nw)
  }

  applyRule(neighbors, current) {
    return neighbors === 3 || (neighbors === 2 && current)
  }

  slowSimulation() {
    if (this.level !== 2)
      throw new Error('Base case can only be called for level 2 nodes')
    const x00 = this.nw.nw
    const x01 = this.nw.ne + this.ne.nw
    const x02 = this.ne.ne
    const x10 = this.nw.sw + this.sw.nw
    const x11 = this.centeredSubnode().pop
    const x12 = this.ne.se + this.se.ne
    const x20 = this.sw.sw
    const x21 = this.sw.se + this.se.sw
    const x22 = this.se.se
    return this.constructor.create(
      this.applyRule(x00 + x01 + x10 + x11 - this.nw.se, this.nw.se),
      this.applyRule(x01 + x02 + x11 + x12 - this.ne.sw, this.ne.sw),
      this.applyRule(x10 + x11 + x20 + x21 - this.sw.ne, this.sw.ne),
      this.applyRule(x11 + x12 + x21 + x22 - this.se.nw, this.se.nw)
    )
  }

  step(k) {
    if (this.result[k])
      return this.result[k]
    if (this.level < 2)
      throw new Error('Step can only be computed for nodes of level >= 2')
    if (k > this.level - 2)
      throw new Error('Step size greater than level - 2')

    if (this.level === 2) {
      this.result[k] = this.slowSimulation()
    }
    else if (this.level === k + 2) {
      const n00 = this.nw.step(k - 1)
      const n01 = this.nw.horizontal(this.ne).step(k - 1)
      const n02 = this.ne.step(k - 1)
      const n10 = this.nw.vertical(this.sw).step(k - 1)
      const n11 = this.centeredSubnode().step(k - 1)
      const n12 = this.ne.vertical(this.se).step(k - 1)
      const n20 = this.sw.step(k - 1)
      const n21 = this.sw.horizontal(this.se).step(k - 1)
      const n22 = this.se.step(k - 1)
      this.result[k] = this.constructor.create(
        this.constructor.create(n00, n01, n10, n11).step(k - 1),
        this.constructor.create(n01, n02, n11, n12).step(k - 1),
        this.constructor.create(n10, n11, n20, n21).step(k - 1),
        this.constructor.create(n11, n12, n21, n22).step(k - 1)
      )
    }
    else {
      const n00 = this.nw.centeredSubnode()
      const n01 = this.nw.centeredHorizontal(this.ne)
      const n02 = this.ne.centeredSubnode()
      const n10 = this.nw.centeredVertical(this.sw)
      const n11 = this.centeredSubSubnode()
      const n12 = this.ne.centeredVertical(this.se)
      const n20 = this.sw.centeredSubnode()
      const n21 = this.sw.centeredHorizontal(this.se)
      const n22 = this.se.centeredSubnode()
      this.result[k] = this.constructor.create(
        this.constructor.create(n00, n01, n10, n11).step(k),
        this.constructor.create(n01, n02, n11, n12).step(k),
        this.constructor.create(n10, n11, n20, n21).step(k),
        this.constructor.create(n11, n12, n21, n22).step(k)
      )
    }
    return this.result[k]
  }

  _cellList(ar, dx, dy, x1, x2, y1, y2) {
    if (this.pop === 0)
      return
    if (this.level === 1) {
      if (this.nw && dx - 1 >= x1 && dx - 1 < x2 && dy - 1 >= y1 && dy - 1 < y2)
        ar.push([dx - 1, dy - 1])
      if (this.ne && dx >= x1 && dx < x2 && dy - 1 >= y1 && dy - 1 < y2)
        ar.push([dx, dy - 1])
      if (this.sw && dx - 1 >= x1 && dx - 1 < x2 && dy >= y1 && dy < y2)
        ar.push([dx - 1, dy])
      if (this.se && dx >= x1 && dx < x2 && dy >= y1 && dy < y2)
        ar.push([dx, dy])
    }
    else {
      const val = Math.pow(2, this.level - 2)
      if (x1 < dx && y1 < dy)
        this.nw._cellList(ar, dx - val, dy - val, x1, x2, y1, y2)
      if (x2 > dx && y1 < dy)
        this.ne._cellList(ar, dx + val, dy - val, x1, x2, y1, y2)
      if (x1 < dx && y2 > dy)
        this.sw._cellList(ar, dx - val, dy + val, x1, x2, y1, y2)
      if (x2 > dx && y2 > dy)
        this.se._cellList(ar, dx + val, dy + val, x1, x2, y1, y2)
    }
  }
}

TreeNode.pool = new Map()

export class LifeUniverse {
  constructor() {
    this.root = TreeNode.emptyTree(3)
  }

  expandTo(x, y) {
    while (Math.max(x, y) >= Math.pow(2, this.root.level - 1)
      || Math.min(x, y) < -Math.pow(2, this.root.level - 1)) {
      this.root = this.root.expand()
    }
  }

  get(x, y) {
    this.expandTo(x, y)
    return this.root.getBit(x, y)
  }

  set(x, y, c) {
    this.expandTo(x, y)
    this.root = this.root.setBit(x, y, c)
  }

  toggle(x, y) {
    const cur = this.get(x, y)
    this.root = this.root.setBit(x, y, 1 - cur)
  }

  step(k) {
    k = k || 0
    while (this.root.level < 2 + k || this.root.centeredSubSubnode().pop !== this.root.pop)
      this.root = this.root.expand()
    this.root = this.root.step(k)
  }

  get population() {
    return this.root.pop
  }

  cellList(x1, x2, y1, y2) {
    if (x1 === undefined)
      x1 = -Infinity
    if (x2 === undefined)
      x2 = Infinity
    if (y1 === undefined)
      y1 = -Infinity
    if (y2 === undefined)
      y2 = Infinity
    const ar = []
    this.root._cellList(ar, 0, 0, x1, x2, y1, y2)
    return ar
  }

  toRLE() {
    return encode(this.cellList())
  }

  static fromRLE(rle) {
    const universe = new this()
    const cells = decode(rle)
    for (const [ x, y ] of cells) {
      universe.set(x, y, 1)
    }
    return universe
  }
}
