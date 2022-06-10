<template>
  <GridLayout :buttons="buttons" :cols="7" :rows="4" />
</template>

<script setup lang="ts">
import GridLayout from "./GridLayout.vue";
import { parseLayout, greeks, varGreeks } from "./button-repo";

const buttons = parseLayout([
  ...greeks.map<[{ name: string; badge: "hide" }, ...string[]]>((char) => [
    { name: `lower-${char}`, badge: "hide" },
    `upper-${char}`,
    ...(varGreeks.includes(char) ? [`var-${char}`] : []),
  ]),
  undefined,
  undefined,
  { name: "shift", colspan: 2, class: "shift", type: "warning" },
]);
</script>
