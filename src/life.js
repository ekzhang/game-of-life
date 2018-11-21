import { unzip, min, max, fill, times } from 'lodash'

const BASE = 67108864 // Math.pow(2, 26)

export function pair(x, y) {
  return x * BASE + y
}

export function unpair(pos) {
  const x = Math.round(pos / BASE)
  return [ x, pos - x * BASE ]
}

function* neighbors(pos) {
  const [ x, y ] = unpair(pos)
  yield pair(x - 1, y - 1)
  yield pair(x - 1, y    )
  yield pair(x - 1, y + 1)
  yield pair(x    , y - 1)
  yield pair(x    , y + 1)
  yield pair(x + 1, y - 1)
  yield pair(x + 1, y    )
  yield pair(x + 1, y + 1)
}

export function successor(cells) {
  const adjacent = new Map()
  for (const pos of cells) {
    for (const pos2 of neighbors(pos)) {
      adjacent.set(pos2, 1 + (adjacent.get(pos2) || 0))
    }
  }
  const next = new Set()
  for (const [ pos, cnt ] of adjacent) {
    if (cnt == 3 || (cnt == 2 && cells.has(pos)))
      next.add(pos)
  }
  return next
}

function toArray(cells) {
  const [ x, y ] = unzip(Array.from(cells).map(unpair))
  if (x.length === 0)
    return [[false]]
  const minX = min(x), maxX = max(x), minY = min(y), maxY = max(y)
  const ret = times(maxX - minX + 1, () => fill(new Array(maxY - minY + 1), false))
  for (let i = 0; i < x.length; i++)
    ret[x[i] - minX][y[i] - minY] = true
  return ret
}

function rle(row) {
  const ret = []
  let index = 0
  while (index != -1) {
    const next = row.indexOf(!row[index], index)
    const count = (next == -1 ? row.length : next) - index
    if (row[index] || next != -1)
      ret.push((count > 1 ? count : '') + (row[index] ? 'o' : 'b'))
    index = next
  }
  return ret.join('')
}

export function encode(cells) {
  const ar = toArray(cells)
  const lines = []
  let numLines = 0
  for (let i = 0; i < ar.length; i++) {
    const row = rle(ar[i])
    if (row) {
      if (numLines) {
        lines.push((numLines > 1 ? numLines : '') + '$')
        numLines = 0
      }
      lines.push(row)
    }
    numLines++
  }
  return lines.join('') + '!'
}

export function decode(rle) {
  const rleRe = /^\s*([0-9]*(o|b|\$)\s*)*!$/
  if (!rleRe.test(rle))
    throw new Error('Invalid RLE')
  const rows = rle.slice(0, -1).split('$')
  const cells = []
  let row = 0, numCols = 0
  for (let i = 0; i < rows.length; i++) {
    let index = 0, re = /([0-9]*)(o|b)|([0-9]+)/g
    let match
    while ((match = re.exec(rows[i])) !== null) {
      if (!match[2]) {
        row += parseInt(match[3]) - 1
        break
      }
      const num = parseInt(match[1] || 1)
      if (match[2] === 'o') {
        for (let col = index; col < index + num; col++)
          cells.push([row, col])
      }
      index += num
      numCols = Math.max(numCols, index)
    }
    row++
  }
  const dr = Math.floor(rows.length / 2), dc = Math.floor(numCols / 2)
  const ret = new Set()
  for (const [ r, c ] of cells)
    ret.add(pair(r - dr, c - dc))
  return ret
}
