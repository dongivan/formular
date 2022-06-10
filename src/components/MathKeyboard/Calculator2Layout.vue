<template>
  <GridLayout :buttons="buttons" :cols="7" :rows="4" />
</template>

<script setup lang="ts">
import GridLayout from "./GridLayout.vue";
import { parseLayout } from "./button-repo";

const buttons = parseLayout([
  ["sin", "arcsin", "sinh"],
  ["x", "y", "z"],
  ["k", "m", "n"],
  "7",
  "8",
  "9",
  "plus",
  ["cos", "arccos", "cosh"],
  "i",
  ["square", "cube", "power"],
  "4",
  "5",
  "6",
  "minus",
  ["tan", "cot", "arctan"],
  ["lower-pi", "pi-square-root", "2pi-square-root"],
  ["square-root", "cube-root", "root"],
  "1",
  "2",
  "3",
  "times",
  ["sec", "csc"],
  ["e", "exp", "exp-square"],
  "limit",
  ["point", "left-paren"],
  "0",
  ["infinity", "right-paren"],
  ["divide", "fraction"],
]);
</script>
