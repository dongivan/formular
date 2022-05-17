<template>
  <div class="w-max m-1 flex gap-1">
    <div class="grid gap-1" :style="menuGridStyles">
      <IconButton
        v-for="button in menuButtons"
        :key="`button-${button.name}`"
        :data="button"
        :active="button.name == currentPageNameRef"
        @click="handleMenuButtonClick(button)"
      />
    </div>
    <div class="grid gap-1" :style="buttonsGridStyles">
      <PadButton
        v-for="(button, name) in currentPage"
        :key="`button-${name}`"
        :data="button"
        @click="(evt) => emit('key-pressed', evt)"
      />
    </div>
    <div class="grid gap-1" :style="controlGridStyles">
      <PadButton
        v-for="button in controlButtons"
        :key="`button-${button.name}`"
        :data="button"
        @click="(evt) => emit('key-pressed', evt)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconButtonType, inputPad } from "./buttons";
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

const menuButtons = inputPad.menu;
const currentPageNameRef = ref("");
currentPageNameRef.value =
  inputPad.menu
    .map<string>((btn) => btn.value || "")
    .filter((page) => page)[0] || "";
const currentPage = computed(() => {
  return inputPad.buttons.pages[currentPageNameRef.value] || [];
});
const controlButtons = inputPad.control.buttons;

function handleMenuButtonClick(button: IconButtonType) {
  switch (button.value) {
    case "about":
      console.log("about");
      break;

    default:
      if (inputPad.buttons.pages[button.value]) {
        currentPageNameRef.value = button.value;
      }
  }
}
</script>
