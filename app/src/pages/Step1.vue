<template>
  <section class="max-w-2xl mx-auto space-y-4">
    <h1>Step 1 — Bean + Hardware + Target</h1>
    <form @submit.prevent="next" class="space-y-4">
      <fieldset class="border rounded-lg p-4 space-y-2">
        <legend class="font-bold px-1">Beans</legend>
        <label for="f-roastery">Roastery</label>
        <input id="f-roastery" v-model="f.roastery" placeholder="Roastery" class="border p-2 w-full rounded" />
        <label for="f-origin" class="mt-2 block">Origin</label>
        <input id="f-origin" v-model="f.origin" placeholder="Origin e.g. Gunung Tujuh Kerinci" class="border p-2 w-full rounded" />
        <label for="f-origin-mode" class="mt-2 block">Origin mode</label>
        <UiSelect id="f-origin-mode" label="Origin mode" v-model="f.origin_mode" :options="['single','mix']" />
        <label for="f-variety" class="mt-2 block">Variety</label>
        <input id="f-variety" v-model="f.variety" placeholder="Variety e.g. Sigararuntang" class="border p-2 w-full rounded" />
        <label for="f-alt" class="mt-2 block">Altitude masl</label>
        <UiNumber id="f-alt" label="Altitude masl" v-model="f.altitude_masl" :min="0" :max="3000" />
        <label for="f-process" class="mt-2 block">Process</label>
        <UiSelect id="f-process" label="Process" v-model="f.process" :options="PROCESSES" />
        <label for="f-roast" class="mt-2 block">Roast level</label>
        <UiSelect id="f-roast" label="Roast level" v-model="f.roast_level" :options="['light','light-to-medium','medium','medium-to-dark','dark']" />
        <label for="f-roast-date" class="mt-2 block">Roast date</label>
        <input id="f-roast-date" v-model="f.roast_date" type="date" class="border p-2 w-full rounded" />
      </fieldset>
      <fieldset class="border rounded-lg p-4 space-y-2">
        <legend class="font-bold px-1">Hardware</legend>
        <label for="f-dripper">Dripper</label>
        <UiSelect id="f-dripper" label="Dripper" v-model="f.dripper" :options="DRIPPERS" />
        <label for="f-filter" class="mt-2 block">Filter</label>
        <UiSelect id="f-filter" label="Filter" v-model="f.filter" :options="FILTERS" />
        <label for="f-grinder" class="mt-2 block">Grinder</label>
        <UiSelect id="f-grinder" label="Grinder" v-model="f.grinder" :options="GRINDERS" />
        <label for="f-water" class="mt-2 block">Water</label>
        <UiSelect id="f-water" label="Water" v-model="f.water_brand" :options="WATERS" />
      </fieldset>
      <fieldset class="border rounded-lg p-4 space-y-2">
        <legend class="font-bold px-1">Goal — Result & Expectation Flavour</legend>
        <label for="f-target">Target</label>
        <UiSelect id="f-target" label="Target" v-model="f.target" :options="['acid','sweet','balance','body','complex','clean']" />
        <label for="f-dose" class="mt-2 block">Dose g</label>
        <UiNumber id="f-dose" label="Dose g" v-model="f.dose_g" :min="1" :max="60" />
      </fieldset>
      <button class="bg-black text-white px-4 py-2 rounded w-full">Next → Recipe</button>
    </form>
  </section>
</template>
<script setup lang="ts">import { reactive } from 'vue'; import { useRouter } from 'vue-router'; import { useBrewStore } from '../stores/brew'
import { GRINDERS, WATERS, FILTERS, DRIPPERS, PROCESSES } from '../lib/hardware'
import UiSelect from '../components/UiSelect.vue'
import UiNumber from '../components/UiNumber.vue'
const s = useBrewStore(); const r = useRouter()
const f = reactive({ roastery:'', origin:'', origin_mode:'single', variety:'', altitude_masl:1400, process:'washed', roast_level:'medium', roast_date:'', dripper:'Hario V60', filter:'Cafec T-90', grinder:'1Zpresso J-Ultra', water_brand:'Aqua', target:'balance', dose_g:15 })
function next(){ s.setInputs({...f}); r.push('/s2') }</script>
