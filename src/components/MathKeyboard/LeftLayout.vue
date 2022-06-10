<template>
  <GridLayout :buttons="buttons" :cols="1" :rows="4" />
</template>

<script setup lang="ts">
import GridLayout from "./GridLayout.vue";
import { parseLayout } from "./button-repo";

const buttons = parseLayout([
  { name: "calculator", type: "primary", class: "page" },
  { name: "calculator-2", class: "page" },
  [{ name: "english-letters", class: "page" }, "greek-letters"],
  "about",
]);
</script>
