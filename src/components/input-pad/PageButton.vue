<template>
  <PadButton
    :button="buttonRef"
    :children="childrenRef"
    :sub-icon="subIconRef"
    :active="isActiveRef"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { PageButtonType } from "./buttons";
import { computed, PropType } from "vue";
import PadButton from "./PadButton.vue";

const props = defineProps({
  data: { type: Object as PropType<PageButtonType>, required: true },
  currentPageName: { type: String, default: undefined },
});
const emit = defineEmits<{
  (event: "change-page", page: string): void;
}>();
const indexRef = computed(() => {
  return props.data.buttons.findIndex(
    (btn) => btn.commands[0] == props.currentPageName
  );
});
const isActiveRef = computed(() => {
  return indexRef.value > -1;
});
const buttonRef = computed(() => {
  return props.data.buttons[isActiveRef.value ? indexRef.value : 0];
});
const subIconRef = computed(() => {
  if (props.data.buttons.length == 2) {
    return props.data.buttons[indexRef.value == 1 ? 0 : 1].icon;
  }
  return undefined;
});
const childrenRef = computed(() => {
  return props.data.buttons.length == 1 ? undefined : props.data.buttons;
});
function handleClick(commands: string[]) {
  emit("change-page", commands[0]);
}
</script>
