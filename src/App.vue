<template>
  <div id="app" tabindex="1" @keydown="handleKeydown">
    <header>
      <span>
        Generation {{ generation
        }}{{ generationTime !== null ? ` (${generationTime}ms)` : '' }}
      </span>
      <span>Pop: {{ liveCount }}</span>
      <span>Step: {{ pow2(stepSize) }}</span>
      <span>
        {{ -zoom > 0 ? pow2(-zoom) : 1 }} :
        {{ zoom > 0 ? pow2(zoom) : 1 }}
      </span>
    </header>

    <LifeGrid ref="lifeGrid" @toggle="toggle" />

    <footer>
      <span class="controls">
        <button @click="resume">{{ timerID ? 'Stop' : 'Start' }}</button>
        <button @click="step">Step</button>
        <button @click="clear">Clear</button>
      </span>
      <span class="controls">
        <button @click="save">Save</button>
        <button @click="loadPrompt">Load</button>
        <select v-model="preset">
          <option value>--Select a pattern--</option>
          <optgroup
            v-for="(group, label) in examples"
            :key="label"
            :label="label"
          >
            <option
              v-for="(rle, name) in group"
              :key="name"
              v-text="name"
              :value="rle"
            ></option>
          </optgroup>
        </select>
      </span>
      <span class="controls">
        <label for="speed-input">Speed</label>
        <input
          id="speed-input"
          type="range"
          v-model.number="speed"
          min="1"
          max="100"
        />
      </span>
      <span class="controls">
        <button :disabled="zoom <= -32" @click="handleZoom(-1)">-</button>
        <span style="margin: 0 8px">Zoom</span>
        <button :disabled="zoom >= 8" @click="handleZoom(+1)">+</button>
      </span>
      <span class="controls">
        <button :disabled="stepSize <= 0" @click="stepSize--">-</button>
        <span style="margin: 0 8px">Step Size</span>
        <button :disabled="stepSize >= 32" @click="stepSize++">+</button>
      </span>
    </footer>
  </div>
</template>

<script>
import LifeGrid from './components/LifeGrid.vue'
import { RLE_RE } from './logic/rle'
import { LifeUniverse } from './logic/hashlife'
import examples from './logic/examples.json'
import Swal from 'sweetalert2'

export default {
  name: 'app',
  data() {
    return {
      zoom: 4,
      speed: 2,
      stepSize: 0,
      generation: 0,
      generationTime: null,
      liveCount: 0,
      preset: '',
      timerID: null,
      examples: examples,
    }
  },
  methods: {
    pow2(k) {
      return Math.pow(2, k)
    },
    handleWheel(evt) {
      if (evt.deltaY < 0) this.handleZoom(+1, evt.pageX, evt.pageY)
      else this.handleZoom(-1, evt.pageX, evt.pageY)
    },
    handleKeydown(evt) {
      if (evt.keyCode === 219)
        // [
        this.handleZoom(-1)
      else if (evt.keyCode === 221)
        // ]
        this.handleZoom(+1)
      else if (evt.keyCode === 189)
        // -
        this.stepSize = Math.max(this.stepSize - 1, 0)
      else if (evt.keyCode === 187)
        // =
        this.stepSize = Math.min(this.stepSize + 1, 32)
    },
    handleZoom(k, dx, dy) {
      if (this.zoom + k > 8 || this.zoom + k < -32) return
      this.zoom += k
      dx = dx || document.body.clientWidth / 2
      dy = dy || document.body.clientHeight / 2
      this.$refs.lifeGrid.zoom(k, dx, dy)
    },
    update() {
      this.liveCount = this.universe.population
      this.$refs.lifeGrid.setUniverse(this.universe)
    },
    toggle(cell) {
      this.universe.toggle(cell[0], cell[1])
      this.update()
    },
    step() {
      this.generation += Math.pow(2, this.stepSize)
      const t0 = performance.now()
      this.universe.step(this.stepSize)
      this.generationTime = Math.ceil(performance.now() - t0)
      this.update()
    },
    clear() {
      this.universe = new LifeUniverse()
      this.generation = 0
      this.generationTime = null
      this.update()
    },
    resume() {
      if (this.timerID) {
        clearInterval(this.timerID)
        this.timerID = null
      } else this.timerID = setInterval(this.step, 1000 / this.speed)
    },
    save() {
      Swal.fire({
        title: 'Save Pattern',
        text: 'Current pattern in RLE format:',
        input: 'text',
        inputValue: this.universe.toRLE(),
      })
    },
    load(rle) {
      if (rle) {
        const universe = LifeUniverse.fromRLE(rle)
        this.clear()
        this.$refs.lifeGrid.center()
        this.universe = universe
        this.update()
        const px = Math.min(
          document.body.clientWidth,
          document.body.clientHeight
        )
        const zoomGoal = Math.min(
          4,
          Math.round(Math.log2(px) - universe.root.level)
        )
        this.handleZoom(zoomGoal - this.zoom)
      }
    },
    loadPrompt() {
      Swal.fire({
        title: 'Load Pattern',
        text: 'Enter pattern RLE:',
        input: 'text',
        inputPlaceholder: 'b2o$2o$bo!',
        showCancelButton: true,
        inputValidator(value) {
          if (!RLE_RE.test(value))
            return 'Invalid RLE format, please check your input.'
        },
      }).then(({ value }) => {
        this.load(value)
      })
    },
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
    },
  },
  mounted() {
    window.addEventListener('wheel', this.handleWheel)
    // this.universe = new LifeUniverse()
    const allExamples = []
    for (const group in this.examples)
      for (const name in this.examples[group])
        allExamples.push(this.examples[group][name])
    this.preset = allExamples[Math.floor(Math.random() * allExamples.length)]
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.handleWheel)
  },
  components: {
    LifeGrid,
  },
}
</script>

<style>
body {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  margin: 0;
  overflow: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  text-align: center;
}

header {
  padding: 5px;
  background: rgba(255, 255, 255, 0.6);
  z-index: 1;
  text-align: right;
}

header > span {
  padding: 0 20px;
}

header > span::before {
  position: relative;
  left: -20px;
  content: '|';
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

.controls button,
.controls select {
  margin: 3px;
}

.controls label {
  margin-right: 8px;
}
</style>
