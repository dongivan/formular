<template>
  <transition name="dialog-panel" @after-leave="emit('update:show', false)">
    <div
      v-show="refVisible"
      class="fixed top-0 left-0 w-full h-full touch-none bg-gray-400/25 flex flex-col items-center justify-end sm:justify-center"
      @click="close"
    >
      <div
        :class="dialogClass"
        :style="dialogStyle"
        class="dialog-content"
        @click.stop
      >
        <slot :close="close"></slot>
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
import { ref, watch } from "vue";

const props = defineProps({
  show: { type: Boolean, default: false, required: true },
  dialogClass: { type: [String, Array, Object], default: "" },
  dialogStyle: { type: String, default: "" },
});
const emit = defineEmits<{
  (event: "update:show", value: boolean): void;
}>();

const refVisible = ref(false);
watch(
  () => props.show,
  (val) => {
    if (val) {
      refVisible.value = val;
    }
  },
  { immediate: true }
);
function close() {
  refVisible.value = false;
}
</script>

<style lang="scss" scoped>
.dialog-content {
  @apply bg-white p-4 flex flex-col items-center justify-evenly
    max-h-[75vh] min-h-[25vh] w-screen
    sm:min-w-[400px] sm:min-h-[200px]
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
