<template>
  <PadButton
    :button="refButton"
    :children="refChildren"
    :sub-icon="refSubIcon"
    :active="refIsActive"
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
const refIndex = computed(() => {
  return props.data.buttons.findIndex(
    (btn) => btn.commands[0] == props.currentPageName
  );
});
const refIsActive = computed(() => {
  return refIndex.value > -1;
});
const refButton = computed(() => {
  return props.data.buttons[refIsActive.value ? refIndex.value : 0];
});
const refSubIcon = computed(() => {
  if (props.data.buttons.length == 2) {
    return props.data.buttons[refIndex.value == 1 ? 0 : 1].icon;
  }
  return undefined;
});
const refChildren = computed(() => {
  return props.data.buttons.length == 1 ? undefined : props.data.buttons;
});
function handleClick(commands: string[]) {
  emit("change-page", commands[0]);
}
</script>
