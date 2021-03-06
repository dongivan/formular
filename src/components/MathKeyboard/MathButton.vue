<template>
  <component
    :is="refComponent"
    :value="props.button.value"
    :children="props.button?.children?.map < string > ((child) => child.value)"
    :style="refSpanStyle"
    :badge="props.button.badge || 'auto'"
    :css="btnCss"
  >
    <SvgIcon
      :name="props.button.icon.name"
      :flip="props.button.icon.flip"
      :scale="props.button.icon.scale"
    />
    <template
      v-for="child of props.button?.children"
      :key="child.icon.name"
      #[`btn-${child.value}`]
    >
      <SvgIcon
        :name="child.icon.name"
        :flip="child.icon.flip"
        :scale="child.icon.scale"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import { KeyButton, PageButton, ShiftButton } from "@dongivan/virtual-keyboard";
import { MathButton } from "./button-repo";
import SvgIcon from "../SvgIcon.vue";
import { computed } from "vue";

type PropsType = {
  button: MathButton;
};
const props = defineProps<PropsType>();
const refComponent = computed(
  () =>
    ({
      key: KeyButton,
      page: PageButton,
      shift: ShiftButton,
    }[props.button.class || "key"])
);
const refSpanStyle = computed(() => ({
  ...(props.button.rowspan
    ? { gridRowEnd: `span ${props.button.rowspan}` }
    : undefined),
  ...(props.button.colspan
    ? { gridColumnEnd: `span ${props.button.colspan}` }
    : undefined),
}));
const BUTTON_TYPES = {
  default: {
    hover: "!bg-gray-300",
    active: "!bg-gray-400",
    focus: "outline-none !bg-gray-300 ring-gray-200",
  },
  primary: {
    default: "!bg-blue-400",
    hover: "!bg-blue-500",
    active: "!bg-blue-600",
    focus: "outline-none !bg-blue-500 ring-blue-300",
  },
  danger: {
    default: "!bg-red-400",
    hover: "!bg-red-500",
    active: "!bg-red-600",
    focus: "outline-none !bg-red-500 ring-red-300",
  },
  warning: {
    default: "!bg-amber-400",
    hover: "!bg-amber-500",
    active: "!bg-amber-600",
    focus: "outline-none !bg-amber-500 ring-amber-300",
  },
};
const btnCss = computed(() => {
  return {
    ...BUTTON_TYPES[props.button.type || "default"],
  };
});
</script>
