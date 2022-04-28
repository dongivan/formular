<template>
  <img alt="Vue logo" src="./assets/logo.png" />

  <div>
    <textarea v-model="symbolLatexTextRef" style="width: 100%"></textarea>
  </div>
  <div>symbol list: {{ symbolContainer }}</div>
  <!-- <div>symbol rpn: {{ symbolContainer.toRPNList() }}</div> -->
  <div class="latex-container" ref="symbolLatexEleRef"></div>
  <!--HelloWorld msg="Welcome to Your Vue.js App12"/-->

  <div>
    <button
      v-for="partName of 10"
      :key="`key-value-${partName - 1}`"
      @click="symbolContainer.insertAtCursor(partName - 1)"
    >
      {{ partName - 1 }}
    </button>
    <button @click="symbolContainer.insertAtCursor('+')">+</button>
    <button @click="symbolContainer.insertAtCursor('(')">(</button>
    <button @click="symbolContainer.insertAtCursor(')')">)</button>
    <button @click="symbolContainer.insertAtCursor('-')">-</button>
    <button @click="symbolContainer.insertAtCursor('*')">*</button>
    <button @click="symbolContainer.insertAtCursor('/')">/</button>
    <button @click="symbolContainer.insertAtCursor('^')">^</button>
    <button @click="symbolContainer.insertAtCursor('sqrt')">sqrt</button>
    <button @click="symbolContainer.moveCursorLeft()">&lt;-</button>
    <button @click="symbolContainer.moveCursorRight()">-&gt;</button>
    <button @click="symbolContainer.deleteSymbolBeforeCursor()">
      Backspace!
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import katex from "katex";
import SymbolContainer from "./newmodels/SymbolContainer";

const isMountedRef = ref(false);

onMounted(() => {
  isMountedRef.value = true;
  // window.katex = katex;
});

/* */

const symbolContainer = reactive(new SymbolContainer());
const symbolLatexTextRef = computed(() => {
  return symbolContainer.toLatex();
});
const symbolLatexEleRef = ref();

watch(
  [symbolLatexTextRef, isMountedRef],
  ([text, isMounted]) => {
    if (!isMounted) {
      return;
    }

    katex.render(text, symbolLatexEleRef.value, {
      throwOnError: false,
      strict: false,
      trust: true,
      output: "html",
      displayMode: false,
    });
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.latex-container {
  border: 1px solid black;
  min-height: 50px;
}
.formular-cursor {
  background: skyblue;
}
.formular-placeholder {
  background: lightyellow;
}
</style>
