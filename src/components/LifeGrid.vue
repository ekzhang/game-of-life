<template>
  <canvas class="grid"
    ref="canvas"
    v-hammer:tap="handleTap"
    v-hammer:panstart="handlePanStart"
    v-hammer:pan="handlePan"
  ></canvas>
</template>

<script>
import { unpair } from '../life'

export default {
  props: {
    cells: Set,
    size: Number
  },
  data() {
    return {
      width: null,
      height: null,
      row0: 0,
      col0: 0
    }
  },
  computed: {
    rows() {
      return Math.ceil(this.height / (this.size + 1))
    },
    cols() {
      return Math.ceil(this.width / (this.size + 1))
    },
    all() {
      return {
        cells: this.cells,
        row0: this.row0,
        col0: this.col0,
        size: this.size,
        width: this.width,
        height: this.height
      };
    }
  },
  methods: {
    handleTap(evt) {
      const r = this.row0 + Math.floor(evt.center.y / (this.size + 1))
      const c = this.col0 + Math.floor(evt.center.x / (this.size + 1))
      this.$emit('toggle', [r, c])
    },
    handlePanStart() {
      this.oldRow0 = this.row0
      this.oldCol0 = this.col0
    },
    handlePan(evt) {
      this.row0 = this.oldRow0 - Math.round(evt.deltaY / (this.size + 1))
      this.col0 = this.oldCol0 - Math.round(evt.deltaX / (this.size + 1))
    },
    handleResize() {
      this.width = this.$refs.canvas.width = document.body.clientWidth
      this.height = this.$refs.canvas.height = document.body.clientHeight
    },
    center() {
      this.row0 = Math.floor(-this.rows / 2)
      this.col0 = Math.floor(-this.cols / 2)
    }
  },
  watch: {
    all() {
      this.ctx.clearRect(0, 0, this.width, this.height)

      this.ctx.beginPath()
      for (let r = 0; r < this.rows; r++) {
        this.ctx.moveTo(0, (this.size + 1) * r + this.size + 0.5)
        this.ctx.lineTo(this.width, (this.size + 1) * r + this.size + 0.5)
      }
      for (let c = 0; c < this.cols; c++) {
        this.ctx.moveTo((this.size + 1) * c + this.size + 0.5, 0)
        this.ctx.lineTo((this.size + 1) * c + this.size + 0.5, this.height)
      }
      this.ctx.strokeStyle = '#D3D3D3'
      this.ctx.stroke()

      for (const cell of this.cells) {
        const [ r, c ] = unpair(cell)
        if (r >= this.row0 && r < this.row0 + this.rows
            && c >= this.col0 && c < this.col0 + this.cols) {
          this.ctx.fillRect(
            (this.size + 1) * (c - this.col0),
            (this.size + 1) * (r - this.row0),
            this.size,
            this.size)
        }
      }
    }
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext('2d')
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
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
