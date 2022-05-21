<template>
  <div class="w-screen h-screen flex flex-col items-center touch-none">
    <div class="w-full sm:w-[540px]">
      <div class="flex gap-px flex-wrap text-2xl sm:text-base">
        <button
          v-for="(_, view) in views"
          :key="view"
          class="view-btn"
          :class="{
            active: view == refCurrentView,
          }"
          @click="refCurrentView = view.toString()"
        >
          {{ view }}
        </button>
        <div class="flex-grow hidden sm:block"></div>
        <button
          class="view-btn hidden sm:block"
          :class="{ active: !refShowSource }"
          @click="refShowSource = false"
        >
          Result
        </button>
        <button
          class="view-btn hidden sm:block"
          :class="{ active: refShowSource }"
          @click="refShowSource = true"
        >
          Source
        </button>
      </div>
      <MathJaxViewer
        v-show="!refShowSource"
        class="box-height max-h-64 bg-white border border-solid border-gray-400 shadow-md overflow-auto flex flex-col justify-center text-4xl sm:text-2xl md:text-lg lg:text-base"
        :source-format="views[refCurrentView].source"
        target-format="html"
        :content="refSource"
        @click="views[refCurrentView].handleClick"
      />
      <div
        v-show="refShowSource"
        class="box-height bg-white border border-solid border-gray-400 w-full overflow-auto"
      >
        <pre>{{ refSource }}</pre>
      </div>
    </div>
    <FormularInputPad
      class="fixed bottom-1 justify-center"
      @click="handleCommands"
    />
  </div>
</template>

<script setup lang="ts">
import FormularInputPad from "@/components/input-pad";
import { ref, watch } from "vue";
import { Formula, Latex, MathML, MathTree } from "./models";

const formula = new Formula();

const views: {
  [key: string]: {
    render: (tree: MathTree) => string;
    source: string;
    handleClick?: (evt: Event) => void;
  };
} = {
  MathML: {
    render: (tree: MathTree) => {
      return MathML.renderText(tree, "block");
    },
    source: "mml",
    handleClick: (evt: Event) => {
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
    },
  },
  Latex: {
    render: (tree: MathTree) => {
      return Latex.render(tree);
    },
    source: "tex",
  },
};
const refCurrentView = ref(Object.keys(views)[0]);
const refShowSource = ref(false);
const refSource = ref("");
formula.addTreeChangedListener(({ tree }) => {
  refSource.value = views[refCurrentView.value].render(tree);
});
watch(refCurrentView, (view) => {
  refSource.value = views[view].render(formula.tree);
});

const handleCommands = (commands: [string, ...string[]]) => {
  commands.forEach((cmd) => {
    switch (cmd) {
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
        console.log("execute !", formula.checkIntegrity(true));
        break;
      default:
        formula.insertAtCursor(cmd);
    }
  });
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
:deep(.formular-cursor) {
  @apply bg-sky-400;
}
:deep(.formular-placeholder) {
  @apply bg-yellow-200;
}
:deep(.formular-active) {
  @apply bg-gray-200 rounded-sm;
}
:deep(.formular-incomplete) {
  @apply border-2 border-red-300 rounded-md p-1;
}
.view-btn {
  @apply bg-gray-200 px-4 py-2 first:rounded-bl-sm last:rounded-br-sm;

  &.active {
    @apply bg-gray-300 shadow-blue-400 shadow-[inset_0_3px];
  }
}
.box-height {
  @apply h-[calc(100vh-60px-(100vw-0.25rem)/7*5)] sm:h-[calc(100vh-60px-13rem)];
}
</style>
