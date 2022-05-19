<template>
  <div
    class="w-full h-full relative"
    :class="{ group: data.children }"
    :style="{
      gridRow: `${data.row} / span ${data.rowSpan || 1}`,
      gridColumn: `${data.column} / span ${data.colSpan || 1}`,
    }"
  >
    <template v-if="data.children">
      <div
        class="hidden group-hover:block absolute top-[-0.25rem] left-[-0.25rem] w-[calc((100vw-0.25rem)/8+0.25rem)] h-[calc((100vw-0.25rem)/8+0.25rem)] bg-gray-500 -z-10 rounded-b-lg"
      ></div>
      <div
        class="hidden group-hover:flex absolute top-[calc(-100%-0.5rem)] h-full m-w-full box-content p-1 bg-gray-500 z-10 rounded-lg gap-1"
        :style="[childrenPositionRef]"
      >
        <IconButton
          v-for="child of data.children"
          :key="`btn-${data.commands}-${child.commands}`"
          :data="child"
          @click="emit('click', child.commands)"
        />
      </div>
    </template>
    <IconButton
      :data="data"
      :top-bar="data.children && data.children.length > 2"
      :sub-icon="
        data.children && data.children.length == 2
          ? data.children[1].icon
          : undefined
      "
      @click="emit('click', data.commands)"
    />
  </div>
</template>

<script setup lang="ts">
import { PadButtonType } from "./buttons";
import { computed, PropType } from "vue";
import IconButton from "./IconButton.vue";

const props = defineProps({
  data: { type: Object as PropType<PadButtonType>, required: true },
});
const emit = defineEmits<{
  (event: "click", commands: [string, ...string[]]): void;
}>();

const childrenPositionRef = computed(() => {
  if (!props.data.children || props.data.children.length <= 1) {
    return {};
  }
  const n = props.data.children.length;
  return { left: `calc(50% - ((100% + 0.25rem) * ${n} + 0.25rem) / 2)` };
});
</script>
