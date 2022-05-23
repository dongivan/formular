<template>
  <button
    ref="refButton"
    class="input-button"
    :class="[`btn-type-${data.type || 'default'}`, { active }]"
    @click="emit('click', data.commands)"
  >
    <div
      v-if="topBar"
      class="absolute top-1 left-1/3 w-1/3 border-t-gray-400 border-t-2"
    ></div>
    <div
      v-if="subIcon"
      class="absolute top-1 right-1 leading-[0] text-gray-500"
    >
      <SvgIcon
        :name="subIcon.name"
        :scale="Math.min((subIcon.scale || 1) * 0.75, 1)"
        :flip="subIcon.flip"
      />
    </div>
    <SvgIcon
      :name="data.icon.name"
      :scale="data.icon.scale"
      :flip="data.icon.flip"
    />
  </button>
</template>

<script setup lang="ts">
import { IconButtonType, IconType } from "./buttons";
import SvgIcon from "@/components/SvgIcon.vue";
import { PropType, ref } from "vue";

defineProps({
  data: { type: Object as PropType<IconButtonType>, required: true },
  topBar: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  subIcon: { type: Object as PropType<IconType>, default: null },
});

const emit = defineEmits<{
  (event: "click", commands: [string, ...string[]]): void;
}>();

const refButton = ref();
function focus() {
  refButton.value.focus();
}
defineExpose({
  focus,
});
</script>

<style lang="scss" scoped>
.input-button {
  @apply relative select-none
    min-w-[calc((100vw-0.25rem)/7-0.25rem)] sm:min-w-[3rem] w-full min-h-[max(calc((100vw-0.25rem)/7-0.25rem),3rem)] sm:min-h-[3rem] h-full 
    text-center sm:text-base
    rounded-md 
    focus:ring focus:z-10;

  &.btn-type-default {
    @apply bg-gray-200
    hover-hover:hover:bg-gray-300 
    active:bg-gray-400 hover-hover:active:bg-gray-400
    focus:outline-none focus:bg-gray-300 focus:ring-gray-200 
    disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-200;

    &.active {
      @apply bg-gray-400 active:bg-gray-400 hover-hover:active:bg-gray-400;
    }
  }

  &.btn-type-primary {
    @apply bg-blue-400
    hover-hover:hover:bg-blue-500 
    active:bg-blue-600 hover-hover:active:bg-blue-600 
    focus:outline-none focus:bg-blue-500 focus:ring-blue-300 
    disabled:cursor-not-allowed disabled:text-blue-600 disabled:bg-blue-400;

    &.active {
      @apply bg-blue-500 active:bg-blue-600 hover-hover:active:bg-blue-600;
    }
  }

  &.btn-type-danger {
    @apply bg-red-400
    hover-hover:hover:bg-red-500 
    active:bg-red-600 hover-hover:active:bg-red-600 
    focus:outline-none focus:bg-red-500 focus:ring-red-300 
    disabled:cursor-not-allowed disabled:text-red-600 disabled:bg-red-400;

    &.active {
      @apply bg-red-500 active:bg-red-600 hover-hover:active:bg-red-600;
    }
  }

  &.btn-type-warning {
    @apply bg-amber-400
    hover:bg-amber-500 
    active:bg-amber-600 hover-hover:active:bg-amber-600 
    focus:outline-none focus:bg-amber-500 focus:ring-amber-300 
    disabled:cursor-not-allowed disabled:text-amber-600 disabled:bg-amber-400;

    &.active {
      @apply bg-amber-500 active:bg-amber-600 hover-hover:active:bg-amber-600;
    }
  }
}
</style>
