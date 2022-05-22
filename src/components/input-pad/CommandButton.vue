<template>
  <CommonButton
    :button="button"
    :children="button.children"
    :children-reverse="childrenReverse"
    @click="(evt) => runCommands?.(evt.commands)"
  />
</template>

<script setup lang="ts">
import { IconButtonType, PadButtonType } from "./buttons";
import { PropType, inject } from "vue";
import CommonButton from "./CommonButton.vue";

defineProps({
  button: {
    type: Object as PropType<PadButtonType | IconButtonType>,
    required: true,
  },
  childrenReverse: { type: Boolean, default: false },
});

const runCommands =
  inject<(commands: [string, ...string[]]) => void>("runCommands");
</script>
