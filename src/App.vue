<template>
  <div id="app" tabindex="1">
    <header>
      <h1>Conway's Game of Life</h1>
    </header>

    <LifeGrid ref="lifeGrid"
      :cells="cells"
      :size="size"
      @toggle="toggle"
    />

    <footer>
      <span class="controls">
        Generation {{generation}} ({{generationTime}}ms)
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
          <option value="">--Select a pattern--</option>
          <optgroup label="Guns and Rakes">
            <option value="24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!">Gosper Glider Gun</option>
            <option value="18b2o$19bo$19bobo14b2o$20b2o12b2o2bo$24b3o7b2ob2o$24b2ob2o7b3o$24bo2b2o12b2o$25b2o14bobo$43bo$43b2o$$2o$bo$bobo13b3o$2b2o3bo8bo3bo$6bob2o6bo4bo$5bo4bo6b2obo$6bo3bo8bo3b2o$7b3o13bobo$25bo$25b2o!">Period-22 Glider Gun</option>
            <option value="40b2o$40b2o$40b2o$40bo$39bobo$39bob2o2$46b2o$40b2o4b2o$40b2o2$60bo26b2o$50b2o8b3o24bo$50bobo10bo21bobo$50bo11b2o15bo5b2o4b2o$78b2o11b2o$51b2o25bobo$47bo3bo2bo37bo$46bo2bob3o37bobo$46b3obo39bo2bo$40b2o5bob3o37bo2bo$40b2o11bo$40b2o22b2o23bo2bo$41bo22b2o25b2o$40bobo$39b2obo12b3o$55bo$56bo$40b2o$40b2o57b3o2$73b2o20b3obo2bo$74bo7b2o9bob3o$71b3o8b2o8bo6b3o$71bo20b2o2$95b2o$87b2o9b2o$87b2o7bobo$43b2o52bo25bo19b2o$43b2o74b2o2b2ob3o10b2o4b4o$102b2o15b2o4b4o10b2o2b2ob3o$84b2o15b3o19b2o18bo$43b3o34b2o2b2o2b2o10bobo2bo2b2o$44b2o34bobo2bo2b2o10b2o2b2o2b2o$41b2o38b3o20b2o$31bo9b3o38b2o45b2o9b2o$29bo3bo8bobo83b2obo8b2o$29bo3bo9b2o84bo$29bobobo3bo90bobo$37b2o89b2o4b3o$31b2o6bo88bob3o3bo$31b2o3bobo91bobo2bo$31b2o3bo90bo2bo$131bo$18b2o12bobo26bo60b2o$14b2obo2bob2o9b2o26bobo57bobo$14b2o2bo4bo37b2o60bo$19bo$20bobo20b2o$11bo25b2o4b2o91b2o$11b3o23b2o52b3o42bo$14bo76bo42bobo$13b2o27b3o47bo41b2o$42b2o81b2o$32b2o11b2o78b2o$32b2o10b3o$43bobo$16bo26b2o$14b2o$15b2o$114b2o$115bo$115bobo$31b2o83b2o$31bobo$33bo$33b2o$132b2o$133b2o$104b2o26bo$103bobo$102b3o10b2o$22b2o78b2o11b2o$22b2o81b2o$13b2o41bo47b3o27b2o$12bobo42bo76bo$12bo42b3o52b2o23b3o$11b2o91b2o4b2o25bo$104b2o20bobo$129bo$25bo60b2o37bo4bo2b2o$25bobo57bobo26b2o9b2obo2bob2o$25b2o60bo26bobo12b2o$17bo$18bo2bo90bo3b2o$13bo2bobo91bobo3b2o$12bo3b3obo88bo6b2o$12b3o4b2o89b2o$18bobo90bo3bobobo$19bo84b2o9bo3bo$7b2o8bob2o83bobo8bo3bo$7b2o9b2o45b2o38b3o9bo$43b2o20b3o38b2o$39b2o2b2o2b2o10b2o2bo2bobo34b2o$39b2o2bo2bobo10b2o2b2o2b2o34b3o$5bo18b2o19b3o15b2o$3ob2o2b2o10b4o4b2o15b2o$4o4b2o10b3ob2o2b2o74b2o$4b2o19bo25bo52b2o$50bobo7b2o$49b2o9b2o$52b2o2$55b2o20bo$47b3o6bo8b2o8b3o$51b3obo9b2o7bo$46bo2bob3o20b2o2$47b3o57b2o$107b2o$92bo$93bo$91b3o12bob2o$106bobo$56b2o25b2o22bo$56bo2bo23b2o22b2o$95bo11b2o$56bo2bo37b3obo5b2o$55bo2bo39bob3o$55bobo37b3obo2bo$56bo37bo2bo3bo$68bobo25b2o$56b2o11b2o$56b2o4b2o5bo15b2o11bo$61bobo21bo10bobo$61bo24b3o8b2o$60b2o26bo2$107b2o$101b2o4b2o$101b2o2$106b2obo$107bobo$108bo$107b2o$107b2o$107b2o!">Gunstar</option>
            <option value="11b2o5b4o$9b2ob2o3bo3bo$9b4o8bo$10b2o5bo2bo2$8bo$7b2o8b2o$6bo9bo2bo$7b5o4bo2bo$8b4o3b2ob2o$11bo4b2o4$18b4o$o2bo13bo3bo$4bo16bo$o3bo12bo2bo$b4o!">Space Rake</option>
          </optgroup>
          <optgroup label="Spaceships and Puffers">
            <option value="b3o7bo$b2o2bob2ob2o$3b3o4bob$bo2bobo3bob$o4bo4bob$o4bo4bob$bo2bobo3bob$3b3o4bob$b2o2bob2ob2o$b3o7bo!">Turtle</option>
            <option value="9bo7bo$3b2obobob2o3b2obobob2o$3obob3o9b3obob3o$o3bobo5bobo5bobo3bo$4b2o6bobo6b2o$b2o9bobo9b2o$b2ob2o15b2ob2o$5bo15bo!">Spider</option>
            <option value="b2o2bob2o$o2bo2b2o$bobo$2bo$8bo$6b3o$5bo$6bo$7b2o!">Loafer</option>
            <option value="b2o2b2o$3b2o$3b2o$obo2bobo$o6bo2$o6bo$b2o2b2o$2b4o2$3b2o$3b2o!">Copperhead</option>
            <option value="12bo$12b2o14bo$10bob2o5bobo4b2o$5bo3bo3b3o2bo4bo$2o3bo2bo6bobo5b3o2bo$2o3bob2o6bo3bobobo$2o3bo10bobo7b2o$5b2o14bo6bo$7bo12bobo$7bo12bobo$5b2o14bo6bo$2o3bo10bobo7b2o$2o3bob2o6bo3bobobo$2o3bo2bo6bobo5b3o2bo$5bo3bo3b3o2bo4bo$10bob2o5bobo4b2o$12b2o14bo$12bo!">Dragon</option>
            <option value="19b2o$19b4o$19bob2o2$20bo$19b2o$19b3o$21bo$33b2o$33b2o7$36bo$35b2o$34bo3bo$35b2o2bo$40bo$37bobo$38bo$38bo$38b2o$38b2o3$13bo10bo$12b5o5bob2o11bo$11bo10bo3bo9bo$12b2o8b3obo9b2o$13b2o9b2o12bo$2o13bo21b3o$2o35b3o7$8b2o$8b2o11b2o$19b2o2bo$24bo3bo$18bo5bo3bo$19bo2b2o3bobo$20b3o5bo$28bo!">2-engine Cordership</option>
            <option value="4b2o$4bo2bo$4bo3bo$6b3o$2b2o6b4o$2bob2o4b4o$bo4bo6b3o$2b4o4b2o3bo$o9b2o$bo3bo$6b3o2b2o2bo$2b2o7bo4bo$13bob2o$10b2o6bo$11b2ob3obo$10b2o3bo2bo$10bobo2b2o$10bo2bobobo$10b3o6bo$11bobobo3bo$14b2obobo$11bo6b3o$$11bo9bo$11bo3bo6bo$12bo5b5o$12b3o$16b2o$13b3o2bo$11bob3obo$10bo3bo2bo$11bo4b2ob3o$13b4obo4b2o$13bob4o4b2o$19bo$20bo2b2o$20b2o$21b5o$25b2o$19b3o6bo$20bobo3bobo$19bo3bo3bo$19bo3b2o$18bo6bob3o$19b2o3bo3b2o$20b4o2bo2bo$22b2o3bo$21bo$21b2obo$20bo$19b5o$19bo4bo$18b3ob3o$18bob5o$18bo$20bo$16bo4b4o$20b4ob2o$17b3o4bo$24bobo$28bo$24bo2b2o$25b3o$22b2o$21b3o5bo$24b2o2bobo$21bo2b3obobo$22b2obo2bo$24bobo2b2o$26b2o$22b3o4bo$22b3o4bo$23b2o3b3o$24b2ob2o$25b2o$25bo$$24b2o$26bo!">Sir Robin</option>
            <option value="b3o11b3o$o2bo10bo2bo$3bo4b3o6bo$3bo4bo2bo5bo$2bo4bo8bo!">Puffer 2</option>
            <option value="10bobo$9bo$10bo2bo$12b3o6$bo$obo2$o2bo$2b2o$3bo!">Noah's Ark</option>
            <option value="404bo2bo$408bo$404bo3bo$405b4o$416b2o$402bo11bo4bo$400bobo17bo$342bobo46bo8bobo11bo5bo$342bobo44bo3bo21b6o5b6o$331bo10bob2o48bo30bo5bo$329bo3bo10b2o43bo4bo36bo$334bo6bo2bo45b5o30bo4bo$329bo4bo7b2o83b2o$330b5o50b2o$385b2o32b3o5b2o$385b2o2bo13bo13bo3bo4bob2o$368b2o12b2ob2o3bo11bobo12bo7b2obobo$355b2o10bo2bo8b2o2bobo4bo4b2o4bo9b2o4bo7bob2ob2o$355b2o11b2o9b2o2b3o3bo5b2o5bo8b2o5bo2bo3bo3b2o$419bobo5b3o2$419bobo5b3o$355b2o11b2o9b2o2b3o3bo5b2o5bo8b2o5bo2bo3bo3b2o$355b2o10bo2bo8b2o2bobo4bo4b2o4bo9b2o4bo7bob2ob2o$368b2o12b2ob2o3bo11bobo12bo7b2obobo$385b2o2bo13bo13bo3bo4bob2o$385b2o32b3o5b2o$330b5o50b2o$329bo4bo7b2o83b2o$334bo6bo2bo45b5o30bo4bo$329bo3bo10b2o43bo4bo36bo$331bo10bob2o48bo30bo5bo$342bobo44bo3bo21b6o5b6o$342bobo46bo8bobo11bo5bo$400b2o18bo$401bo12bo4bo$416b2o$477b2o$475b2ob2o$475b4o$476b2o$376bobo$376b2o111b2o$377bo107b4ob2o5b4o$485b6o5b6o$463b2o21b4o6b4ob2o$460b3ob2o34b2o$403b2o55b5o21bo$400b3ob2o46bo8b3o23bo$352bobo45b5o21b3o23bo32b4o$352b2o47b3o20bo2b2o54b2o3bob2o$353bo69bo3bobo26...32b4o$402b3ob2o46bo8b3o23bo$405b2o55b5o21bo$462b3ob2o34b2o$465b2o21b4o6b4ob2o$377b2o108b6o5b6o$377bobo107b4ob2o5b4o$377bo113b2o2$478b2o$477b4o$477b2ob2o$479b2o$401b2o$401bobo16b2o$401bo14b4ob2o5b4o$416b6o5b6o$374bo19b2o21b4o6b4ob2o$372b2obo15b3ob2o34b2o$334b2o35bo3bo15b5o$331b3ob2o30b4obobo17b3o$331b5o30bobo3b2o12b2o33bo$332b3o20bo4b2o4bobo16bo2bo32b2o5b3o$354bobo2b2obo2b2ob2o18bo15bo14bo2bo3b2o$353bo3bo2b2ob3o2b4o11b2o5b2o11b2o12b3o6bo4b2o$340b2o12bo2bo4bo3b2obob2o17b2o4b2o4b3o7b2o4b2o5b2ob2o2bo$340b2o12b2ob2o9b2ob2o11bobo9b2o14b2o5bobo10bo$370bo14bo35bo7b3o2$370bo14bo35bo7b3o$340b2o12b2ob2o9b2ob2o11bobo9b2o14b2o5bobo10bo$340b2o12bo2bo4bo3b2obob2o17b2o4b2o4b3o7b2o4b2o5b2ob2o2bo$353bo3bo2b2ob3o2b4o11b2o5b2o11b2o12b3o6bo4b2o$354bobo2b2obo2b2ob2o18bo15bo14bo2bo3b2o$332b3o20bo4b2o4bobo16bo2bo32b2o5b3o$331b5o30bobo3b2o12b2o33bo$331b3ob2o30b4obobo17b3o$334b2o35bo3bo15b5o$372b2obo15b3ob2o34b2o$374bo19b2o21b4o6b4ob2o$416b6o5b6o$416b4ob2o5b4o$403b2o15b2o$402bo$407b2o$406b4o$406b2ob2o$408b2o!">Breeder 1</option>
            <option value="133bo$134bo$130bo3bo$131b4o3$130bo$131bo$132bo$132bo$131b2o4$133bo$134bo$130bo3bo$131b4o9$96bo$97bo$93bo3bo$94b4o8$3bo$4bo$o3bo$b4o!">Riley's Breeder</option>
          </optgroup>
          <optgroup label="Oscillators">
            <option value="2b3o3b3o$$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o$$2b3o3b3o$o4bobo4bo$o4bobo4bo$o4bobo4bo$$2b3o3b3o!">Pulsar</option>
            <option value="6ob2o$6ob2o$7b2o$2o5b2o$2o5b2o$2o5b2o$2o$2ob6o$2ob6o!">Kok's Galaxy</option>
            <option value="10o!">Pentadecathlon</option>
            <option value="11b2o11b2o$11b2o11b2o$$$6bo23bo$5bobo5bo9bo5bobo$4bo2bo5bob2o3b2obo5bo2bo$5b2o10bobo10b2o$15bobobobo$16bo3bo$$2o33b2o$2o33b2o$5b2o23b2o$$6bobo19bobo$6bo2bo17bo2bo$7b2o19b2o$$7b2o19b2o$6bo2bo17bo2bo$6bobo19bobo$$5b2o23b2o$2o33b2o$2o33b2o$$16bo3bo$15bobobobo$5b2o10bobo10b2o$4bo2bo5bob2o3b2obo5bo2bo$5bobo5bo9bo5bobo$6bo23bo$$$11b2o11b2o$11b2o11b2o!">124P37</option>
          </optgroup>
          <optgroup label="Methuselahs">
            <option value="b2o$2ob$bo!">R-pentomino</option>
            <option value="o2b$3o$obo$2bo!">Herschel</option>
            <option value="bobo2b$o5b$bo2bob$3b3o!">Switch Engine</option>
            <option value="bo5b$3bo3b$2o2b3o!">Acorn</option>
            <option value="obobobobo3b2o$2bo3bo2bo3b3o$2bobo3bo5b2o$o3bo2b6ob2o$3ob2obobobo$6bo2bobob3o$2ob2o2bo2bob4o$o2bob2ob3o4bo$o4bob3o5bo$bobo2bob2ob2ob2o$3b3obob2ob4o$obob4o3b3o$obo3b2ob2obobo$ob2ob3obob2o2bo$o3b3o2b2obo2bo$3ob2o2b2ob2obo!">42100M</option>
          </optgroup>
          <optgroup label="Miscellaneous">
            <option value="18bo$17b3o$12b3o4b2o$11bo2b3o2bob2o$10bo3bobo2bobo$10bo4bobobobob2o$12bo4bobo3b2o$4o5bobo4bo3bob3o$o3b2obob3ob2o9b2o$o5b2o5bo$bo2b2obo2bo2bob2o$7bobobobobobo5b4o$bo2b2obo2bo2bo2b2obob2o3bo$o5b2o3bobobo3b2o5bo$o3b2obob2o2bo2bo2bob2o2bo$4o5bobobobobobo$10b2obo2bo2bob2o2bo$13bo5b2o5bo$b2o9b2ob3obob2o3bo$2b3obo3bo4bobo5b4o$2b2o3bobo4bo$2b2obobobobo4bo$5bobo2bobo3bo$4b2obo2b3o2bo$6b2o4b3o$7b3o$8bo!">Max</option>
            <option value="5bobo49bobo$4bo2bo49bo2bo$3b2o55b2o$2bo59bo$b4o55b4o$o4bo53bo4bo$o2bo24b3o3b3o24bo2bo$o2bo24bo2bobo2bo24bo2bo$bo26bo7bo26bo$2b4obo20bo7bo20bob4o$3bo3bo21bobobobo21bo3bo$4bo24bobobobo24bo$4bobo23bo3bo23bobo$29b3ob3o$3b3o26bo26b3o$3b2o23b9o23b2o$3b3o21bo9bo21b3o$26b13o$4bobo18bo13bo18bobo$4bo19b17o19bo$3bo3bo15bo17bo15bo3bo$2b4obo14b21o14bob4o$bo19bo21bo19bo$o2bo16b25o16bo2bo$o2bo15bo25bo15bo2bo$o4bo12b29o12bo4bo$b4o12bo29bo12b4o$2bo13b33o13bo$3b2o10bo33bo10b2o$4bo2bobo4b37o4bobo2bo$5bobo2bo2bo37bo2bo2bobo$8bo3b20ob20o3bo$9bo21bobo21bo$10b21o3b21o2$8b21o3bo3b21o$7bo21bobobobo21bo$6bo3b2o2bob2ob2ob2ob5obobob5ob2ob2ob2obo2b2o3bo$6bo4bobo2b2o4b2o7bobo7b2o4b2o2bobo4bo$6bo8bo5bo5b3obobob3o5bo5bo8bo$7b3o20b2ob2o20b3o$9bo17b2o3bo3b2o17bo$6b2o2bo3b2o11b4obob4o11b2o3bo2b2o$4bo5b2obo17bobo17bob2o5bo$3bo6bo18bobobobo18bo6bo$3bo4b2obo2bo10b2o2b3ob3o2b2o10bo2bob2o4bo$3b5o3b2o5bo6b2o2b2o3b2o2b2o6bo5b2o3b5o$13b2o4bo25bo4b2o$10b2o3b2ob2obo7b3ob3o7bob2ob2o3b2o$13bo4bobo23bobo4bo$9bo4b5obo4bo3b3ob3o3bo4bob5o4bo$8b2o2b2o4bo3b3o3bo7bo3b3o3bo4b2o2b2o$9b2o3bo4b2o7b4ob4o7b2o4bo3b2o$10b2o8bo10bobo10bo8b2o$30b2ob2o$22bo3bob2obobob2obo3bo$21bobobobob2o3b2obobobobo$21bobobobo9bobobobo$22bobob3o7b3obobo$24bobo3b5o3bobo$24b2o6bo6b2o2$27bo2bobobo2bo$27b11o2$29bo5bo$28bobo3bobo$28bob2ob2obo$26bobob2ob2obob2o$25bobo9bobo$25bo2b3o3b3o$26b2o$29bo2bo2b2o$26b3obobobo2bo$26bo3bobobob2o$27bobo4bo$28b2obo2bob2o$30bobobobo$30bobobobo$31b2ob2o!">Halfmax</option>
            <option value="10bo19b2o$9bobo17bo4b2o$2bo4b3obo5bo14bob3o$bobo2bo4b2o3bobo7bobob4o3bo3b2o2b2obo$bobo2bob2o3bo3bo8b3obo8bo2b2o4bo$2ob2obobob2o8bo10bo4b2ob2o4b2obo$bo4b2o4b2o3bob2o13bo7bo$bob2o2bo3bobob2o2bob2ob3o4bobo9bo$2bo3b3obobo2bo4bo3b3o4bobo9bo$3b2o3bobo2bo5b2o13bo7bo$5b2obob2obobo3bo11bo4b2ob2o4b2obo$5bob2obo2bob2o4bo4b3obo8bo2b2o4bo$11b2o7b2o4bobob4o3bo3b2o2b2obo$32bob3o$29bo4b2o$30b2o!">Wickstretcher 1</option>
            <option value="8b2o$7b2o$9bo$11b2o$10bo2$9bo2b2o$b2o5b2o4bo$2o5bo5bo$2bo4bobo3b2o$4bo2bo4b2obo$4b2o7b2o$8bo4bob2o$7bobo2bob2o$8bo!">One Per Generation</option>
            <option value="6bo$4bob2o$4bobo$4bo$2bo$obo!">10-cell Infinite Growth</option>
            <option value="59b2o$59b2o3$56b2o$56b2o8b2o$7b2o57bo$7b2o50b2o6bo$59b2o5b2o2$10b2o54b2o$2o8b2o55bo$bo61bo$o6b2o53bo3bo$2o5b2o55b2o2$2o$o$4bo43b3o$bo3bo41bo2bo$2b2o43bo3bo$46b2obobo$46b2ob2o$47b3o$17b3o$17bo2bo$16bo3bo29b2o$16bobob2o27bo2bo$17b2ob2o25b5o$18b3o25b2ob3o$46b3o$47bobo$16b2o22bo7b2o$15bo2bo10bo8b3o$16b5o8bobo5bo$16b3ob2o7b2o6b2o$19b3o$18bobo$18b2o15bo$34bobo$29bo3bo3bo$27b2o5b3o$28b2o2b2o3b2o11$7b4o24b2o$5b2o4b2o22b2o$5b2o5bo$7b2obobo$12bo9bo4bo$8bo3bo7b2ob4ob2o$8bo4bo8bo4bo$10b3o3bo$10b2o4bo$16b2o$18bo$18b3o3$21bo$20bob5o$19b2o5bo$19b2o3bo2bo$27bo$21b2obo2bo$24bo2bo$25b2o$25b2o!">Sawtooth 177</option>
          </optgroup>
        </select>
      </span>
      <span class="controls">
        <label for="size-input">Zoom</label>
        <input id="size-input" type="range" v-model.number="size" min="4" max="20">
      </span>
      <span class="controls">
        <label for="size-input">Speed</label>
        <input id="size-input" type="range" v-model.number="speed" min="1" max="100">
      </span>
    </footer>
  </div>
</template>

<script>
import LifeGrid from './components/LifeGrid.vue'
import { pair, successor, encode, decode } from './life.js'

export default {
  name: 'app',
  data() {
    return {
      cells: new Set(),
      size: 12,
      speed: 2,
      generation: 0,
      generationTime: 0,
      preset: '',
      timerID: null
    }
  },
  computed: {
    liveCount() {
      return this.cells.size
    }
  },
  methods: {
    toggle(cell) {
      cell = pair(cell[0], cell[1])
      const cells = new Set(this.cells)
      if (!cells.delete(cell))
        cells.add(cell)
      this.cells = cells // No automatic change detection for Sets
    },
    step() {
      this.generation++
      const t0 = performance.now()
      this.cells = successor(this.cells)
      this.generationTime = Math.ceil(performance.now() - t0)
    },
    clear() {
      this.cells = new Set()
      this.generation = 0
      this.generationTime = 0
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
        this.generationTime = 0
        this.$refs.lifeGrid.center()
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
