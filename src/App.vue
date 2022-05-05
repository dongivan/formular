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
    <button @click="formula.insertAtCursor('over')">over</button>
    <button @click="formula.insertAtCursor('^')">^</button>
    <button @click="formula.insertAtCursor('sqrt')">sqrt</button>
    <button @click="formula.moveCursorLeft()">&lt;-</button>
    <button @click="formula.moveCursorRight()">-&gt;</button>
    <button @click="formula.deleteCharBeforeCursor()">Backspace!</button>
    <button @click="formula.undo()" :disabled="!formula.couldUndo">UNDO</button>
    <button @click="formula.redo()" :disabled="!formula.couldRedo">REDO</button>
  </div>

  <div class="jax-container" style="width: 100%" ref="jaxEleRef"></div>

  <pre>{{ mmlText }}</pre>
</template>

<script lang="ts">
declare const window: {
  MathJax: {
    mathml2chtml: (mml: string) => void;
    startup: {
      document: {
        clear: () => void;
        updateDocument: () => void;
      };
    };
  };
};
</script>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import Formula from "./models/Formula";
import { loadScript } from "./models/utils";

const isMountedRef = ref(false);

onMounted(() => {
  isMountedRef.value = true;
});

/* */

const formula = reactive(new Formula());
const scriptUrlOfMathJax = "mathjax/es5/mml-chtml.js";

const isMathJaxLoadedRef = ref(false);
if (!window.MathJax) {
  loadScript(scriptUrlOfMathJax).then(() => {
    isMathJaxLoadedRef.value = true;
  });
}

const jaxEleRef = ref();
const mmlText = computed(() => {
  return formula.toMML().render();
});

onMounted(() => {
  (jaxEleRef.value as HTMLElement).onclick = (evt) => {
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
});

watch(
  [mmlText, isMountedRef, isMathJaxLoadedRef],
  ([text, isMounted, isMathJaxLoaded]) => {
    if (!isMounted || !isMathJaxLoaded) {
      return;
    }

    const MathJax = window.MathJax;
    const ele = jaxEleRef.value;
    ele.innerHTML = "";
    ele.appendChild(MathJax.mathml2chtml(text));
    MathJax.startup.document.clear();
    MathJax.startup.document.updateDocument();
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
