<template>
  <div class="p-1 flex flex-col sm:flex-row gap-1 sm:w-auto">
    <div class="hidden sm:grid sm:gap-1" :style="menuGridStyles">
      <MenuButtons
        :buttons="leftMenuButtons"
        :current-page="currentPageNameRef"
        @click="handleButtonClick"
        @change-page="handlePageChange"
      />
    </div>
    <div class="grid gap-1 grid-cols-7 grid-rows-4">
      <PadButton
        v-for="(button, i) in currentPageRef"
        :key="`button-${i}`"
        :button="button"
        :children="button.children"
        @click="handleButtonClick"
      />
    </div>
    <div class="flex gap-1 sm:hidden">
      <MenuButtons
        :buttons="bottomMenuButtons"
        :current-page="currentPageNameRef"
        @click="handleButtonClick"
        @change-page="handlePageChange"
      />
    </div>
    <div class="hidden sm:grid sm:gap-1" :style="controlGridStyles">
      <PadButton
        v-for="(button, i) in controlButtons"
        :key="`button-${i}`"
        :button="button"
        @click="(command) => emit('click', command)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inputPad } from "./buttons";
import { computed, ref } from "vue";
import PadButton from "./PadButton.vue";
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
const pagesRef = computed(() => {
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
const currentPageNameRef = ref(pagesRef.value[0]);

const controlButtons = inputPad.controls;

const shiftRef = ref(false);
const currentPageRef = computed(() => {
  const page = inputPad.pages[currentPageNameRef.value] || [];
  return (shiftRef.value && page[1]) || page[0];
});

function handlePageChange(name: string) {
  currentPageNameRef.value = name;
  shiftRef.value = false;
}

function handleButtonClick(commands: [string, ...string[]]) {
  switch (commands[0]) {
    case "about":
      console.log("about");
      break;
    case "shift":
      shiftRef.value = !shiftRef.value;
      break;
    default:
      emit("click", commands);
  }
}
</script>
