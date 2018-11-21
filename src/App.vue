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
      :size="size"
    />

    <footer>
      <span class="controls">
        Generation {{generation}}
      </span>
      <span class="controls">
        Live Cells: {{liveCount}}
      </span>
      <span class="controls">
        <button @click="resume">{{ timerID ? 'Stop' : 'Start' }}</button>
        <button @click="step">Step</button>
        <button @click="clear">Clear</button>
      </span>
      <span class="controls">
        <label for="size-input">Size</label>
        <input id="size-input" type="range" v-model.number="size" min="10" max="30">
      </span>
      <span class="controls">
        <label for="size-input">Speed</label>
        <input id="size-input" type="range" v-model.number="speed" min="1" max="30">
      </span>
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
      size: 15,
      speed: 2,
      generation: 0,
      timerID: null
    }
  },
  computed: {
    liveCount() {
      return Number(_.sum(Object.values(this.cells)))
    }
  },
  methods: {
    toggle(cell) {
      this.$set(this.cells, cell, !this.cells[cell])
    },
    step() {
      this.generation++
      this.cells = successor(this.cells)
    },
    clear() {
      this.cells = {}
      this.generation = 0
    },
    resume() {
      if (this.timerID) {
        clearInterval(this.timerID)
        this.timerID = null
      }
      else
        this.timerID = setInterval(this.step, 1000 / this.speed)
    }
  },
  watch: {
    speed(val) {
      if (this.timerID) {
        clearInterval(this.timerID)
        this.timerID = setInterval(this.step, 1000 / val)
      }
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
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid black;
  padding: 10px;
  background: rgba(211, 211, 211, 0.6);
  z-index: 1;
}

.controls {
  display: flex;
  align-items: center;
}

.controls button {
  margin: 3px;
}

.controls label {
  margin-right: 8px;
}
</style>
