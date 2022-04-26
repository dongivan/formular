<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <textarea v-model="latexTextRef" style="width: 100%"></textarea>
  </div>
  <div>formula: {{ formula }}</div>
  <div>cursor point at: {{ cursor.symbol }}</div>
  <div class="latex-container" ref="latexEleRef"></div>
  <!--HelloWorld msg="Welcome to Your Vue.js App12"/-->

  <div>
    <button
      v-for="partName of 10"
      :key="`key-value-${partName - 1}`"
      @click="cursor.insertSymbol(partName - 1)"
    >
      {{ partName - 1 }}
    </button>
    <button @click="cursor.insertSymbol('power')">^</button>
    <button @click="cursor.moveLeft()">&lt;-</button>
    <button @click="cursor.moveRight()">-&gt;</button>
    <button @click="cursor.deleteSymbol()">Backspace!</button>
  </div>

  <div>
    <textarea v-model="symbolLatexTextRef" style="width: 100%"></textarea>
  </div>
  <div>symbol list: {{ symbolList._symbols }}</div>
  <div>symbol rpn: {{ symbolList.toRPN() }}</div>
  <div class="latex-container" ref="symbolLatexEleRef"></div>
  <!--HelloWorld msg="Welcome to Your Vue.js App12"/-->

  <div>
    <button
      v-for="partName of 10"
      :key="`key-value-${partName - 1}`"
      @click="symbolList.insert(partName - 1)"
    >
      {{ partName - 1 }}
    </button>
    <!-- <button @click="cursor.insertSymbol('power')">^</button> -->
    <button @click="symbolList.insert('+')">+</button>
    <button @click="symbolList.insert('-')">-</button>
    <button @click="symbolList.insert('*')">*</button>
    <button @click="symbolList.insert('/')">/</button>
    <button @click="symbolList.moveCursorLeft()">&lt;-</button>
    <button @click="symbolList.moveCursorRight()">-&gt;</button>
    <!-- <button @click="cursor.deleteSymbol()">Backspace!</button> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { Formula } from "./models";
import katex from "katex";
import SymbolList from "./newmodels";

class Test {
  constructor() {
    console.log("run constructor");
  }
}

class Child extends Test {
  constructor() {
    super();
    console.log("run child constructor");
  }
}

const cls: typeof Test = Child;
new cls();
// const tests: Array<Test> = [];
// console.log(tests);
// tests.push(new Test());
// console.log(tests.splice(0, 0, new Test()));

const formula = reactive(new Formula());
const cursor = formula.cursor;

const latexTextRef = computed(() => {
  return formula.renderLatex();
});

const latexEleRef = ref();
const isMountedRef = ref(false);

onMounted(() => {
  isMountedRef.value = true;
  // window.katex = katex;
});

watch(
  [latexTextRef, isMountedRef],
  ([text, isMounted]) => {
    if (!isMounted) {
      return;
    }

    katex.render(text, latexEleRef.value, {
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

/* */

const symbolList = reactive(new SymbolList());
const symbolLatexTextRef = computed(() => {
  return symbolList.toLatex();
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
