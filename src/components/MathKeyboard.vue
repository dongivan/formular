<template>
  <VirtualKeyboard
    class="p-1 flex flex-col sm:flex-row gap-1 sm:w-auto bg-white"
    @key-pressed="handleKeyPressed"
  >
    <LeftLayout class="hidden sm:grid sm:gap-1" />
    <KeyboardPage name="calculator" default>
      <CalculatorLayout />
    </KeyboardPage>
    <KeyboardPage name="calculator-2">
      <Calculator2Layout />
    </KeyboardPage>
    <KeyboardPage name="english-letters">
      <EnglishLayout />
    </KeyboardPage>
    <KeyboardPage name="greek-letters">
      <GreekLayout />
    </KeyboardPage>
    <RightLayout class="hidden sm:grid sm:gap-1" />
    <BottomLayout class="flex gap-1 sm:hidden" />
  </VirtualKeyboard>
</template>

<script setup lang="ts">
import { VirtualKeyboard, KeyboardPage } from "@dongivan/virtual-keyboard";
import CalculatorLayout from "./MathKeyboard/CalculatorLayout.vue";
import Calculator2Layout from "./MathKeyboard/Calculator2Layout.vue";
import EnglishLayout from "./MathKeyboard/EnglishLayout.vue";
import GreekLayout from "./MathKeyboard/GreekLayout.vue";
import LeftLayout from "./MathKeyboard/LeftLayout.vue";
import RightLayout from "./MathKeyboard/RightLayout.vue";
import BottomLayout from "./MathKeyboard/BottomLayout.vue";

const emit = defineEmits<{
  (event: "click", command: [string, ...string[]]): void;
}>();

const handleKeyPressed = (name: string) => {
  emit("click", name.trim().split(/,[ ]*/) as [string, ...string[]]);
};
</script>

<style lang="scss" scoped>
:deep() {
  .vk-btn {
    @apply \!relative \!select-none \!min-w-[calc((100vw-0.25rem)/7-0.25rem)] \!sm:min-w-[3rem] \!w-full \!min-h-[max(calc((100vw-0.25rem)/7-0.25rem),3rem)] \!sm:min-h-[3rem] \!h-full \!text-center \!sm:text-base \!rounded-md;

    &.default {
      @apply \!bg-gray-200;
    }
  }

  .vk-btn-children {
    @apply \!bg-gray-200 \!z-10;
  }
}
</style>
