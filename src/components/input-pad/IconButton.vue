<template>
  <button
    class="input-button"
    :class="[`btn-type-${data.type || 'default'}`]"
    @click="emit('click', data.value)"
  >
    <div
      v-if="topBar"
      class="after:content-[''] after:absolute after:top-1 after:left-4 after:w-4 after:border-t-gray-400 after:border-t-2"
    ></div>
    <SvgIcon
      :name="data.icon.name"
      :scale="data.icon.scale"
      :flip="data.icon.flip"
    />
  </button>
</template>

<script setup lang="ts">
import { InputButton } from "./buttons";
import SvgIcon from "@/components/SvgIcon.vue";
import { PropType } from "vue";

defineProps({
  data: { type: Object as PropType<InputButton>, required: true },
  topBar: { type: Boolean, default: false },
});
const emit = defineEmits(["click"]);
</script>

<style lang="scss" scoped>
.input-button {
  @apply relative min-w-[3rem] w-full min-h-[3rem] h-full text-center rounded-md focus:ring group-hover:ring-0;

  &.btn-type-default {
    @apply bg-gray-200
    hover:bg-gray-300 
    active:bg-gray-400
    focus:outline-none focus:bg-gray-300 focus:ring-gray-200 
    disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-200;
  }

  &.btn-type-primary {
    @apply bg-blue-400
    hover:bg-blue-500 
    active:bg-blue-600 
    focus:outline-none focus:bg-blue-500 focus:ring-blue-300 
    disabled:cursor-not-allowed disabled:text-blue-600 disabled:bg-blue-400;
  }

  &.btn-type-danger {
    @apply bg-red-400
    hover:bg-red-500 
    active:bg-red-600 
    focus:outline-none focus:bg-red-500 focus:ring-red-300 
    disabled:cursor-not-allowed disabled:text-red-600 disabled:bg-red-400;
  }
}
</style>
