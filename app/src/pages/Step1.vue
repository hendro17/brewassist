<template>
  <section>
    <h1>Step 1 — Bean + Hardware + Target</h1>
    <form @submit.prevent="next">
      <label for="f-roastery">Roastery</label>
      <input id="f-roastery" v-model="f.roastery" placeholder="Roastery" class="border p-2 w-full" />
      <label for="f-origin" class="mt-2 block">Origin</label>
      <input id="f-origin" v-model="f.origin" placeholder="Origin e.g. Gunung Tujuh Kerinci" class="border p-2 w-full" />
      <label for="f-origin-mode" class="mt-2 block">Origin mode</label>
      <select id="f-origin-mode" v-model="f.origin_mode" class="border p-2 w-full"><option value="single">single</option><option value="mix">mix</option></select>
      <label for="f-variety" class="mt-2 block">Variety</label>
      <input id="f-variety" v-model="f.variety" placeholder="Variety e.g. Sigararuntang" class="border p-2 w-full" />
      <label for="f-alt" class="mt-2 block">Altitude masl</label>
      <input id="f-alt" v-model.number="f.altitude_masl" type="number" placeholder="Altitude masl" class="border p-2 w-full" />
      <label for="f-process" class="mt-2 block">Process</label>
      <input id="f-process" v-model="f.process" placeholder="Process" class="border p-2 w-full" />
      <label for="f-roast" class="mt-2 block">Roast level</label>
      <input id="f-roast" v-model="f.roast_level" placeholder="roast: light|light-to-medium|medium|medium-to-dark|dark" class="border p-2 w-full" />
      <label for="f-roast-date" class="mt-2 block">Roast date</label>
      <input id="f-roast-date" v-model="f.roast_date" type="date" class="border p-2 w-full" />
      <label for="f-dripper" class="mt-2 block">Dripper</label>
      <select id="f-dripper" v-model="f.dripper" class="border p-2 w-full"><option v-for="d in DRIPPERS" :key="d" :value="d">{{ d }}</option></select>
      <label for="f-filter" class="mt-2 block">Filter</label>
      <select id="f-filter" v-model="f.filter" class="border p-2 w-full"><option v-for="x in FILTERS" :key="x" :value="x">{{ x }}</option></select>
      <label for="f-grinder" class="mt-2 block">Grinder</label>
      <select id="f-grinder" v-model="f.grinder" class="border p-2 w-full"><option v-for="g in GRINDERS" :key="g" :value="g">{{ g }}</option></select>
      <label for="f-water" class="mt-2 block">Water</label>
      <select id="f-water" v-model="f.water_brand" class="border p-2 w-full"><option v-for="w in WATERS" :key="w" :value="w">{{ w }}</option></select>
      <label for="f-target" class="mt-2 block">Target</label>
      <select id="f-target" v-model="f.target" class="border p-2 w-full"><option>acid</option><option>sweet</option><option>balance</option><option>body</option><option>complex</option><option>clean</option></select>
      <label for="f-dose" class="mt-2 block">Dose g</label>
      <input id="f-dose" v-model.number="f.dose_g" type="number" placeholder="Dose g" class="border p-2 w-full" />
      <button class="bg-black text-white px-4 py-2 mt-3">Next → Recipe</button>
    </form>
  </section>
</template>
<script setup lang="ts">import { reactive } from 'vue'; import { useRouter } from 'vue-router'; import { useBrewStore } from '../stores/brew'
import { GRINDERS, WATERS, FILTERS, DRIPPERS } from '../lib/hardware'
const s = useBrewStore(); const r = useRouter()
const f = reactive({ roastery:'', origin:'', origin_mode:'single', variety:'', altitude_masl:1400, process:'washed', roast_level:'medium', roast_date:'', dripper:'Hario V60', filter:'Cafec T-90', grinder:'1Zpresso J-Ultra', water_brand:'Aqua', target:'balance', dose_g:15 })
function next(){ s.setInputs({...f}); r.push('/s2') }</script>
