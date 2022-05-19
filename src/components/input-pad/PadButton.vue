<template>
  <div
    class="w-full h-full relative"
    :class="{ group: children }"
    :style="gridStyleRef"
  >
    <template v-if="children">
      <div
        class="hidden group-hover:block absolute top-[-0.25rem] left-[-0.25rem] w-[calc((100vw-0.25rem)/7+0.25rem)] sm:w-[calc(100%+0.5rem)] h-[calc((100vw-0.25rem)/7+0.25rem)] sm:h-[calc(100%+0.5rem)] bg-gray-500 -z-10 rounded-b-lg"
      ></div>
      <div
        class="hidden group-hover:flex absolute top-[calc(-100%-0.5rem)] h-full m-w-full box-content p-1 bg-gray-500 z-10 rounded-lg gap-1"
        :style="[childrenPositionRef]"
      >
        <IconButton
          v-for="child of children"
          :key="`btn-${button.commands}-${child.commands}`"
          :data="child"
          @click="emit('click', child.commands)"
        />
      </div>
    </template>
    <IconButton
      :data="button"
      :top-bar="children && children.length > 2"
      :sub-icon="
        subIcon ||
        (children && children.length == 2 ? children[1].icon : undefined)
      "
      :active="active"
      @click="emit('click', button.commands)"
    />
  </div>
</template>

<script setup lang="ts">
import { IconButtonType, IconType, PadButtonType } from "./buttons";
import { computed, PropType } from "vue";
import IconButton from "./IconButton.vue";

const props = defineProps({
  button: {
    type: Object as PropType<PadButtonType | IconButtonType>,
    required: true,
  },
  children: {
    type: Array as PropType<Array<IconButtonType>>,
    default: undefined,
  },
  subIcon: { type: Object as PropType<IconType>, default: undefined },
  active: { type: Boolean, default: false },
});
const emit = defineEmits<{
  (event: "click", commands: [string, ...string[]]): void;
}>();

const gridStyleRef = computed(() => {
  return "row" in props.button
    ? {
        gridRow: `${props.button.row} / span ${props.button.rowSpan || 1}`,
        gridColumn: `${props.button.column} / span ${
          props.button.colSpan || 1
        }`,
      }
    : undefined;
});

const childrenPositionRef = computed(() => {
  if (!props.children || props.children.length <= 1) {
    return {};
  }
  const n = props.children.length;
  return { left: `calc(50% - ((100% + 0.25rem) * ${n} + 0.25rem) / 2)` };
});
</script>
