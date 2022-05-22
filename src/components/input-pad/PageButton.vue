<template>
  <CommonButton
    :button="refButton"
    :children="refChildren"
    :sub-icon="refSubIcon"
    :active="refIsActive"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { PageButtonType } from "./buttons";
import { computed, PropType, inject } from "vue";
import CommonButton from "./CommonButton.vue";

const props = defineProps({
  data: { type: Object as PropType<PageButtonType>, required: true },
  currentPageName: { type: String, default: undefined },
});

const changePage = inject<(name: string) => void>("changePage");

const refIndex = computed(() => {
    return props.data.buttons.findIndex(
      (btn) => btn.commands[0] == props.currentPageName
    );
  }),
  refIsActive = computed(() => {
    return refIndex.value > -1;
  }),
  refButton = computed(() => {
    return props.data.buttons[refIsActive.value ? refIndex.value : 0];
  }),
  refSubIcon = computed(() => {
    if (props.data.buttons.length == 2) {
      return props.data.buttons[refIndex.value == 1 ? 0 : 1].icon;
    }
    return undefined;
  }),
  refChildren = computed(() => {
    return props.data.buttons.length == 1 ? undefined : props.data.buttons;
  });

function handleClick(commands: string[]) {
  changePage?.(commands[0]);
}
</script>
