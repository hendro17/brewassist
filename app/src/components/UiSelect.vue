<template>
  <SelectRoot :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <SelectTrigger :id="id" :aria-label="label" class="border p-2 w-full flex justify-between items-center bg-white">
      <SelectValue :placeholder="placeholder" />
      <span aria-hidden="true">▾</span>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent class="bg-white border shadow-md z-50 max-h-60 overflow-auto">
        <SelectViewport>
          <SelectItem v-for="o in options" :key="o" :value="o" class="p-2 cursor-pointer data-[highlighted]:bg-gray-100">
            <SelectItemText>{{ o }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
<script setup lang="ts">
import { SelectRoot, SelectTrigger, SelectValue, SelectPortal, SelectContent, SelectViewport, SelectItem, SelectItemText } from 'reka-ui'
defineProps<{ id: string; label: string; modelValue: string; options: readonly string[]; placeholder?: string }>()
defineEmits(['update:modelValue'])
</script>
