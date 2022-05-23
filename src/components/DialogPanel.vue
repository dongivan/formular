<template>
  <transition name="dialog-panel">
    <div
      v-show="show"
      class="fixed top-0 left-0 w-screen h-screen touch-none bg-gray-400/25"
      @click="close"
    >
      <div class="dialog-content" @click.stop>
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
  @apply absolute bg-white p-4 flex flex-col items-center
    bottom-0 max-h-[75vh] min-h-[25vh] w-screen
    sm:top-48 sm:left-[calc(50vw-200px)] sm:w-[400px] sm:h-[200px]
    border-t rounded-t-md
    sm:border sm:rounded-xl 
    border-gray-500 shadow-md;
}
.dialog-panel-enter-active,
.dialog-panel-leave-active {
  @apply transition-opacity duration-200;

  .dialog-content {
    @apply transition-transform duration-200;
  }
}

.dialog-panel-enter-from,
.dialog-panel-leave-to {
  @apply opacity-0;

  .dialog-content {
    @apply translate-y-8 sm:-translate-y-4;
  }
}
</style>
