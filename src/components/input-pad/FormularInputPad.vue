<template>
  <div class="formular-input-pad">
    <div class="menu"></div>
    <div class="buttons">
      <button
        v-for="(button, name) in padButtonsRef['page-1']"
        :key="`button-${name}`"
        :class="`button-${name}`"
        :style="{
          gridRow: `${button.row + 1} / span ${button.rowSpan || 1}`,
          gridColumn: `${button.col + 1} / span ${button.colSpan || 1}`,
        }"
        @click="emit('key-pressed', button.value)"
      >
        <SvgIcon
          v-if="button.icon"
          :name="button.icon"
          :icon-size="button.iconSize"
        />
        <template v-else>
          {{ button.label || button.name || button.value.toString() }}
        </template>
      </button>
    </div>
    <div class="controls"></div>
  </div>
</template>

<script lang="ts">
import { padButtons as defaultPadButtons } from "./buttons";

export default {};
// const defaultButtonsPosition = buttonPositions;
</script>

<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@/components/SvgIcon.vue";

const emit = defineEmits(["key-pressed"]);

const padButtonsRef = computed(() => {
  return defaultPadButtons;
});
// const buttonsPositionRef = computed(() => {
//   return defaultButtonsPosition;
// });
// const buttonsPositionStyleRef = computed(() => {
//   const styles: {
//     [name: string]: { gridRow: string; gridColumn: string };
//   } = {};
//   Object.keys(padButtonsRef.value).forEach((name) => {
//     if (!buttonsPositionRef.value[name]) {
//       return;
//     }
//     const [position, span] = buttonsPositionRef.value[name];
//     styles[name] = {
//       gridRow: `${position[0]} / span ${span[0]}`,
//       gridColumn: `${position[1]} / span ${span[1]}`,
//     };
//   });
//   return styles;
// });
</script>

<style lang="scss" scoped>
.formular-input-pad {
  width: min-content;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  grid-template-rows: 1fr;
  grid-template-areas: "menu buttons buttons buttons buttons buttons buttons buttons buttons controls controls";

  .menu {
    grid-area: menu;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 4fr;
  }

  .buttons {
    grid-area: buttons;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }

  .controls {
    grid-area: controls;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas:
      "backspace backspace"
      "undo redo"
      "left right"
      "launch launch";
  }

  button {
    height: 3em;
    width: 3em;
    padding: 0;
  }
}
</style>
