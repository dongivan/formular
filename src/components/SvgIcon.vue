<template>
  <svg class="svg-icon" :style="{ width: iconSize, height: iconSize }">
    <use :xlink:href="iconNameRef"></use>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from "vue";
const props = defineProps({
  name: { type: String, required: true },
  iconSize: { type: String, default: "1em" },
});

const iconNameRef = computed(() => {
  return `#svg-icon-${props.name}`;
});
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
