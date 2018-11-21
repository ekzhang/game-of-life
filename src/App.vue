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
        <select v-model="preset">
          <option value="">--Pattern presets--</option>
          <optgroup label="Guns and Rakes">
            <option value="24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!">Gosper Glider Gun</option>
            <option value="18b2o$19bo$19bobo14b2o$20b2o12b2o2bo$24b3o7b2ob2o$24b2ob2o7b3o$24bo2b2o12b2o$25b2o14bobo$43bo$43b2o$$2o$bo$bobo13b3o$2b2o3bo8bo3bo$6bob2o6bo4bo$5bo4bo6b2obo$6bo3bo8bo3b2o$7b3o13bobo$25bo$25b2o!">Period-22 Gun</option>
            <option value="11b2o5b4o$9b2ob2o3bo3bo$9b4o8bo$10b2o5bo2bo2$8bo$7b2o8b2o$6bo9bo2bo$7b5o4bo2bo$8b4o3b2ob2o$11bo4b2o4$18b4o$o2bo13bo3bo$4bo16bo$o3bo12bo2bo$b4o!">Space Rake</option>
          </optgroup>
          <optgroup label="Spaceships">
            <option value="9bo7bo$3b2obobob2o3b2obobob2o$3obob3o9b3obob3o$o3bobo5bobo5bobo3bo$4b2o6bobo6b2o$b2o9bobo9b2o$b2ob2o15b2ob2o$5bo15bo!">Spider</option>
            <option value="b2o2b2o$3b2o$3b2o$obo2bobo$o6bo2$o6bo$b2o2b2o$2b4o2$3b2o$3b2o!">Copperhead</option>
            <option value="12bo$12b2o14bo$10bob2o5bobo4b2o$5bo3bo3b3o2bo4bo$2o3bo2bo6bobo5b3o2bo$2o3bob2o6bo3bobobo$2o3bo10bobo7b2o$5b2o14bo6bo$7bo12bobo$7bo12bobo$5b2o14bo6bo$2o3bo10bobo7b2o$2o3bob2o6bo3bobobo$2o3bo2bo6bobo5b3o2bo$5bo3bo3b3o2bo4bo$10bob2o5bobo4b2o$12b2o14bo$12bo!">Dragon</option>
            <option value="4b2o$4bo2bo$4bo3bo$6b3o$2b2o6b4o$2bob2o4b4o$bo4bo6b3o$2b4o4b2o3bo$o9b2o$bo3bo$6b3o2b2o2bo$2b2o7bo4bo$13bob2o$10b2o6bo$11b2ob3obo$10b2o3bo2bo$10bobo2b2o$10bo2bobobo$10b3o6bo$11bobobo3bo$14b2obobo$11bo6b3o$$11bo9bo$11bo3bo6bo$12bo5b5o$12b3o$16b2o$13b3o2bo$11bob3obo$10bo3bo2bo$11bo4b2ob3o$13b4obo4b2o$13bob4o4b2o$19bo$20bo2b2o$20b2o$21b5o$25b2o$19b3o6bo$20bobo3bobo$19bo3bo3bo$19bo3b2o$18bo6bob3o$19b2o3bo3b2o$20b4o2bo2bo$22b2o3bo$21bo$21b2obo$20bo$19b5o$19bo4bo$18b3ob3o$18bob5o$18bo$20bo$16bo4b4o$20b4ob2o$17b3o4bo$24bobo$28bo$24bo2b2o$25b3o$22b2o$21b3o5bo$24b2o2bobo$21bo2b3obobo$22b2obo2bo$24bobo2b2o$26b2o$22b3o4bo$22b3o4bo$23b2o3b3o$24b2ob2o$25b2o$25bo$$24b2o$26bo!">Sir Robin</option>
          </optgroup>
          <optgroup label="Oscillators">
            <option value="2b3o3b3o$$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o$$2b3o3b3o$o4bobo4bo$o4bobo4bo$o4bobo4bo$$2b3o3b3o!">Pulsar</option>
            <option value="10o!">Pentadecathlon</option>
            <option value="11b2o11b2o$11b2o11b2o$$$6bo23bo$5bobo5bo9bo5bobo$4bo2bo5bob2o3b2obo5bo2bo$5b2o10bobo10b2o$15bobobobo$16bo3bo$$2o33b2o$2o33b2o$5b2o23b2o$$6bobo19bobo$6bo2bo17bo2bo$7b2o19b2o$$7b2o19b2o$6bo2bo17bo2bo$6bobo19bobo$$5b2o23b2o$2o33b2o$2o33b2o$$16bo3bo$15bobobobo$5b2o10bobo10b2o$4bo2bo5bob2o3b2obo5bo2bo$5bobo5bo9bo5bobo$6bo23bo$$$11b2o11b2o$11b2o11b2o!">124P37</option>
          </optgroup>
          <optgroup label="Methuselahs">
            <option value="b2o$2ob$bo!">R-pentomino</option>
            <option value="bo5b$3bo3b$2o2b3o!">Acorn</option>
            <option value="obobobobo3b2o$2bo3bo2bo3b3o$2bobo3bo5b2o$o3bo2b6ob2o$3ob2obobobo$6bo2bobob3o$2ob2o2bo2bob4o$o2bob2ob3o4bo$o4bob3o5bo$bobo2bob2ob2ob2o$3b3obob2ob4o$obob4o3b3o$obo3b2ob2obobo$ob2ob3obob2o2bo$o3b3o2b2obo2bo$3ob2o2b2ob2obo!">42100M</option>
          </optgroup>
        </select>
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
      preset: '',
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
      if (rle) {
        this.cells = decode(rle)
        this.generation = 0
        this.row0 = -Math.floor(document.body.clientHeight / (this.size + 1) / 2)
        this.col0 = -Math.floor(document.body.clientWidth / (this.size + 1) / 2)
      }
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
    },
    preset(val) {
      this.load(val)
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

.controls button, .controls select {
  margin: 3px;
}

.controls label {
  margin-right: 8px;
}
</style>
