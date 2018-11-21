<template>
  <div id="app"
    tabindex="1"
    @keydown.up="row0--"
    @keydown.down="row0++"
    @keydown.left="col0--"
    @keydown.right="col0++"
  >
    <header>
      <h1>Conway's Game of Life</h1>
    </header>

    <LifeGrid
      :cells="cells"
      @toggle="toggle"
      :row0="row0"
      :col0="col0"
    />

    <footer>
      <div class="controls">
        <button @click="resume">Start/Stop</button>
        <button @click="step">Step</button>
        <button @click="clear">Clear</button>
      </div>
    </footer>
  </div>
</template>

<script>
import LifeGrid from './components/LifeGrid.vue'
import * as _ from 'lodash'

function* neighbors(coords) {
  const [ x, y ] = _.map(coords.split(','), s => parseInt(s))
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i != x || j != y)
        yield i + ',' + j
    }
  }
}

function successor(cells) {
  const next = {}
  for (const pos in cells) {
    if (cells[pos]) {
      for (const pos2 of neighbors(pos)) {
        next[pos2] = 1 + (next[pos2] || 0)
      }
    }
  }
  for (const pos in next) {
    const num = next[pos]
    if (num < 2 || num > 3 || (num == 2 && !cells[pos]))
      delete next[pos]
    else
      next[pos] = true
  }
  return next
}

export default {
  name: 'app',
  data() {
    return {
      cells: {},
      row0: 0,
      col0: 0,
      timerID: 0,
    }
  },
  methods: {
    toggle(cell) {
      this.$set(this.cells, cell, !this.cells[cell])
    },
    step() {
      this.cells = successor(this.cells)
    },
    clear() {
      this.cells = {}
    },
    resume() {
      if (this.timerID) {
        clearInterval(this.timerID)
        this.timerID = null
      }
      else
        this.timerID = setInterval(this.step, 100)
    }
  },
  components: {
    LifeGrid
  }
}
</script>

<style>
#app {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

header {
  margin: 20px;
  background: rgba(255, 255, 255, 0.6);
  z-index: 1;
}

header > h1 {
  margin: 0;
}

footer {
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid black;
  padding: 10px;
  background: rgba(211, 211, 211, 0.6);
  z-index: 1;
}
</style>
