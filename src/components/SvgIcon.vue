<template>
  <svg
    class="inline-block w-4 h-4 fill-current overflow-hidden"
    :style="styleRef"
  >
    <use :xlink:href="iconNameRef"></use>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from "vue";
const props = defineProps({
  name: { type: String, required: true },
  scale: { type: Number, default: 1 },
  flip: { type: Boolean, default: false },
});

const iconNameRef = computed(() => {
    return `#svg-icon-${props.name}`;
  }),
  styleRef = computed(() => {
    const styles: Record<string, string | number> = {};
    const scale = [1, 1];
    if (props.scale != 1) {
      scale[0] = scale[1] = props.scale;
    }
    if (props.flip) {
      scale[0] = -scale[0];
    }
    if (scale[0] != 1 || scale[1] != 1) {
      styles["transform"] = `scale(${scale[0]},${scale[1]})`;
    }
    return styles;
  });
</script>
