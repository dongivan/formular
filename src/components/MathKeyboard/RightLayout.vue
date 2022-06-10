<template>
  <GridLayout :buttons="buttons" :cols="2" :rows="4" />
</template>

<script setup lang="ts">
import GridLayout from "./GridLayout.vue";
import { parseLayout } from "./button-repo";

const buttons = parseLayout([
  { name: "backspace", colspan: 2, type: "danger" },
  "undo",
  "redo",
  "move-left",
  "move-right",
  { name: "execute", colspan: 2, type: "primary" },
]);
</script>
