<template>
  <div class="w-screen h-screen flex flex-col items-center touch-none">
    <div class="w-full sm:w-[540px]">
      <div class="hidden sm:flex gap-px flex-wrap text-2xl sm:text-base">
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
        <div class="flex-grow"></div>
        <button
          class="view-btn"
          :class="{ active: !refShowSource }"
          @click="refShowSource = false"
        >
          Result
        </button>
        <button
          class="view-btn"
          :class="{ active: refShowSource }"
          @click="refShowSource = true"
        >
          Source
        </button>
      </div>
      <MathJaxVuewer
        v-show="!refShowSource"
        class="box-height max-h-64 bg-white border border-solid border-gray-400 shadow-md overflow-auto flex flex-col justify-center text-4xl sm:text-2xl md:text-lg lg:text-base"
        :source-format="refCurrentView"
        target-format="html"
        :content="refSource"
        display
        @click="views[refCurrentView].handleClick"
        @math-jax-loaded="refMathJaxLoaded = true"
      />
      <div
        v-show="refShowSource"
        class="box-height bg-white border border-solid border-gray-400 w-full overflow-auto"
      >
        <pre>{{ refSource }}</pre>
      </div>
    </div>
    <MathKeyboard
      class="fixed bottom-1 justify-center"
      @click="handleCommands"
    />
  </div>
  <DialogPanel v-model:show="refShowPanel" dialog-style="width: 500px;">
    <div v-if="refShowPanel && !refResult">
      Oops! We cannot find anything from the input...
    </div>
    <div v-else>
      <div class="mb-4">Your expression is:</div>
      <MathJaxVuewer
        v-show="refResult"
        class="text-center"
        source-format="mml"
        target-format="html"
        :content="refResult"
      />
      <div v-if="refHasErrors" class="my-4">
        Oops! Maybe you should check the expression...
      </div>
      <template v-else>
        <div class="my-4">
          <p>But we cannot calculate it for you now...</p>
          <p v-if="refWolframAlphaExpression">
            Or, you can
            <a
              :href="`https://www.wolframalpha.com/input?i2d=true&i=${encodeURI(
                refWolframAlphaExpression
              )}`"
              class="text-orange-600"
              target="_blank"
              >try the great WolframAlpha</a
            >!
          </p>
        </div>
      </template>
    </div>
  </DialogPanel>
  <DialogPanel v-model:show="refAboutPanel" dialog-style="width: 450px;">
    <div class="mx-8">
      <p>
        Mathematics is the queen of science, and arithmetic the queen of
        mathematics.
      </p>
      <p class="text-right">– Carl Friedrich Gauss</p>
    </div>
  </DialogPanel>
  <div
    v-if="!refMathJaxLoaded"
    class="w-screen h-screen fixed top-0 left-0 touch-none bg-gray-400/50 flex flex-col items-center justify-center"
  >
    Loading MathJax...
  </div>
</template>

<script setup lang="ts">
import DialogPanel from "@/components/DialogPanel.vue";
import { ref, watch } from "vue";
import { Formula, Latex, MathML, WolframAlpha } from "./models";
import MathKeyboard from "./components/MathKeyboard.vue";

const formula = new Formula();

const views: {
  [key: string]: {
    renderer: { renderText(...args: unknown[]): string };
    handleClick?: (evt: Event) => void;
  };
} = {
  MathML: {
    renderer: MathML,
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
  LaTeX: {
    renderer: Latex,
  },
};

const refCurrentView = ref(Object.keys(views)[0]);
const refShowSource = ref(false);
const refSource = ref("");
formula.addTreeChangedListener(({ tree }) => {
  refSource.value = views[refCurrentView.value].renderer.renderText(
    tree,
    /* `LaTex.renderText` only need one param which is `tree`, this "block" is for `MathML.renderText` */
    "block"
  );
});
watch(refCurrentView, (view) => {
  refSource.value = views[view].renderer.renderText(formula.tree, "block");
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
        refShowPanel.value = true;
        break;
      case "about":
        refAboutPanel.value = true;
        break;
      default:
        formula.insertAtCursor(cmd);
    }
  });
};

const refShowPanel = ref(false);
const refResult = ref("");
const refHasErrors = ref(false);
const refWolframAlphaExpression = ref("");
watch(refShowPanel, (show) => {
  if (show) {
    const tree = formula.getPureTree();
    refResult.value = MathML.renderText(tree);
    refHasErrors.value = tree.incompleteChars.length > 0;
    if (!refHasErrors.value) {
      refWolframAlphaExpression.value = WolframAlpha.render(tree);
    }
    if (import.meta.env.NODE_ENV == "development") {
      console.log(refWolframAlphaExpression.value);
    }
  } else {
    refResult.value = "";
    refHasErrors.value = false;
    refWolframAlphaExpression.value = "";
  }
});

const refAboutPanel = ref(false);
const refMathJaxLoaded = ref(false);
</script>

<style lang="scss" scoped>
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
