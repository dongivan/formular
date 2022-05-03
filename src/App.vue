<template>
  <div>
    <textarea v-model="symbolLatexTextRef" style="width: 100%"></textarea>
  </div>
  <div>symbol list: {{ formula }}</div>
  <!-- <div>symbol rpn: {{ symbolContainer.toRPNList() }}</div> -->
  <div class="latex-container" style="width: 100%">
    <div class="latex-ele" ref="symbolLatexEleRef"></div>
  </div>
  <!--HelloWorld msg="Welcome to Your Vue.js App12"/-->

  <div>
    <button
      v-for="partName of 10"
      :key="`key-value-${partName - 1}`"
      @click="formula.insertAtCursor(partName - 1)"
    >
      {{ partName - 1 }}
    </button>
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
    <button @click="formula.deleteSymbolBeforeCursor()">Backspace!</button>
    <button @click="formula.undo()" :disabled="!formula.couldUndo">UNDO</button>
    <button @click="formula.redo()" :disabled="!formula.couldRedo">REDO</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import katex from "katex";
import Formula from "./models/Formula";

const isMountedRef = ref(false);

onMounted(() => {
  isMountedRef.value = true;
  // window.katex = katex;
  (symbolLatexEleRef.value as HTMLElement).onclick = (evt) => {
    if (!evt.target) {
      return;
    }
    let ele: HTMLElement = evt.target as HTMLElement;
    while (ele) {
      if (ele.dataset.formularSymbolSn || !ele.parentElement) {
        break;
      }
      ele = ele.parentElement;
    }
    const symbolSn = ele.dataset.formularSymbolSn;
    if (!symbolSn) {
      return;
    }
    console.log("symbol clicked", symbolSn);
    formula.moveCursorBeforeChar(parseInt(symbolSn));
    // console.log(evt.target);
  };
});

/* */

const formula = reactive(new Formula());
const symbolLatexTextRef = computed(() => {
  return formula.toLatex();
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
      // displayMode: true,
    });

    // console.log(symbolLatexEleRef.value);
    // symbolLatexEleRef.value
    //   .querySelectorAll("[data-formular-symbol-id]")
    //   .forEach((ele: HTMLElement) => {
    //     if (ele) {
    //       console.log(
    //         "add listener",
    //         ele.dataset.formularSymbolId,
    //         ele.onclick
    //       );
    //       ele.onclick = (ev) => {
    //         const symbolId = ele.dataset.formularSymbolId;
    //         if (!symbolId) {
    //           return;
    //         }
    //         console.log("symbol clicked", symbolId);
    //         formula.moveCursorBeforeSymbol(parseInt(symbolId));
    //         ev.stopPropagation();
    //       };
    //     }
    //   });
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
.latex-container {
  border: 1px solid black;
  min-height: 50px;
  width: 100%;

  .latex-ele {
    display: inline-block;
    user-select: none;

    /* \mathstrut will add a transparent ")" after the leading symbol("A" in "A\mathstrut" for
    example), and then the latter symbol will be blocked by this transparent ")". */
    .katex .clap > .inner,
    .katex .rlap > .inner {
      z-index: -1;
    }

    /* \frac will have a "span.vlist" at the bottom of its dom, and block the denominator. */
    .katex .mfrac span.vlist-r:last-child > .vlist {
      z-index: -1;
    }
  }
}
.formular-cursor {
  background: skyblue;
}
.formular-placeholder {
  background: lightyellow;
}
</style>
