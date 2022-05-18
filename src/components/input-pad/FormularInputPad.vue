<template>
  <div class="w-max m-1 flex gap-1">
    <div class="grid gap-1" :style="menuGridStyles">
      <IconButton
        v-for="(button, i) in menuButtons"
        :key="`menu-${i}`"
        :data="button"
        :active="button.name == currentPageNameRef"
        @click="handleMenuButtonClick"
      />
    </div>
    <div class="grid gap-1" :style="buttonsGridStyles">
      <PadButton
        v-for="(button, i) in currentPage"
        :key="`button-${i}`"
        :data="button"
        @click="handleButtonClick"
      />
    </div>
    <div class="grid gap-1" :style="controlGridStyles">
      <PadButton
        v-for="(button, i) in controlButtons"
        :key="`button-${i}`"
        :data="button"
        @click="(evt) => emit('key-pressed', evt)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inputPad } from "./buttons";
import { computed, ref } from "vue";
import PadButton from "./PadButton.vue";
import IconButton from "./IconButton.vue";

const emit = defineEmits(["key-pressed"]);

const menuGridStyles = {
  gridTemplateRows: `repeat(${inputPad.rows}, 1fr)`,
  gridTemplateColumns: "1fr",
  gridAutoRows: "1fr",
};
const buttonsGridStyles = {
  gridTemplateRows: `repeat(${inputPad.rows}, 1fr)`,
  gridTemplateColumns: `repeat(${inputPad.buttons.columns}, 1fr)`,
};
const controlGridStyles = {
  gridTemplateRows: `repeat(${inputPad.rows}, 1fr)`,
  gridTemplateColumns: `repeat(${inputPad.control.columns}, 1fr)`,
};

const shiftRef = ref(false);
const menuButtons = inputPad.menu;
const currentPageNameRef = ref("");
currentPageNameRef.value =
  inputPad.menu
    .map<string>((btn) => btn.value || "")
    .filter((page) => page)[0] || "";
const currentPage = computed(() => {
  const page = inputPad.buttons.pages[currentPageNameRef.value] || [];
  return (shiftRef.value && page[1]) || page[0];
});
const controlButtons = inputPad.control.buttons;

function handleMenuButtonClick(value: string) {
  switch (value) {
    case "about":
      console.log("about");
      break;

    default:
      if (inputPad.buttons.pages[value]) {
        shiftRef.value = false;
        currentPageNameRef.value = value;
      }
  }
}

function handleButtonClick(value: string) {
  switch (value) {
    case "shift":
      shiftRef.value = !shiftRef.value;
      break;

    default:
      emit("key-pressed", value);
  }
}
</script>
