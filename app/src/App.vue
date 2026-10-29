<template><main><h1>BrewAssist</h1><p>Step {{ s.step }}</p></main></template>
<script setup lang="ts">import { useBrewStore } from './stores/brew'; const s = useBrewStore()</script>
