<template>
  <div id="app" tabindex="1">
    <header>
      <span>Generation {{generation}}{{generationTime !== null ? ` (${generationTime}ms)` : ''}}</span>
      <span>Pop: {{liveCount}}</span>
    </header>

    <LifeGrid ref="lifeGrid"
      :cells="cells"
      :size="size"
      @toggle="toggle"
    />

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
          <option value="">--Select a pattern--</option>
          <optgroup label="Guns and Rakes">
            <option value="24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!">Gosper Glider Gun</option>
            <option value="18b2o$19bo$19bobo14b2o$20b2o12b2o2bo$24b3o7b2ob2o$24b2ob2o7b3o$24bo2b2o12b2o$25b2o14bobo$43bo$43b2o$$2o$bo$bobo13b3o$2b2o3bo8bo3bo$6bob2o6bo4bo$5bo4bo6b2obo$6bo3bo8bo3b2o$7b3o13bobo$25bo$25b2o!">Period-22 Glider Gun</option>
            <option value="b2o$b2o17bo$19bobo12bobo$20bo12bo$2o7b2o23bo2bo$2obo5b2o23bobobo$3bo23bo7bo2bo$3bo23b2o7b2o$o2bo17b2o5bo$b2o18bo$21b3o$36b2o$36b2o$b2o$o2bo$obobo16bobo4b2o5b2o$bo2bo17b2o4b2o5b2obo$5bo12bo3bo15bo$2bobo12bobo18bo$18bo16bo2bo$36b2o!">B-52 Bomber</option>
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
            <option value="404bo2bo$408bo$404bo3bo$405b4o$416b2o$402bo11bo4bo$400bobo17bo$342bobo46bo8bobo11bo5bo$342bobo44bo3bo21b6o5b6o$331bo10bob2o48bo30bo5bo$329bo3bo10b2o43bo4bo36bo$334bo6bo2bo45b5o30bo4bo$329bo4bo7b2o83b2o$330b5o50b2o$385b2o32b3o5b2o$385b2o2bo13bo13bo3bo4bob2o$368b2o12b2ob2o3bo11bobo12bo7b2obobo$355b2o10bo2bo8b2o2bobo4bo4b2o4bo9b2o4bo7bob2ob2o$355b2o11b2o9b2o2b3o3bo5b2o5bo8b2o5bo2bo3bo3b2o$419bobo5b3o2$419bobo5b3o$355b2o11b2o9b2o2b3o3bo5b2o5bo8b2o5bo2bo3bo3b2o$355b2o10bo2bo8b2o2bobo4bo4b2o4bo9b2o4bo7bob2ob2o$368b2o12b2ob2o3bo11bobo12bo7b2obobo$385b2o2bo13bo13bo3bo4bob2o$385b2o32b3o5b2o$330b5o50b2o$329bo4bo7b2o83b2o$334bo6bo2bo45b5o30bo4bo$329bo3bo10b2o43bo4bo36bo$331bo10bob2o48bo30bo5bo$342bobo44bo3bo21b6o5b6o$342bobo46bo8bobo11bo5bo$400b2o18bo$401bo12bo4bo$416b2o$477b2o$475b2ob2o$475b4o$476b2o$376bobo$376b2o111b2o$377bo107b4ob2o5b4o$485b6o5b6o$463b2o21b4o6b4ob2o$460b3ob2o34b2o$403b2o55b5o21bo$400b3ob2o46bo8b3o23bo$352bobo45b5o21b3o23bo32b4o$352b2o47b3o20bo2b2o54b2o3bob2o$353bo69bo3bobo26bo11b2o14bobobobo7b2o$421bo3bo9bobo13b4obo10bo2bo13bo3b3o2bo3bo2b2o$405b2o14bo3b2o11bo11bo2bob2o4b2o4bobo7b2o6bobo3bo4b3o2bo$405b2o14bo8bo3b2obo12bobo8b2o5bo8b2o7bo4b3o2bo4bo$422bo3bo3b3o3bo14bo44b5o2$328bobo91bo3bo3b3o3bo14bo44b5o$328b2o11b2o30b2o30b2o14bo8bo3b2obo12bobo8b2o5bo8b2o7bo4b3o2bo4bo$329bo11b2o30b2o30b2o14bo3b2o11bo11bo2bob2o4b2o4bobo7b2o6bobo3bo4b3o2bo$421bo3bo9bobo13b4obo10bo2bo13bo3b3o2bo3bo2b2o$423bo3bobo26bo11b2o14bobobobo7b2o$424bo2b2o54b2o3bob2o$426b3o23bo32b4o$452bo8b3o23bo$460b5o21bo$460b3ob2o34b2o89b2o$463b2o21b4o6b4ob2o87b4o$485b6o5b6o88b2ob2o$485b4ob2o5b4o91b2o$489b2o$464bo136b4o$464bobo133b6o$280bobo181b2o134b4ob2o$280b2o294b3o13b3o9b2o9b2o$281bo252bobo38b5o12bo18b4ob2o$516b3o14b2o2bo37b3ob2o12bo17b6o$515b5o12b3o2bo40b2o27bo4b4o$515b3ob2o10b3o72bo2bo$440bo77b2o11bobo2b2o59b3o$440bobo87b2ob3obo38b2o17b5o12b2o$440b2o89bo6bo37b2o16b3o14bo3bo$532bo4bo20b2o15bo2bo14bo3bo9bo3bo4bo$534b5o6b2o10bo2bo8b2o4bobo7b2o5b2o2bo4b2o5bobo5bo$538b2o5b2o11b2o9b2o5bo8b2o5bo6b3o9b2ob3o$538b2o53b8o2$538b2o53b8o$449b2o30b2o30b2o23b2o5b2o11b2o9b2o5bo8b2o5bo6b3o9b2ob3o81b2o$232bobo214b2o30b2o30b2o19b5o6b2o10bo2bo8b2o4bobo7b2o5b2o2bo4b2o5bobo5bo79b2ob2o$232b2o298bo4bo20b2o15bo2bo14bo3bo9bo3bo4bo79b4o$233bo297bo6bo37b2o16b3o14bo3bo81b2o$530b2ob3obo38b2o17b5o12b2o$531bobo2b2o59b3o110b2o$531b3o72bo2bo96b4ob2o5b4o$392bo139b3o2bo40b2o27bo4b4o90b6o5b6o$392bobo138b2o2bo37b3ob2o12bo17b6o67b2o21b4o6b4ob2o$392b2o140bobo38b5o12bo18b4ob2o63b3ob2o34b2o$576b3o13b3o9b2o9b2o7b2o55b5o21bo$600b4ob2o14b3ob2o46bo8b3o23bo$600b6o15b5o21b3o23bo32b4o$601b4o17b3o20bo2b2o54b2o3bob2o$644bo3bobo26bo11b2o14bobobobo7b2o$642bo3bo9bobo13b4obo10bo2bo13bo3b3o2bo3bo2b2o$569bo56b2o14bo3b2o11bo11bo2bob2o4b2o4bobo7b2o6bobo3bo4b3o2bo$184bobo381bo57b2o14bo8bo3b2obo12bobo8b2o5bo8b2o7bo4b3o2bo4bo$184b2o382b3o72bo3bo3b3o3bo14bo44b5o$185bo$643bo3bo3b3o3bo14bo44b5o$562b2o30b2o30b2o14bo8bo3b2obo12bobo8b2o5bo8b2o7bo4b3o2bo4bo$562b2o30b2o30b2o14bo3b2o11bo11bo2bob2o4b2o4bobo7b2o6bobo3bo4b3o2bo$344bo297bo3bo9bobo13b4obo10bo2bo13bo3b3o2bo3bo2b2o$344bobo198bo98bo3bobo26bo11b2o14bobobobo7b2o$344b2o198bo100bo2b2o54b2o3bob2o$544b3o100b3o23bo32b4o$673bo8b3o23bo$681b5o21bo$681b3ob2o34b2o$684b2o21b4o6b4ob2o$706b6o5b6o$706b4ob2o5b4o$136bobo571b2o$136b2o547bo$137bo547bobo$685b2o3$296bo$296bobo198bo$296b2o198bo$496b3o162bo55b2o$661bobo52b4o$661b2o53b2ob2o$718b2o2$727b4o$726b6o$88bobo635b4ob2o$88b2o547bo64b3o25b2o9b2o$89bo547bobo61b5o31b4ob2o$637b2o62b3ob2o16b2o12b6o$665b2o37b2o16bobo13b4o$664bo2bo53bo2bo12bo$248bo412b2obo61bo9bobo$248bobo198bo216b2o52bo15bobo$248b2o198bo212bo3b2o39b2o17bobobo10b2o$448b3o212bobo22b2o15bo2bo13bo2bobo2bo9bobo$643b2o30b2o10bo2bo4bo3b2o4bobo7b2o6b2o5bo2bo8bo$643b2o23b2o5b2o11b2o5bo3b2o5bo8b2o11bobobo2bo4b3o$668b2o55b2obo3bo2bo2$668b2o55b2obo3bo2bo$3b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o23b2o5b2o11b2o5bo3b2o5bo8b2o11bobobo2bo4b3o$3b2o30b2o3bobo24b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o10bo2bo4bo3b2o4bobo7b2o6b2o5bo2bo8bo$40b2o547bo73bobo22b2o15bo2bo13bo2bobo2bo9bobo$41bo547bobo69bo3b2o39b2o17bobobo10b2o$589b2o75b2o52bo15bobo$3bo657b2obo61bo9bobo$2b3o659bo2bo53bo2bo12bo$bo3bo194bo464b2o37b2o16bobo13b4o$ob3obo193bobo198bo299b3ob2o16b2o12b6o$b5o194b2o198bo300b5o31b4ob2o$196b2o30b2o30b2o30b2o30b2o30b2o30b2o10b3o17b2o30b2o30b2o30b2o30b2o152b3o25b2o9b2o$35b2o30b2o30b2o30b2o30b2o30bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo175b4ob2o$35bobo29bobo29bobo29bobo29bobo29bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo175b6o$36b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o177b4o$6b3o692bo$8bo691bo$7bo$701bobo$703bo$701bo$702bo2$38b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o371b4o$4b3o30bobo29bobo29bobo29bobo29bobo29bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo369b6o$3bo3bo29b2o30b2o30b2o30b2o30b2o30bo2bo28bo2bo28bo2bo28bo2bo28bo2bo28bo2bo229b2o138b4ob2o$2bo5bo189b2o30b2o30b2o30b2o30b2o30b2o229b2o115b3o25b2o9b2o$2b2obob2o193b2o387bo113b5o15b3o13b4ob2o$202bobo461b2o37b3ob2o14bo15b6o$202bo464b2o39b2o18bo13b4o$5bo659bobo59bo12bo$4bobo657b3o71b2o$4bobo34b2o621bo2bo62bo8bo2bo$5bo35bobo356b2o262bob3o39b2o19b4o7b3ob2o$41bo357b2o264bo2bo21b2o15bo2bo21bo13bo$5b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o10bo19b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o19b2o9b2o10bo2bo8b2o4bobo7b2o5b4o2bob2o12bo$5b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o30b2o23b2o5b2o11b2o9b2o5bo8b2o5bobobobo4b2o5bo2b2o$670b2o53b2o2bobo11b2o2$670b2o53b2o2bobo11b2o$422bo30b2o30b2o30b2o30b2o30b2o30b2o30b2o23b2o5b2o11b2o9b2o5bo8b2o5bobobobo4b2o5bo2b2o$422bo30b2o30b2o30b2o30b2o30b2o30b2o23b2o5b2o19b2o9b2o10bo2bo8b2o4bobo7b2o5b4o2bob2o12bo$424b2o211b2o26bo2bo21b2o15bo2bo21bo13bo$250b2o387bo24bob3o39b2o19b4o7b3ob2o$250bobo411bo2bo62bo8bo2bo$250bo413b3o71b2o$665bobo59bo12bo$667b2o39b2o18bo13b4o$89b2o575b2o37b3ob2o14bo15b6o$89bobo356b2o212b2o41b5o15b3o13b4ob2o$89bo357b2o212b2o43b3o25b2o9b2o$449bo213bo66b4ob2o$730b6o$731b4o2$479b6o6b2o229b2o$478bo5bo4bo4bo225b2ob2o$472b2o10bo10bo190b2o32b4o$414b2o38b5o12b2o5bo4bo5bo5bo189b2o34b2o$298b2o113b3o37bo4bo14bo6b2o8b6o191bo$298bobo93b5o12b2o3bo41bo27bo$298bo94bo4bo12bo3bo37bo3bo28b3o$398bo11bo44bo21bo7bob2o2bo$393bo3bo12b3o2b2o59b3o8b3o2bo$137b2o256bo14bobob3o38b2o16b3o10b5o2bo$137bobo271b3ob2o20b2o15bo2bo14bo3bo3bo5b3obob3o215b2o$137bo275b2o9b2o10bo2bo8b2o4bobo7b2o5bo2bobo4bo9b2ob2o213b2o$417b2o5b2o11b2o9b2o5bo8b2o5bo8bo9b2ob2o216bo$417b2o53b8o252b6o6b2o$731bo5bo4bo4bo$417b2o53b8o257bo10bo$360b2o30b2o23b2o5b2o11b2o9b2o5bo8b2o5bo8bo9b2ob2o212b5o19bo4bo5bo5bo$360b2o30b2o19b2o9b2o10bo2bo8b2o4bobo7b2o5bo2bobo4bo9b2ob2o210bo4bo20bobo8b6o$411b3ob2o20b2o15bo2bo14bo3bo3bo5b3obob3o152b5o59bo$410bobob3o38b2o16b3o10b5o2bo152bo4bo21bo32bo3bo20bo2bo$346b2o62b3o2b2o59b3o8b3o2bo158bo20bobo33bo21b3ob2o$346bobo61bo44bo21bo7bob2o2bo154bo3bo24bo53b2o3bob2o$346bo64bo3bo37bo3bo28b3o159bo21bob2o24b2obo12b2o14bo3bo9b3o$411b2o3bo41bo27bo181bob2o25b4ob2o9bo2bo13bobobob2o4bo3b2o$413b3o37bo4bo14bo6b2o8b6o155b2o13b3o2b2o7b2ob2o11bo4b2o4b2o4bobo7b2o6b5obobo2bobo2b2o$185b2o227b2o38b5o12b2o5bo4bo5bo5bo155b2o14b2o2b2o3bo4b3o12bobo8b2o5bo8b2o7bo4b2o2bo5bo$185bobo284b2o10bo10bo180b2o3b2o14bo40bo3b5o$185bo292bo5bo4bo4bo$370b2o107b6o6b2o183b2o3b2o14bo40bo3b5o$370bobo278b2o14b2o2b2o3bo4b3o12bobo8b2o5bo8b2o7bo4b2o2bo5bo$370bo97bo2bo179b2o13b3o2b2o7b2ob2o11bo4b2o4b2o4bobo7b2o6b5obobo2bobo2b2o$472bo195bob2o25b4ob2o9bo2bo13bobobob2o4bo3b2o$468bo3bo175bo21bob2o24b2obo12b2o14bo3bo9b3o$469b4o173bo3bo24bo53b2o3bob2o$651bo20bobo33bo21b3ob2o$646bo4bo21bo32bo3bo20bo2bo$394b2o251b5o59bo$394bobo309bo4bo20bobo8b6o$394bo312b5o19bo4bo5bo5bo$737bo10bo$731bo5bo4bo4bo$233b2o497b6o6b2o$233bobo$233bo487bo2bo$418b2o305bo$418bobo300bo3bo$418bo303b4o6$442b2o$442bobo$442bo3$281b2o$281bobo$281bo$466b2o$466bobo$466bo$491b2o$487b4ob2o5b4o$487b6o5b6o$465b2o21b4o6b4ob2o$462b3ob2o34b2o$462b5o21bo$454bo8b3o23bo$428b3o23bo32b4o$426bo2b2o54b2o3bob2o$425bo3bobo26bo11b2o14bobobobo7b2o$329b2o92bo3bo9bobo13b4obo10bo2bo13bo3b3o2bo3bo2b2o$329bobo11b2o30b2o30b2o14bo3b2o11bo11bo2bob2o4b2o4bobo7b2o6bobo3bo4b3o2bo$329bo13b2o30b2o30b2o14bo8bo3b2obo12bobo8b2o5bo8b2o7bo4b3o2bo4bo$424bo3bo3b3o3bo14bo44b5o2$424bo3bo3b3o3bo14bo44b5o$407b2o14bo8bo3b2obo12bobo8b2o5bo8b2o7bo4b3o2bo4bo$407b2o14bo3b2o11bo11bo2bob2o4b2o4bobo7b2o6bobo3bo4b3o2bo$353b2o68bo3bo9bobo13b4obo10bo2bo13bo3b3o2bo3bo2b2o$353bobo69bo3bobo26bo11b2o14bobobobo7b2o$353bo49b3o20bo2b2o54b2o3bob2o$402b5o21b3o23bo32b4o$402b3ob2o46bo8b3o23bo$405b2o55b5o21bo$462b3ob2o34b2o$465b2o21b4o6b4ob2o$377b2o108b6o5b6o$377bobo107b4ob2o5b4o$377bo113b2o2$478b2o$477b4o$477b2ob2o$479b2o$401b2o$401bobo16b2o$401bo14b4ob2o5b4o$416b6o5b6o$374bo19b2o21b4o6b4ob2o$372b2obo15b3ob2o34b2o$334b2o35bo3bo15b5o$331b3ob2o30b4obobo17b3o$331b5o30bobo3b2o12b2o33bo$332b3o20bo4b2o4bobo16bo2bo32b2o5b3o$354bobo2b2obo2b2ob2o18bo15bo14bo2bo3b2o$353bo3bo2b2ob3o2b4o11b2o5b2o11b2o12b3o6bo4b2o$340b2o12bo2bo4bo3b2obob2o17b2o4b2o4b3o7b2o4b2o5b2ob2o2bo$340b2o12b2ob2o9b2ob2o11bobo9b2o14b2o5bobo10bo$370bo14bo35bo7b3o2$370bo14bo35bo7b3o$340b2o12b2ob2o9b2ob2o11bobo9b2o14b2o5bobo10bo$340b2o12bo2bo4bo3b2obob2o17b2o4b2o4b3o7b2o4b2o5b2ob2o2bo$353bo3bo2b2ob3o2b4o11b2o5b2o11b2o12b3o6bo4b2o$354bobo2b2obo2b2ob2o18bo15bo14bo2bo3b2o$332b3o20bo4b2o4bobo16bo2bo32b2o5b3o$331b5o30bobo3b2o12b2o33bo$331b3ob2o30b4obobo17b3o$334b2o35bo3bo15b5o$372b2obo15b3ob2o34b2o$374bo19b2o21b4o6b4ob2o$416b6o5b6o$416b4ob2o5b4o$403b2o15b2o$402bo$407b2o$406b4o$406b2ob2o$408b2o!">Breeder 1</option>
            <option value="208b2o5b4o$206b2ob2o3bo3bo$206b4o8bo$207b2o5bo2bo3$187b4o15bo7b2o$186bo3bo6b5o7b2o3bobo$190bo6bo18bo$186bo2bo8b3o13b3o$199bo4b2o$173b6o25b2o$172bo5bo5b3o$178bo7bo$172bo4bo7bo29b4o$174b2o38bo3bo$218bo$214bo2bo3$192b3o21b2o$194bo19bo4bo$193bo26bo$214bo5bo$215b6o$177bobo$178b2o$178bo$200b3o18b4o$203bo6b2o8b6o$200bo8bo2bo6bob3ob2o$209bo2bo6b2o3b2o$197bo5b2o5bo$196b3o5bo7b3o6b2o$196bo3bo12b2o9bo$190bo5bo2b2o24bo$188bo3bo4bobo21bo3bo$193bo3b3o10b3o9b4o$188bo4bo15b5o$189b5o4b2o9b3ob2o$196bo4bo10b2o$202bo$184b2o10bo5bo$175b4o4b4o10b6o$174bo3bo4b2ob2o$178bo6b2o$174bo2bo3$175b2o$175bo7b2o$175bo2bo5b2o$176b3o4b2o$162bo15b2o3bo$162bo$162bobo$163bo20b2o$163bo19b4o$183b2ob2o$185b2o$155bo38b6o$153bobo37bo5bo$154b2o43bo$193bo4bo10b2o$186b5o4b2o9b3ob2o$137bobo45bo4bo15b5o$138b2o50bo16b3o9b4o$138bo46bo3bo28bo3bo$187bo12bo21bo$200b3o18bo$188b2o7b3o2b2o14b2o$188b2o6b2o5b2o8b3o$196b5o2b3o6bo3b2o3b2o$199bobo2bo8bo2bob3ob2o$200b2obo10b9o$199bo18b4o4$192bo19b6o$193bo17bo5bo$191b3o23bo$211bo4bo$213b2o3$211bo2bo$184bo30bo$171b2o12bo25bo3bo$169bo4bo8b3o26b4o$175bo15b3o$169bo5bo$170b6o14bo2bo14b2o$190bobo18bo$183bo2bo19b2o4b2o$187bo17b2o6bo$183bo3bo16b2o7bo$184b4o17bo3bo2bo$210bo2$115bo88b2o5bo2bo$113bobo87b4o8bo$114b2o87b2ob2o3bo3bo$205b2o5b4o2$97bobo77b2o$98b2o74b3ob2o29b2o$98bo75b5o21b4o4b4o$175b3o6bo14bo3bo4b2ob2o$183bobo17bo6b2o$199bo2bo$179b2o268b5o$179bo7bo260bo4bo21b2o5bo2bo$181b2obo15b2o251bo20b4o8bo$185b3o12bo7b2o238bo3bo21b2ob2o3bo3bo$200bo2bo5b2o239bo25b2o5b4o$201b3o4b2o$203b2o3bo$178b3o298bobo$180bo18bo266bo2b2o6b2o3bo$179bo17bo3bo7b2o255bo2bobo5b3obob2o$202bo5b4o259b2o4b3o4bo$197bo4bo5b2ob2o257bo9bo3bo$198b5o7b2o269b3o$481bo2$186b3o21b2o270bo2bo$188bo19bo4bo261b2o9bo$187bo26bo257b3ob2o4bo3bo$208bo5bo257b5o6b4o$209b6o258b3o$461bo$461b2o$417bobo40bobo$194b3o18b4o198b2o68b2o$197bo6b2o8b6o198bo64b4ob2o$194bo8bo2bo6bob3ob2o262b6o$203bo2bo6b2o3b2o264b4o$191bo5b2o5bo$190b3o5bo7b3o6b2o209b2o41bo20b2o$75bo114bo3bo12b2o9bo203b4ob2o7bo32b2o17bo4bo$73bobo108bo5bo2b2o24bo202b6o6bo3bo29bobo7b2o14bo$74b2o20bo85bo3bo4bobo21bo3bo203b4o12bo37bo2bo6bo6bo$95bo91bo3b3o10b3o9b4o197b2o15bo4bo37b3o7b8o$95b3o84bo4bo15b5o206b3ob2o15b5o24b3o4b2o6b2o7b2o$57bobo123b5o4b2o9b3ob2o205b5o5bo24b2o13bobo4b2o7bobo$58b2o130bo4bo10b2o207b3o5b3o21b2ob2o11b2obobo11bobo$12b2o44bo137bo225bo2bo21b4o13b5o23b2o$8b4ob2o175bo5bo225bo3bo12b2o7b2o14b2o13bo10b2ob2o$8b6o177b6o226b4o12b2o7bo11b2o3bobo9bo3bo8b4o$9b4o410bo2b2ob3o5bo8bo3bo6b3ob2o2bo16bo8b2o$427b3o5b2o8bo5bo5b5o15bo4bo$427b3o6b3o6bo5bo6b3o17b5o$427b2o8bobo6b6o17b2o$75b3ob3o73b3ob3o73b3ob3o73b3ob3o104b2o37b4ob2o$465b6o$466b4o2$2b2o440b2o$o4bo434b4ob2o$6bo78bo79bo79bo93b2o5b4o68bo21b6o$o5bo77bobo77bobo77bobo90b2ob2o3bo3bo69b2o20b4o$b6o77b2o78b2o78b2o91b4o8bo68b2o$16b2o320b2o5bo2bo$15b4o420bo2bo$15b2ob2o40b2o35b2o237bo95b2o9bo$17b2o35b2o5b2o33b2o157b2o5b4o69b2o8b2o82b3ob2o4bo3bo$55b2o3bo37bo154b2ob2o3bo3bo68bo9bo2bo29b2o50b5o6b4o$54bo198b4o8bo69b5o4bo2bo30b2o30bo19b3o$254b2o5bo2bo71b4o3b2ob2o29bo33b2o$61b3o275bo4b2o64b2o$63bo$62bo171b4o15bo7b2o59bobo95b2o7b2o8b3o$233bo3bo6b5o7b2o3bobo59b2o92b3o2bo6bo11bo$79b2o156bo6bo18bo60bo21b4o66b4ob2o6b2o3b2o3bobo$79bobo151bo2bo8b3o13b3o58bo22bo3bo9b4o52bo2bob2o9bo7b2o$59b3o17bo166bo4b2o68bobo25bo8b6o52b2ob2o$61bo158b6o4b3o18b2o70bo21bo2bo9b4ob2o59bobo$60bo158bo5bo6bo129b2o54bobo4bo6b2o5bo2bo$225bo5bo119b3o17b5o43bo11b4o8bo$219bo4bo37b4o84b5o15bo4bo55b2ob2o3bo3bo$221b2o38bo3bo84b3ob2o19bo8b2o20b5o22b2o5b4o$265bo87b2o15bo3bo8b4o18bo4bo$261bo2bo93b2o12bo10b2ob2o22bo$358b2o25b2o18bo3bo23b2o$238b3o116b2o48bo23bo4bo$240bo22b2o93bo3b2o7b2o64bo$239bo21bo4bo90bo4b2o6bo2bo7b2o48bo5bo$267bo101b2o7bob8o37bo6b6o7b3o$261bo5bo36bo2bo62bo7bo8bo35bo3bo16b5o$262b6o40bo60b2o9bo6bo40bo15b3ob2o$288b2o14bo3bo51bobo23bo36bo4bo18b2o7bo2bo$284b4ob2o7bo6b4o52b2o20b2o39b5o11bo19bo$246b3o35b6o6bo3bo60bo77b4o13bo3bo$248bo19b4o13b4o12bo75b4o57b2o2bo14b4o$247bo7b2o9b7o6b2o15bo4bo74b6o58bob2o5bo$256bo7b3ob3ob2o2b3ob2o15b5o74b4ob2o48b2o8bo6bob2o$256bobo5bob2o3b2o3b5o30b2o67b2o49b2o8bobo2bo10b3o$242b2o4b2o6bo2bo17b3o29b2ob2o128b2o2bo9b5o$244bo3b2o7b2o9b2o18b2o19b4o39bobo91b2obo5b4ob2o$244bo26bo5bo8b2ob5o16b2o41b2o94bo2b2o5b2o$237bo6b2o26bo3bo9b2o4bobo7b3o5bo42bo94bo$235bo3bo5bo22bo3bo4bo8b2obo5bo5bob2o3bo3bo$240bo16b3o9b4o14b3o3bobo5bo5bo5bo64b2o53bo17b2o$235bo4bo15b5o26b2obo3bo6b3o3bo5bo62b2ob2o50bobo15bo4bo$100b2o115b2o17b5o4b2o9b3ob2o26bob2o10bo3bob6o42bo19b4o52b2o21bo$94b2o5b2o113b2o25bo4bo10b2o28b3o12bo33b2o16bo20b2o70bo5bo$95b2o3bo117bo30bo53bo30b4ob2o3bobo8bobo59b2o31b6o$94bo148bo5bo84b6o5b2o8bo62b2o$244b6o85b4o6b2o8bo15b2o3bo40bo$101b3o202b2o61b3o4b2o$103bo177bo20b4ob2o41b2o16bo2bo5b2o46bo$102bo179b2o18b6o40b2ob2o15bo7b2o45bobo$217b2o62b2o20b4o41b4o16b2o54b2o24b4o$199b2o14b2ob2o129b2o98bo3bo$199bobo13b4o234bo$99b3o97bo16b2o83bo2bo62bo2bo37b6o35bo2bo$101bo114bo77b2o9bo65bo6b2o27bo5bo$100bo109b2o2bo3bo72b3ob2o4bo3bo61bo3bo4b2ob2o32bo19bo4b2o$210b2obo5bo53bo17b5o6b4o62b4o4b4o27bo4bo19bobo3b2o9b2o$210b4o5bo54b2o16b3o82b2o30b2o20bo3bo12bo2bo$214b6o53b2o147b4o5bo3bo12bo2bo$421bo3bo5bo3bo11b2ob2o$295bo4b2o123bo5bo2bo13b2o$292b4o3b2ob2o117bo2bo8bo$277b2o12b5o4bo2bo$276b2o12bo9bo2bo$278bo12b2o8b2o140b2o5b4o$271b2o19bo148b2ob2o3bo3bo$271b2o168b4o8bo$294b2o5bo2bo137b2o5bo2bo$293b4o8bo$293b2ob2o3bo3bo$268b5o22b2o5b4o$267bo4bo$272bo$267bo3bo$269bo2$266bo2bo$270bo$266bo3bo$267b4o3$140b2o$134b2o5b2o130b2o5b4o$135b2o3bo130b2ob2o3bo3bo$134bo136b4o8bo$272b2o5bo2bo$141b3o$143bo134bo$142bo109b4o17bo3bo2bo$251bo3bo16b2o7bo$255bo17b2o6bo$251bo2bo19b2o4b2o$139b3o106bo9bobo18bo$141bo96b6o4bo9bo2bo14b2o$140bo96bo5bo$243bo15b3o$237bo4bo37b4o$239b2o38bo3bo$283bo$279bo2bo$255b3o$257bo$256bo24b2o$279bo4bo$285bo$279bo5bo$280b6o$316b4o$263b3o49bo3bo$240bobo22bo53bo$241b2o21bo21b4o25bo2bo$241bo40b9o$272b2o7bo2bob3ob2o29b2o5bo2bo$272b3o5bo3b2o3b2o29b4o8bo$264b2o5bo2b2o5b3o36b2ob2o3bo3bo$264b2o6b3o11b2o34b2o5b4o$273bo15bo$255bo34bo$253bo3bo28bo3bo9bo2bo21b2o$258bo16b3o9b4o13bo11b2o3b3o4bo$253bo4bo15b5o21bo3bo7b2o6b5o4b2o$180b2o72b5o4b2o9b3ob2o21b4o8b3o4bob2o6bo$174b2o5b2o78bo4bo10b2o9b2o24bo4b2o9bo$175b2o3bo86bo18bo4bo27b2o5bo2bo$174bo86bo5bo24bo26b2o6bo$247b2o13b6o18bo5bo$181b3o55b2o5b4o37b6o7b2o26bo2bo$183bo46bo6b2ob2o4b2ob2o48bobo30bo$182bo45bo8b4o7b2o51bo26bo3bo$228b2obo6b2o89b4o$229bobo12bo$212b2o17bo10bo$179b3o28bo4bo12bobobo9bo2b2o$181bo34bo10bo2bobo8bo5bo$180bo20b2o6bo6bo10bo2b2o10bobo2b2o59b2o$200bo8b8o25bo3b2o59bobo19b6o$210b2o21b2o9b3o62bo18bo5bo$201bo2bo28b2o99bo$202bobo123bo4bo$214b2o31b2o81b2o$212b2ob2o29b4o$212b4o30b2ob2o65b2o12bobo$213b2o33b2o4b2o61b2o10bo2bo5b2o$253b4o57b2o13b2o3b4ob2o$253b2ob2o57b2o3b3o5bo6b5o$255b2o47b2o6bo7b2o7b2o5b3o$303bo9b2obo2b2o8b2ob2o$248bo55b2o8bobo2bo$247b6o62bobo18b4o$246bo3b8o77bo3bo$247b2o8bo45b5o31bo$248b3o6bo44bo4bo18b2o7bo2bo$249b2o5bo20bo29bo15b3ob2o$253b2o23b2o22bo3bo16b5o$277b2o25bo6b6o7b3o$210b3o97bo5bo$316bo$210bo99bo4bo$312b2o2$308b2o5bo2bo$207b2obo96b4o8bo$206bo3bo3b2o91b2ob2o3bo3bo$215b2o92b2o5b4o$205bo8bo$205bob2o96bo$205bo4bo10b3o63bo2bo13b2o$207bo3bo11bo67bo11bob2o7b2o$207b2ob2o10bo64bo3bo11bobo7bo2b2o$210b2o76b4o11b2o3bo3b3o2bo$265b2o8b2o28bob3o2bo4bo$263bo4bo4bo4bo33b5o$219b3o47bo9bo33b2o$221bo41bo5bo3bo5bo$220bo43b6o4b6o14bo20bo2bo$292b2o25bo$315bo3bo$316b4o$291b2o$290bobo$292bo3$316b6o$315bo5bo$321bo$299b2o14bo4bo$298bobo16b2o$300bo$317bobo$316bo2bo5b2o$316b2o3b4ob2o$306b2ob2o4bo6b5o$299b2o5b2ob3o4b2o5b3o$299b2o5b2o2bo5b2ob2o$307b3o$308bo14b4o$322bo3bo$290b5o31bo$289bo4bo18b2o7bo2bo$294bo15b3ob2o$289bo3bo16b5o$291bo6b6o7b3o$297bo5bo$260bo27b2o13bo$261b2o24b4o6bo4bo$260b3o24b2ob2o7b2o$264bo24b2o$264bo$285bo$283bo$279bo3bo2b2o$259b3o13bo2b3obo5bo$261bo12bob5o2bobo2b2o$260bo12b2ob2o5bo3b2o$274bo2bo7b3o2$275b2o$288b2o$279b4o4b4o15b2o$278bo3bo4b2ob2o10b4ob2o7bo$282bo6b2o11b6o6bo3bo$278bo2bo21b4o12bo$297b2o15bo4bo$294b3ob2o15b5o$294b5o5bo24b2o$295b3o5b3o21b2ob2o$302bo2bo21b4o$302bo3bo12b2o7b2o$303b4o12b2o7bo$303bo2b2ob3o5bo8bo3bo$307b3o5b2o8bo5bo$307b3o6b3o6bo5bo$307b2o8bobo6b6o$306b2o4$324b2o$320b4ob2o$298bo21b6o$299b2o20b4o$298b2o3$321b2o$320b4o$320b2ob2o$279b4o7bo6bo24b2o$278b6o7b2o4bo$278b4ob2o5b2o26bo$282b2o32bo$312bo3bo2b2o$293b2o13bo2b3obo5bo$292b4o11bob5o2bobo2b2o$292b2ob2o9b2ob2o5bo3b2o$294b2o11bo2bo7b3o2$308b2o$321b2o$312b4o4b4o$311bo3bo4b2ob2o$315bo6b2o$311bo2bo!">Pufferfish Breeder</option>
            <option value="133bo$134bo$130bo3bo$131b4o3$130bo$131bo$132bo$132bo$131b2o4$133bo$134bo$130bo3bo$131b4o9$96bo$97bo$93bo3bo$94b4o8$3bo$4bo$o3bo$b4o!">Riley's Breeder</option>
          </optgroup>
          <optgroup label="Oscillators">
            <option value="2b3o3b3o$$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o$$2b3o3b3o$o4bobo4bo$o4bobo4bo$o4bobo4bo$$2b3o3b3o!">Pulsar</option>
            <option value="6ob2o$6ob2o$7b2o$2o5b2o$2o5b2o$2o5b2o$2o$2ob6o$2ob6o!">Kok's Galaxy</option>
            <option value="10o!">Pentadecathlon</option>
            <option value="11b2o11b2o$11b2o11b2o$$$6bo23bo$5bobo5bo9bo5bobo$4bo2bo5bob2o3b2obo5bo2bo$5b2o10bobo10b2o$15bobobobo$16bo3bo$$2o33b2o$2o33b2o$5b2o23b2o$$6bobo19bobo$6bo2bo17bo2bo$7b2o19b2o$$7b2o19b2o$6bo2bo17bo2bo$6bobo19bobo$$5b2o23b2o$2o33b2o$2o33b2o$$16bo3bo$15bobobobo$5b2o10bobo10b2o$4bo2bo5bob2o3b2obo5bo2bo$5bobo5bo9bo5bobo$6bo23bo$$$11b2o11b2o$11b2o11b2o!">124P37</option>
            <option value="16bo12bo$9b2o24b2o$8b3o3b2o14b2o3b3o$14b2ob2o8b2ob2o$16bo12bo4$2bo40bo$b2o40b2o$b2o40b2o4$2b2o38b2o$2b2o38b2o$o3bo36bo3bo$3bo38bo$3bo38bo9$3bo38bo$3bo38bo$o3bo36bo3bo$2b2o38b2o$2b2o38b2o4$b2o40b2o$b2o40b2o$2bo40bo4$16bo12bo$14b2ob2o8b2ob2o$8b3o3b2o14b2o3b3o$9b2o24b2o$16bo12bo!">104P177</option>
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
            <option value="20b3o17b3o26bo4b3o17b3o17b3o$15b2ob2obo19bob2ob2o20b3o2bo2bo12b2ob2obo19bob2ob2o$15b2o4bob2o13b2obo4b2o13b3o4bob2o4bo12b2o4bob2o13b2obo4b2o$14bo2bo3bobobo11bobobo3bo2bo11bo2bo5b4o3bo11bo2bo3bobobo11bobobo3bo2bo$21bobobob2o5b2obobobo21bo5b3o4bo18bobobob2o5b2obobobo$19bo3bobob2o5b2obobo3bo15bo3bo9bobo17bo3bobob2o5b2obobo3bo$20bobobob3o5b3obobobo16bo3bo30bobobob3o5b3obobobo$63bo4bo$24b3o9b3o21bobo5bo29b3o9b3o$24b3obobobobob3o29bo29b3obobobobob3o$25b5obob5o61b5obob5o$30bobo35bo35bobo$30b3o35bo35b3o$27bobo3bobo32bo32bobo3bobo2$25b2ob3ob3ob2o30bo30b2ob3ob3ob2o$25bo11bo30bo30bo11bo$24bo2bo7bo2bo29bo29bo2bo7bo2bo$24bo4bo3bo4bo59bo4bo3bo4bo$29bo3bo34bo34bo3bo$23b6o5b6o28bo28b6o5b6o$22b2o7bo7b2o27bo27b2o7bo7b2o$30bobo71bobo$30b3o12bo9bo12bo12bo9bo12b3o$43b4o7b4o10bo10b4o7b4o$19bo19b2ob2o3bo5bo3b2ob2o6bo6b2ob2o3bo5bo3b2ob2o19bo$17b4o18b2o2bo3bo5bo3bo2b2o13b2o2bo3bo5bo3bo2b2o18b4o$13b2ob2o3bo3bo12bo2bo7bobo7bo2bo11bo2bo7bobo7bo2bo12bo3bo3b2ob2o$13b2o2bo5b4o19bo2bobo2bo27bo2bobo2bo19b4o5bo2b2o$12bo2bo7bo3bo17b3obobob3o25b3obobob3o17bo3bo7bo2bo$21bo2bobo83bobo2bo$22bo7b3o14b2o3b2o29b2o3b2o14b3o7bo$33b2o12b2o3b2o29b2o3b2o12b2o$29bo4bo12bobobobo29bobobobo12bo4bo$29bo4bo11b2obobob2o27b2obobob2o11bo4bo$29bo3bo12b2obobob2o27b2obobob2o12bo3bo$31bo17bobo33bobo17bo$45bo9bo25bo9bo$46bo7bo27bo7bo3$45bo45bo$46b2o41b2o$45b2o43b2o26$8b3o17b3o$3b2ob2obo19bob2ob2o$3b2o4bob2o13b2obo4b2o$2bo2bo3bobobo11bobobo3bo2bo$9bobobob2o5b2obobobo28bobo15bobo$7bo3bobob2o5b2obobo3bo27b2o15b2o$8bobobob3o5b3obobobo28bo17bo2$12b3o9b3o$12b3obobobobob3o21b3o35b3o$13b5obob5o18bob2o3bo33bo3b2obo$18bobo22b3o3b3o2b3o23b3o2b3o3b3o$18b3o21bo3bo4b3obobo21bobob3o4bo3bo$15bobo3bobo19bo7bo4bo23bo4bo7bo$52b2o29b2o$13b2ob3ob3ob2o$13bo11bo$12bo2bo7bo2bo$12bo4bo3bo4bo$17bo3bo75b3o17b3o$11b6o5b6o64b2ob2obo19bob2ob2o$10b2o15b2o63b2o4bob2o13b2obo4b2o$19bo71bo2bo3bobobo11bobobo3bo2bo$17b2ob2o11bo9bo54bobobob2o5b2obobobo$18bobo10b4o7b4o50bo3bobob2o5b2obobo3bo$7bo11bo7b2ob2o3bo5bo3b2ob2o47bobobob3o5b3obobobo$5b4o18b2o2bo3bo5bo3bo2b2o$b2ob2o3bo3bo12bo2bo7bobo7bo2bo50b3o9b3o$b2o2bo5b4o19bo2bobo2bo58b3obobobobob3o$o2bo7bo3bo17b3obobob3o58b5obob5o$9bo2bobo51b2ob2o36bobo$10bo24b2o3b2o24b2ob2o36b3o$35b2o3b2o62bobo3bobo$22b2o11bobobobo$17b2o4b2o9b2obobob2o59b2ob3ob3ob2o$17b2o3b2o10b2obobob2o59bo11bo$17b2o3bo14bobo61bo2bo7bo2bo$33bo9bo57bo4bo3bo4bo$34bo7bo63bo3bo$100b6o5b6o$99b2o7bo7b2o$107bobo$84bo9bo12b3o$82b4o7b4o$78b2ob2o3bo5bo3b2ob2o19bo$78b2o2bo3bo5bo3bo2b2o18b4o$77bo2bo7bobo7bo2bo12bo3bo3b2ob2o$85bo2bobo2bo19b4o5bo2b2o$66b2ob2o13b3obobob3o17bo3bo7bo2bo$66b2ob2o42bobo2bo$86b2o3b2o14b3o7bo$86b2o3b2o12b2o$86bobobobo12bo4bo$85b2obobob2o11bo4bo$85b2obobob2o12bo3bo$88bobo17bo$84bo9bo$85bo7bo2$40bobo$41b2o51bo$41bo50b2o$93b2o4$66b2ob2o$66b2ob2o17$66b2ob2o$66b2ob2o5$54bo$55b2o$54b2o23bobo$79b2o$80bo8$66b2ob2o$66b2ob2o!">Moving Sawtooth</option>
          </optgroup>
        </select>
      </span>
      <span class="controls">
        <label for="size-input">Zoom</label>
        <input id="size-input" type="range" v-model.number="size" min="1" max="20">
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
import { pair, successor, encode, decode, RLE_RE } from './life.js'
import Swal from 'sweetalert2'

export default {
  name: 'app',
  data() {
    return {
      cells: new Set(),
      size: 12,
      speed: 2,
      generation: 0,
      generationTime: null,
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
    handleWheel(evt) {
      if (evt.deltaY < 0)
        this.size = Math.max(this.size - 1, 1)
      else
        this.size = Math.min(this.size + 1, 20)
    },
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
      this.generationTime = null
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
      Swal({
        title: 'Save Pattern',
        text: 'Current pattern in RLE format:',
        input: 'text',
        inputValue: encode(this.cells)
      })
    },
    load(rle) {
      if (rle) {
        const cells = decode(rle)
        this.clear()
        this.cells = cells
        this.$refs.lifeGrid.center()
      }
    },
    loadPrompt() {
      Swal({
        title: 'Load Pattern',
        text: 'Enter pattern RLE:',
        input: 'text',
        inputPlaceholder: 'b2o$2o$bo!',
        showCancelButton: true,
        inputValidator(value) {
          if (!RLE_RE.test(value))
            return 'Invalid RLE format, please check your input.'
        }
      }).then(({ value }) => {
        this.load(value)
      })
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
  mounted() {
    window.addEventListener('wheel', this.handleWheel)
  },
  beforeDestroy() {
    window.removeEventListener('wheel', this.handleWheel)
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
  align-items: flex-end;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  content: "|";
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
