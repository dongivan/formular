<template>
  <GridLayout :buttons="buttons" :cols="7" :rows="1" />
</template>

<script setup lang="ts">
import GridLayout from "./GridLayout.vue";
import { parseLayout } from "./button-repo";

const buttons = parseLayout([
  [{ name: "calculator", type: "primary", class: "page" }, "calculator-2"],
  [{ name: "english-letters", class: "page" }, "greek-letters"],
  ["undo", "redo"],
  "move-left",
  "move-right",
  { name: "backspace", type: "danger" },
  { name: "execute", type: "primary" },
]);
</script>
