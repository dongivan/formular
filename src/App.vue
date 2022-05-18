<template>
  <MathJaxViewer
    class="jax-container"
    source-format="tex"
    target-format="html"
    :content="latexResultRef"
  />
  <div>{{ latexResultRef }}</div>
  <FormularInputPad
    class="fixed bottom-1 w-full justify-center"
    @key-pressed="handleInputPadKeyPressed"
  />
  <MathJaxViewer
    class="jax-container"
    source-format="mml"
    target-format="html"
    :content="mathMLResultRef"
    @click="onViewerClick"
  />

  <pre>{{ mathMLResultRef }}</pre>
</template>

<script setup lang="ts">
import FormularInputPad from "@/components/input-pad";
import { ref } from "vue";
import { Formula, Latex, MathML } from "./models";

const formula = new Formula();

const latexResultRef = ref("");
formula.addTreeChangedListener(({ tree }) => {
  latexResultRef.value = Latex.render(tree);
});
const mathMLResultRef = ref("");
formula.addTreeChangedListener(({ tree }) => {
  mathMLResultRef.value = MathML.renderText(tree, "block");
});

const handleInputPadKeyPressed = (name: string) => {
  switch (name) {
    case "move-left":
      formula.moveCursorLeft();
      break;
    case "move-right":
      formula.moveCursorRight();
      break;
    case "backspace":
      formula.deleteCharBeforeCursor();
      break;
    case "undo":
      formula.undo();
      break;
    case "redo":
      formula.redo();
      break;
    case "execute":
      console.log("execute !");
      break;
    default:
      formula.insertAtCursor(name);
  }
};

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

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.jax-container {
  @apply border border-solid border-black min-h-[50px] w-full;
}
::v-deep .formular-cursor {
  @apply bg-sky-400;
}
::v-deep .formular-placeholder {
  @apply bg-yellow-200;
}
.btn {
  @apply bg-gray-200 rounded-md min-w-min m-1 p-3 
    hover:bg-gray-300 
    active:bg-gray-400 
    focus:outline-none focus:bg-gray-300 focus:ring focus:ring-gray-200
    disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-200;
}
</style>
