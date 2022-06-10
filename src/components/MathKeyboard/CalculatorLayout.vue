<template>
  <GridLayout :buttons="buttons" :cols="7" :rows="4" />
</template>

<script setup lang="ts">
import GridLayout from "./GridLayout.vue";
import { parseLayout } from "./button-repo";

const buttons = parseLayout([
  "factorial",
  ["x", "y", "k"],
  "fraction",
  "7",
  "8",
  "9",
  "plus",
  ["combination", "permutation", "factorial"],
  ["sum", "prod"],
  ["square", "cube", "power"],
  "4",
  "5",
  "6",
  "minus",
  ["i-integral", "d-integral", "differential"],
  ["lower-pi", "pi-square-root", "2pi-square-root"],
  ["square-root", "cube-root", "root"],
  "1",
  "2",
  "3",
  "times",
  ["ln", "lg", "log"],
  ["e", "exp", "exp-square"],
  "limit",
  ["point", "left-paren"],
  "0",
  ["infinity", "right-paren"],
  "divide",
]);
</script>
