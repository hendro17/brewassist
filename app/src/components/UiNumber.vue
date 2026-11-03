<template>
  <NumberFieldRoot :model-value="modelValue" :min="min" :max="max" @update:model-value="$emit('update:modelValue', $event ?? min)" class="w-full">
    <NumberFieldInput :id="id" :aria-label="label" class="border p-2 w-full" />
  </NumberFieldRoot>
</template>
<script setup lang="ts">
import { NumberFieldRoot, NumberFieldInput } from 'reka-ui'
defineProps<{ id: string; label: string; modelValue: number; min?: number; max?: number }>()
defineEmits(['update:modelValue'])
</script>
