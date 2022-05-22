<template>
  <div class="p-1 flex flex-col sm:flex-row gap-1 sm:w-auto bg-white">
    <div class="hidden sm:grid sm:gap-1" :style="menuGridStyles">
      <MenuButtons
        :buttons="leftMenuButtons"
        :current-page="refCurrentPageName"
      />
    </div>
    <div class="grid gap-1 grid-cols-7 grid-rows-4">
      <CommandButton
        v-for="(button, i) in refCurrentPage"
        :key="`button-${i}`"
        :button="button"
        :children-reverse="
          button.children && button.children.length + button.column > 8
        "
      />
    </div>
    <div class="flex gap-1 sm:hidden">
      <MenuButtons
        :buttons="bottomMenuButtons"
        :current-page="refCurrentPageName"
      />
    </div>
    <div class="hidden sm:grid sm:gap-1" :style="controlGridStyles">
      <CommandButton
        v-for="(button, i) in controlButtons"
        :key="`button-${i}`"
        :button="button"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inputPad } from "./buttons";
import { computed, ref, provide } from "vue";
import CommandButton from "./CommandButton.vue";
import MenuButtons from "./MenuButtons.vue";

const emit = defineEmits<{
  (event: "click", command: [string, ...string[]]): void;
}>();

const menuGridStyles = {
  gridTemplateRows: `repeat(${inputPad.rows}, 1fr)`,
  gridTemplateColumns: "1fr",
  gridAutoRows: "1fr",
};

const controlGridStyles = {
  gridTemplateRows: `repeat(${inputPad.rows}, 1fr)`,
  gridTemplateColumns: `repeat(2, 1fr)`,
};

const bottomMenuButtons = inputPad.bottomMenu;
const leftMenuButtons = inputPad.leftMenu;
const refPages = computed(() => {
  const result: string[] = [];
  [bottomMenuButtons, leftMenuButtons].forEach((menu) => {
    menu.forEach((pageBtn) => {
      if ("buttons" in pageBtn) {
        pageBtn.buttons.forEach((btn) => {
          result.push(btn.commands[0]);
        });
      }
    });
  });
  return Array.from(new Set(result));
});
const refCurrentPageName = ref(refPages.value[0]);

const controlButtons = inputPad.controls;

const refIsShift = ref(false);
const refCurrentPage = computed(() => {
  const page = inputPad.pages[refCurrentPageName.value] || [];
  return (refIsShift.value && page[1]) || page[0];
});

provide("changePage", (name: string) => {
  refCurrentPageName.value = name;
  refIsShift.value = false;
});

provide("runCommands", (commands: [string, ...string[]]) => {
  switch (commands[0]) {
    case "about":
      console.log("about");
      break;
    case "shift":
      refIsShift.value = !refIsShift.value;
      break;
    default:
      emit("click", commands);
  }
});
</script>
