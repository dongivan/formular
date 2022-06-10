<template>
  <div class="grid gap-1" :style="refGridStyle">
    <template v-for="(btn, i) of props.buttons" :key="`key-${i}`">
      <MathButton v-if="btn && btn.value" :button="btn" />
      <div v-else></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MathButton as MathButtonType } from "./button-repo";
import MathButton from "./MathButton.vue";

type PropsType = {
  buttons: (MathButtonType | undefined)[];
  rows: number;
  cols: number;
};
const props = defineProps<PropsType>();
const refGridStyle = computed(() => {
  return {
    gridTemplateRows: `repeat(${props.rows}, 1fr)`,
    gridTemplateColumns: `repeat(${props.cols}, 1fr)`,
  };
});
</script>
