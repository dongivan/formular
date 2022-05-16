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
    const styles: Record<string, string | number> = {
      width: `${props.scale}rem`,
      height: `${props.scale}rem`,
    };
    if (props.flip) {
      styles["transform"] = "scale(-1,1)";
    }
    return styles;
  });
</script>
