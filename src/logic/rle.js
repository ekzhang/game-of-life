export const RLE_RE = /^\s*([0-9]*(o|b|\$)\s*)*!$/

function toArray(cells) {
  if (cells.length === 0)
    return [[false]]
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const [ x, y ] of cells) {
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  const ret = []
  for (let i = 0; i < maxY - minY + 1; i++)
    ret.push(new Array(maxX - minX + 1).fill(false))
  for (const [ x, y ] of cells)
    ret[y - minY][x - minX] = true
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
  if (!RLE_RE.test(rle))
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
          cells.push([col, row])
      }
      index += num
      numCols = Math.max(numCols, index)
    }
    row++
  }
  const dy = Math.floor(row / 2), dx = Math.floor(numCols / 2)
  const ret = []
  for (const [ x, y ] of cells)
    ret.push([x - dx, y - dy])
  return ret
}
