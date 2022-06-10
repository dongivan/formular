<template>
  <GridLayout :buttons="buttons" :cols="7" :rows="4" />
</template>

<script setup lang="ts">
import GridLayout from "./GridLayout.vue";
import { parseLayout } from "./button-repo";

const buttons = parseLayout([
  ..."abcdefghijklmnopqrstuvwxyz"
    .split("")
    .map<[{ name: string; badge: "hide" }, ...string[]]>((char) => [
      { name: char, badge: "hide" },
      char.toUpperCase(),
    ]),
  { name: "shift", colspan: 2, class: "shift", type: "warning" },
]);
</script>
