<template>
  <div id="app"
    tabindex="1"
    @keydown.up="row0--"
    @keydown.down="row0++"
    @keydown.left="col0--"
    @keydown.right="col0++">

    <AppHeader/>
    <LifeGrid :cells="cells" @toggle="toggle" :row0="row0" :col0="col0"/>
    <AppControls @step="step"/>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppControls from './components/AppControls.vue'
import LifeGrid from './components/LifeGrid.vue'
import * as _ from 'lodash'

function* neighbors(coords) {
  const [ x, y ] = _.map(coords.split(','), parseInt)
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i != x || j != y)
        yield i + ',' + j
    }
  }
}

function successor(cells) {
  // TODO
  return cells
}

export default {
  name: 'app',
  data() {
    return {
      cells: {},
      row0: 0,
      col0: 0
    }
  },
  methods: {
    toggle(cell) {
      this.$set(this.cells, cell, !this.cells[cell])
    },
    step() {
      this.cells = successor(this.cells)
    }
  },
  components: {
    AppHeader,
    AppControls,
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
  color: #2c3e50;
}
</style>
