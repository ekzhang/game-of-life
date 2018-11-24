<template>
  <canvas class="grid"
    ref="canvas"
    v-hammer:tap="handleTap"
    v-hammer:panstart="handlePanStart"
    v-hammer:pan="handlePan"
  ></canvas>
</template>

<script>
const MIN_BORDER_PX = 4

export default {
  props: {
    size: Number
  },
  data() {
    return {
      width: null,
      height: null,
      rowx: 0,
      colx: 0
    }
  },
  computed: {
    rows() {
      return Math.ceil(this.height / this.offset) + 1
    },
    cols() {
      return Math.ceil(this.width / this.offset) + 1
    },
    row0() {
      return Math.floor(this.rowx)
    },
    col0() {
      return Math.floor(this.colx)
    },
    rowOffset() {
      return Math.round(this.offset * (this.rowx - this.row0))
    },
    colOffset() {
      return Math.round(this.offset * (this.colx - this.col0))
    },
    offset() {
      if (this.size >= MIN_BORDER_PX)
        return this.size + 1
      return this.size
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
      const x = Math.floor(this.colx + evt.center.x / this.offset)
      const y = Math.floor(this.rowx + evt.center.y / this.offset)
      this.$emit('toggle', [x, y])
    },
    handlePanStart() {
      this.oldRowx = this.rowx
      this.oldColx = this.colx
    },
    handlePan(evt) {
      this.rowx = this.oldRowx - evt.deltaY / this.offset
      this.colx = this.oldColx - evt.deltaX / this.offset
    },
    handleResize() {
      this.width = this.$refs.canvas.width = document.body.clientWidth
      this.height = this.$refs.canvas.height = document.body.clientHeight
    },
    center() {
      this.rowx = -this.height / this.offset / 2
      this.colx = -this.width / this.offset / 2
    },
    setUniverse(universe) {
      this.universe = universe
      this.redraw()
    },
    drawGrid() {
      this.ctx.beginPath()
      for (let r = 0; r < this.rows; r++) {
        const y = this.offset * r - this.rowOffset + this.size + 0.5
        this.ctx.moveTo(0, y)
        this.ctx.lineTo(this.width, y)
      }
      for (let c = 0; c < this.cols; c++) {
        const x = this.offset * c - this.colOffset + this.size + 0.5
        this.ctx.moveTo(x, 0)
        this.ctx.lineTo(x, this.height)
      }
      this.ctx.strokeStyle = '#D3D3D3'
      this.ctx.stroke()
    },
    drawCells() {
      if (this.universe) {
        const x1 = this.col0, x2 = this.col0 + this.cols
        const y1 = this.row0, y2 = this.row0 + this.rows
        for (const [ c, r ] of this.universe.cellList(x1, x2, y1, y2)) {
          this.ctx.fillRect(
            this.offset * (c - this.col0) - this.colOffset,
            this.offset * (r - this.row0) - this.rowOffset,
            this.size,
            this.size)
        }
      }
    },
    redraw() {
      this.ctx.clearRect(0, 0, this.width, this.height)
      if (this.size >= MIN_BORDER_PX) {
        this.drawGrid()
      }
      this.drawCells()
    }
  },
  watch: {
    offset(newOffset, oldOffset) {
      this.rowx += this.height / 2 * (1 / oldOffset - 1 / newOffset)
      this.colx += this.width / 2 * (1 / oldOffset - 1 / newOffset)
    },
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
