<template>
  <template v-for="button of buttons" :key="`menu-${button.name}`">
    <PageButton
      v-if="`buttons` in button"
      :data="button"
      :current-page-name="currentPage"
      @change-page="handlePageChange"
    />
    <PadButton
      v-else
      :button="button"
      :children="button.children"
      @click="handleButtonClick"
    />
  </template>
</template>

<script setup lang="ts">
import { IconButtonType, PageButtonType } from "./buttons";
import { PropType } from "vue";
import PadButton from "./PadButton.vue";
import PageButton from "./PageButton.vue";

defineProps({
  buttons: {
    type: Object as PropType<(PageButtonType | IconButtonType)[]>,
    required: true,
  },
  currentPage: { type: String, default: "" },
});

const emit = defineEmits<{
  (event: "click", command: [string, ...string[]]): void;
  (event: "change-page", page: string): void;
}>();

function handlePageChange(page: string) {
  emit("change-page", page);
}

function handleButtonClick(commands: [string, ...string[]]) {
  emit("click", commands);
}
</script>
