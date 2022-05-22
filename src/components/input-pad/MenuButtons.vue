<template>
  <template v-for="button of buttons" :key="`menu-${button.name}`">
    <PageButton
      v-if="`buttons` in button"
      :data="button"
      :current-page-name="currentPage"
    />
    <CommandButton v-else :button="button" />
  </template>
</template>

<script setup lang="ts">
import { IconButtonType, PageButtonType } from "./buttons";
import { PropType } from "vue";
import CommandButton from "./CommandButton.vue";
import PageButton from "./PageButton.vue";

defineProps({
  buttons: {
    type: Object as PropType<(PageButtonType | IconButtonType)[]>,
    required: true,
  },
  currentPage: { type: String, default: "" },
});
</script>
