<template>
  <div class="formular-input-pad">
    <PadButton
      v-for="(button, name) in padButtonsRef['page-1']"
      :key="`button-${name}`"
      :data="button"
      @click="(evt) => emit('key-pressed', evt)"
    />
  </div>
</template>

<script lang="ts">
import { padButtons as defaultPadButtons } from "./buttons";

export default {};
// const defaultButtonsPosition = buttonPositions;
</script>

<script setup lang="ts">
import { computed } from "vue";
import PadButton from "./PadButton.vue";

const emit = defineEmits(["key-pressed"]);

const padButtonsRef = computed(() => {
  return defaultPadButtons;
});
</script>

<style lang="scss" scoped>
.formular-input-pad {
  @apply w-max grid grid-cols-11 grid-rows-4 gap-1 justify-end;
}
</style>
