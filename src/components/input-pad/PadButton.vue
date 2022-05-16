<template>
  <div
    class="w-full min-w-[3rem] h-full min-h-[3rem]"
    :style="{
      gridRow: `${data.row} / span ${data.rowSpan || 1}`,
      gridColumn: `${data.col + 1} / span ${data.colSpan || 1}`,
    }"
  >
    <button
      class="pad-button"
      :class="[`btn-type-${data.type || 'default'}`]"
      @click="emit('click', data.value)"
    >
      <SvgIcon
        v-if="data.icon"
        :name="data.icon.name"
        :scale="data.icon.scale"
        :flip="data.icon.flip"
      />
      <template v-else>
        {{ data.label || data.name || data.value.toString() }}
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PadButton } from "./buttons";
import SvgIcon from "@/components/SvgIcon.vue";
import { PropType } from "vue";

defineProps({
  data: { type: Object as PropType<PadButton>, required: true },
});
const emit = defineEmits(["click"]);
</script>

<style lang="scss" scoped>
.pad-button {
  @apply w-full h-full text-center rounded-md focus:ring;

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
