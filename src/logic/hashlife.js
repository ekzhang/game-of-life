import { encode, decode } from './rle'

class TreeNode {
  constructor(nw, ne, sw, se) {
    if (!ne && !sw && !se) {
      this.pop = 0 + nw
      this.nw = this.ne = this.sw = this.se = null
      this.level = 0
    }
    else if (arguments.length === 4) {
      if (nw.level != ne.level || ne.level != sw.level || sw.level != se.level)
        throw new Error('QuadTree children must have equal levels')
      this.nw = nw, this.ne = ne, this.sw = sw, this.se = se
      this.pop = nw.pop + ne.pop + sw.pop + se.pop
      this.level = nw.level + 1
    }
    else
      throw new Error('Invalid number of constructor arguments: ' + arguments.length)

    this.result = null
    this.id = Math.random()
  }

  static hash(nw, ne, sw, se) {
    // Crappy hash function statistically, but hopefully it's good enough :/
    return 0.3870661942527105 * nw.id + 0.7760699850060107 * ne.id
      + 0.2888132005064035 * sw.id + 0.5184920551312162 * se.id
  }

  static create(nw, ne, sw, se) {
    const hsh = ne ? this.hash(nw, ne, sw, se) : 0 + nw
    if (this.pool.has(hsh))
      return this.pool.get(hsh)
    const obj = new this(nw, ne, sw, se)
    this.pool.set(hsh, obj)
    return obj
  }

  static emptyTree(level) {
    if (level === 0)
      return this.create(false)
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
    if (this.level === 0)
      return this.pop
    const val = 1 << (this.level - 2)
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
    if (this.level === 0)
      return this.constructor.create(c)
    const val = 1 << (this.level - 2)
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

  centeredVertical(south) {
    return this.constructor.create(this.sw.se, this.se.sw, south.nw.ne, south.ne.nw)
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
    const x00 = this.nw.nw.pop
    const x01 = this.nw.ne.pop + this.ne.nw.pop
    const x02 = this.ne.ne.pop
    const x10 = this.nw.sw.pop + this.sw.nw.pop
    const x11 = this.centeredSubnode().pop
    const x12 = this.ne.se.pop + this.se.ne.pop
    const x20 = this.sw.sw.pop
    const x21 = this.sw.se.pop + this.se.sw.pop
    const x22 = this.se.se.pop
    return this.constructor.create(
      this.constructor.create(this.applyRule(x00 + x01 + x10 + x11 - this.nw.se.pop, this.nw.se.pop)),
      this.constructor.create(this.applyRule(x01 + x02 + x11 + x12 - this.ne.sw.pop, this.ne.sw.pop)),
      this.constructor.create(this.applyRule(x10 + x11 + x20 + x21 - this.sw.ne.pop, this.sw.ne.pop)),
      this.constructor.create(this.applyRule(x11 + x12 + x21 + x22 - this.se.nw.pop, this.se.nw.pop))
    )
  }

  step() {
    if (this.result)
      return this.result
    if (this.level < 2)
      throw new Error('Step can only be computed for nodes of level >= 2')
    else if (this.level === 2) {
      this.result = this.slowSimulation()
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
      this.result = this.constructor.create(
        this.constructor.create(n00, n01, n10, n11).step(),
        this.constructor.create(n01, n02, n11, n12).step(),
        this.constructor.create(n10, n11, n20, n21).step(),
        this.constructor.create(n11, n12, n21, n22).step()
      )
    }
    return this.result
  }

  _cellList(ar, dx, dy, x1, x2, y1, y2) {
    if (this.pop === 0)
      return
    if (this.level === 0) {
      if (dx >= x1 && dx < x2 && dy >= y1 && dy < y2)
        ar.push([dx, dy])
    }
    else if (this.level === 1) {
      this.nw._cellList(ar, dx - 1, dy - 1, x1, x2, y1, y2)
      this.ne._cellList(ar, dx, dy - 1, x1, x2, y1, y2)
      this.sw._cellList(ar, dx - 1, dy, x1, x2, y1, y2)
      this.se._cellList(ar, dx, dy, x1, x2, y1, y2)
    }
    else {
      const val = 1 << (this.level - 2)
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
    while (Math.max(x, y) >= (1 << (this.root.level - 1))
      || Math.min(x, y) < -(1 << (this.root.level - 1))) {
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

  step() {
    while (this.root.level < 3 || this.root.centeredSubSubnode().pop !== this.root.pop)
      this.root = this.root.expand()
    this.root = this.root.step()
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
