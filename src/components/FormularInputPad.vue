<template>
  <div class="formular-input-pad">
    <div class="menu"></div>
    <div class="buttons">
      <button
        v-for="(button, name) in buttonsMapRef"
        :key="`button-${name}`"
        :class="`button-${name}`"
        :style="buttonsPositionStyleRef[name]"
        @click="emit('key-pressed', button.value)"
      >
        <SvgIcon v-if="button.icon" :name="button.icon" />
        <templave v-else>
          {{ button.label || button.name || button.value.toString() }}
        </templave>
      </button>
    </div>
    <div class="controls"></div>
  </div>
</template>

<script lang="ts">
type InputButton = {
  value: string | number;
  icon?: string;
  label?: string;
  name?: string;
};

type ButtonPosition = [[number, number], [number, number]];

const defaultButtonsMap: Record<string, InputButton> = {};
const defaultButtonsPosition: Record<string, ButtonPosition> = {};

const parsePosition: (
  position: [number, number] | [[number, number], [number, number]]
) => ButtonPosition = function (position) {
  let pos = position,
    span: [number, number] = [1, 1];
  if (Array.isArray(pos[0])) {
    [pos, span] = position as [[number, number], [number, number]];
  } else {
    pos = pos as [number, number];
  }
  return [pos, span];
};

const addButton = function (
  button: InputButton | string | number,
  position: ButtonPosition | [number, number],
  icon?: string
) {
  let name, label, value;
  if (typeof button == "object") {
    ({ name, label, value } = button);
    icon = icon || button.icon;
  } else {
    value = button;
    name = label = button.toString() as string;
  }
  name = name || value.toString();
  defaultButtonsMap[name] = { name, label, value, icon };
  defaultButtonsPosition[name] = parsePosition(position);
};

Array.from({ length: 9 }).forEach((_, i) => {
  addButton(i + 1, [3 - Math.floor(i / 3), (i % 3) + 1], `number-${i + 1}`);
});
addButton(".", [4, 1]);
addButton(0, [4, 2], "number-0");
addButton("infy", [4, 3], "operator-infinity");
</script>

<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "./SvgIcon.vue";

const emit = defineEmits(["key-pressed"]);

const buttonsMapRef = computed(() => {
  return defaultButtonsMap;
});
const buttonsPositionRef = computed(() => {
  return defaultButtonsPosition;
});
const buttonsPositionStyleRef = computed(() => {
  const styles: {
    [name: string]: { gridRow: string; gridColumn: string };
  } = {};
  Object.keys(buttonsMapRef.value).forEach((name) => {
    const [position, span] = buttonsPositionRef.value[name];
    styles[name] = {
      gridRow: `${position[0]} / span ${span[0]}`,
      gridColumn: `${position[1]} / span ${span[1]}`,
    };
  });
  return styles;
});
</script>

<style lang="scss" scoped>
.formular-input-pad {
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
}
</style>
