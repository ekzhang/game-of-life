<template>
  <canvas class="grid"
    ref="canvas"
    v-hammer:tap="handleTap"
    v-hammer:panstart="handlePanStart"
    v-hammer:pan="handlePan"
  ></canvas>
</template>

<script>
const MIN_BORDER_PX = 8
const COLOR = 0xFF000000

export default {
  data() {
    return {
      width: null,
      height: null,
      rowx: 0,
      colx: 0,
      size: 16
    }
  },
  computed: {
    rows() {
      return Math.ceil(this.height / this.size) + 1
    },
    cols() {
      return Math.ceil(this.width / this.size) + 1
    },
    row0() {
      return Math.floor(this.rowx)
    },
    col0() {
      return Math.floor(this.colx)
    },
    cellWidth() {
      if (this.size >= MIN_BORDER_PX)
        return this.size - 1
      return Math.max(1, this.size)
    },
    rowOffset() {
      return Math.round(this.size * (this.rowx - this.row0))
    },
    colOffset() {
      return Math.round(this.size * (this.colx - this.col0))
    },
    all() {
      return {
        rowx: this.rowx,
        colx: this.colx,
        size: this.size,
        width: this.width,
        height: this.height
      };
    }
  },
  methods: {
    handleTap(evt) {
      const x = Math.floor(this.colx + evt.center.x / this.size)
      const y = Math.floor(this.rowx + evt.center.y / this.size)
      this.$emit('toggle', [x, y])
    },
    handlePanStart() {
      this.oldRowx = this.rowx
      this.oldColx = this.colx
    },
    handlePan(evt) {
      this.rowx = this.oldRowx - evt.deltaY / this.size
      this.colx = this.oldColx - evt.deltaX / this.size
    },
    handleResize() {
      this.width = this.$refs.canvas.width = document.body.clientWidth
      this.height = this.$refs.canvas.height = document.body.clientHeight
    },
    center() {
      this.rowx = -this.height / this.size / 2
      this.colx = -this.width / this.size / 2
    },
    zoom(k, dx, dy) {
      const cx = this.colx + dx / this.size
      const cy = this.rowx + dy / this.size
      this.size *= Math.pow(2, k)
      this.colx = cx - dx / this.size
      this.rowx = cy - dy / this.size
    },
    setUniverse(universe) {
      this.universe = universe
      this.redraw()
    },
    drawGrid() {
      this.ctx.beginPath()
      for (let r = 0; r < this.rows; r++) {
        const y = this.size * r - this.rowOffset + this.cellWidth + 0.5
        this.ctx.moveTo(0, y)
        this.ctx.lineTo(this.width, y)
      }
      for (let c = 0; c < this.cols; c++) {
        const x = this.size * c - this.colOffset + this.cellWidth + 0.5
        this.ctx.moveTo(x, 0)
        this.ctx.lineTo(x, this.height)
      }
      this.ctx.strokeStyle = '#D3D3D3'
      this.ctx.stroke()
    },
    fillSquare(data, xx, yy, cellWidth) {
      let width = cellWidth
      let height = cellWidth
      if (xx < 0) {
        width += xx
        xx = 0
      }
      if (xx + width > this.width) {
        width = this.width - xx
      }
      if (yy < 0) {
        height += yy
        yy = 0
      }
      if (yy + height > this.height) {
        height = this.height - yy
      }
      let pos = yy * this.width + xx
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          data[pos++] = COLOR
        }
        pos += this.width - width
      }
    },
    drawNode(data, node, size, dx, dy) {
      if (!node || node.pop === 0 || dx + size <= 0 || dy + size <= 0
          || dx >= this.width || dy >= this.height)
        return
      if (size <= 1) {
        data[dy * this.width + dx] = COLOR
      }
      else if (node === true) {
        this.fillSquare(data, dx, dy, this.cellWidth)
      }
      else {
        size /= 2
        this.drawNode(data, node.nw, size, dx, dy)
        this.drawNode(data, node.ne, size, dx + size, dy)
        this.drawNode(data, node.sw, size, dx, dy + size)
        this.drawNode(data, node.se, size, dx + size, dy + size)
      }
    },
    drawCells() {
      if (this.universe) {
        const imageData = this.ctx.createImageData(this.width, this.height)
        const data = new Int32Array(imageData.data.buffer)
        const dim = Math.pow(2, this.universe.root.level)
        this.drawNode(data, this.universe.root,
          this.size * dim,
          Math.round((-this.col0 - dim / 2) * this.size) - this.colOffset,
          Math.round((-this.row0 - dim / 2) * this.size) - this.rowOffset)
        this.ctx.putImageData(imageData, 0, 0)
      }
    },
    redraw() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.drawCells()
      if (this.size >= MIN_BORDER_PX) {
        this.drawGrid()
      }
    }
  },
  watch: {
    all() {
      this.redraw()
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d')
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.center()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
.grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
}
</style>
