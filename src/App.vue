<template>
  <div>
    <button
      v-for="partName of 10"
      :key="`key-value-${partName - 1}`"
      @click="formula.insertAtCursor(partName - 1)"
    >
      {{ partName - 1 }}
    </button>
    <button @click="formula.insertAtCursor('.')">.</button>
    <button @click="formula.insertAtCursor('+')">+</button>
    <button @click="formula.insertAtCursor('(')">(</button>
    <button @click="formula.insertAtCursor(')')">)</button>
    <button @click="formula.insertAtCursor('-')">-</button>
    <button @click="formula.insertAtCursor('*')">*</button>
    <button @click="formula.insertAtCursor('/')">/</button>
    <button @click="formula.insertAtCursor('frac')">frac</button>
    <button @click="formula.insertAtCursor('^')">^</button>
    <button @click="formula.insertAtCursor('sqrt')">sqrt</button>
    <button @click="formula.insertAtCursor('x')">x</button>
    <button @click="formula.moveCursorLeft()">&lt;-</button>
    <button @click="formula.moveCursorRight()">-&gt;</button>
    <button @click="formula.deleteCharBeforeCursor()">Backspace!</button>
    <button :disabled="!formula.couldUndo" @click="formula.undo()">UNDO</button>
    <button :disabled="!formula.couldRedo" @click="formula.redo()">REDO</button>
  </div>

  <MathMLViewer
    class="jax-container"
    :math-jax-script-src="scriptUrlOfMathJax"
    :content="mmlText"
    @click="onViewerClick"
  />

  <pre>{{ mmlText }}</pre>
</template>

<script setup lang="ts">
import MathMLViewer from "./components/MathMLViewer.vue";
import { computed, reactive } from "vue";
import Formula from "./models/Formula";

const formula = reactive(new Formula());
const scriptUrlOfMathJax = "mathjax/es5/mml-chtml.js";

const mmlText = computed(() => {
  return formula.toMML().render();
});

const onViewerClick = (evt: Event) => {
  if (!evt.target) {
    return;
  }
  let ele: HTMLElement = evt.target as HTMLElement;
  while (ele) {
    if (ele.dataset.formularCharSn || !ele.parentElement) {
      break;
    }
    ele = ele.parentElement;
  }
  const charSn = ele.dataset.formularCharSn;
  if (!charSn) {
    return;
  }
  formula.moveCursorBeforeChar(parseInt(charSn));
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.jax-container {
  border: 1px solid black;
  min-height: 50px;
  width: 100%;
}
.formular-cursor {
  background: skyblue;
}
.formular-placeholder {
  background: lightyellow;
}
</style>
