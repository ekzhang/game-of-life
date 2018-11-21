<template>
  <table class="grid">
    <tbody>
      <tr v-for="(row, i) in grid" :key="i">
        <td v-for="(alive, j) in row" :key="j">
          <div class="cell"
            :class="{ alive }"
            :style="{ width: size + 'px', height: size + 'px' }"
            @mousedown="$emit('toggle', (row0 + i) + ',' + (col0 + j))"
          ></div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { throttle } from 'lodash'

export default {
  props: {
    cells: Object,
    row0: Number,
    col0: Number,
    size: Number
  },
  data() {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }
  },
  computed: {
    rows() {
      return Math.ceil(this.height / (this.size + 1))
    },
    cols() {
      return Math.ceil(this.width / (this.size + 1))
    },
    grid() {
      const grid = []
      for (let i = 0; i < this.rows; i++) {
        const row = []
        for (let j = 0; j < this.cols; j++)
          row.push(Boolean(this.cells[(this.row0 + i) + ',' + (this.col0 + j)]))
        grid.push(row)
      }
      return grid
    }
  },
  methods: {
    handleResize: throttle(function() {
      this.width = document.body.clientWidth
      this.height = document.body.clientHeight
    }, 500)
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
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
  border-spacing: 1px;
  border-collapse: separate;
  background: lightgray;
}

.grid td {
  padding: 0;
}

.cell {
  background: white;
}

.cell.alive {
  background: black;
}
</style>
