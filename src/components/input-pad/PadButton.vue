<template>
  <div
    class="w-full min-w-[3rem] h-full min-h-[3rem] relative"
    :class="{ group: data.children }"
    :style="{
      gridRow: `${data.row} / span ${data.rowSpan || 1}`,
      gridColumn: `${data.col + 1} / span ${data.colSpan || 1}`,
    }"
  >
    <div
      v-if="data.children"
      class="hidden group-hover:block absolute top-[-4px] left-[-4px] w-14 h-14 bg-gray-500 -z-10 rounded-b-lg"
    ></div>
    <div
      v-if="data.children"
      class="hidden group-hover:flex absolute top-[calc(-100%-0.5rem)] h-full m-w-full box-content p-1 bg-gray-500 z-10 rounded-lg gap-1"
      :style="[childrenPositionRef]"
    >
      <IconButton
        v-for="child of data.children"
        :key="`btn-${data.value}-${child.value}`"
        :data="child"
        @click="(payloads) => emit('click', payloads)"
      />
    </div>
    <IconButton
      :data="data"
      :top-bar="data.children && data.children.length > 1"
      @click="emit('click', data.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { PadButton } from "./buttons";
import { computed, PropType } from "vue";
import IconButton from "./IconButton.vue";

const props = defineProps({
  data: { type: Object as PropType<PadButton>, required: true },
});
const emit = defineEmits(["click"]);

const childrenPositionRef = computed(() => {
  if (!props.data.children || props.data.children.length <= 1) {
    return {};
  }
  const n = props.data.children.length;
  return { left: `${1.375 - 1.625 * n}rem` };
});
</script>
