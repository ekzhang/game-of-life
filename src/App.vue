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
        <button @click="save">Save</button>
        <button @click="loadPrompt">Load</button>
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
import { successor, encode, decode } from './life.js'
import { sum } from 'lodash'

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
      return Number(sum(Object.values(this.cells)))
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
    },
    save() {
      prompt('Current pattern in RLE format:', encode(this.cells))
    },
    load(rle) {
      this.cells = decode(rle)
      this.generation = 0
      this.row0 = -Math.floor(document.body.clientHeight / (this.size + 1) / 2)
      this.col0 = -Math.floor(document.body.clientWidth / (this.size + 1) / 2)
    },
    loadPrompt() {
      const rle = prompt('Enter pattern RLE:')
      try {
        this.load(rle)
      }
      catch (e) {
        alert('Invalid RLE format, please check your input')
      }
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
