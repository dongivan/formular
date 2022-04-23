<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <textarea v-model="latexTextRef" style="width: 100%"></textarea>
  </div>
  <div>formula: {{ formula }}</div>
  <div>cursor position: {{ cursor.position }}</div>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Cursor, Formula } from "./models";
import katex from "katex";

const formula = ref(new Formula());
const cursor = ref(new Cursor(formula.value, 0));

const latexTextRef = computed(() => {
  return formula.value.renderLatex(cursor.value);
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
