<template>
  <transition name="dialog-panel">
    <div
      v-show="show"
      class="fixed top-0 left-0 w-screen h-screen touch-none bg-gray-400/25 flex flex-col items-center justify-end sm:justify-center"
      @click="close"
    >
      <div
        :class="dialogClass"
        :style="dialogStyle"
        class="dialog-content"
        @click.stop
      >
        <div class="flex-grow"></div>
        <slot :close="close"></slot>
        <div class="flex-grow"></div>
        <slot name="bottom" :close="close">
          <button
            class="select-none border rounded-md border-gray-500 bg-white px-4 py-1 hover-hover:active:bg-gray-400 active:bg-gray-400 hover-hover:hover:bg-gray-300 focus:outline-none focus:bg-gray-300 focus:ring focus:ring-gray-200"
            @click="close"
          >
            Close
          </button>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps({
  show: { type: Boolean, default: false, required: true },
  dialogClass: { type: [String, Array, Object], default: "" },
  dialogStyle: { type: String, default: "" },
});
const emit = defineEmits<{
  (event: "update:show", value: boolean): void;
}>();

function close() {
  emit("update:show", false);
}
</script>

<style lang="scss" scoped>
.dialog-content {
  @apply bg-white p-4 flex flex-col items-center
    max-h-[75vh] min-h-[25vh] w-screen
    sm:w-[400px] sm:h-[200px]
    border-t rounded-t-md
    sm:border sm:rounded-xl sm:-translate-y-1/4
    border-gray-500 shadow-md;
}
.dialog-panel-enter-active,
.dialog-panel-leave-active {
  @apply transition-opacity duration-200;

  .dialog-content {
    @apply transition-transform duration-200
      sm:-translate-y-1/4;
  }
}

.dialog-panel-enter-from,
.dialog-panel-leave-to {
  @apply opacity-0;

  .dialog-content {
    @apply translate-y-1/2 sm:-translate-y-1/2;
  }
}
</style>
