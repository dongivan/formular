<template>
  <div ref="refContainer"></div>
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { refIsMathJaxLoaded } from "./plugin";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MathJax: any;
  }
}

export default {};
</script>

<script setup lang="ts">
const props = defineProps({
  sourceFormat: {
    type: String,
    default: "tex",
    validator(val: string) {
      return ["mml", "mathml", "latex", "tex"].includes(val);
    },
  },
  targetFormat: {
    type: String,
    default: "chtml",
    validator(val: string) {
      return ["html", "chtml", "svg"].includes(val);
    },
  },
  content: { type: String, required: true },
  display: { type: Boolean, default: false },
});
const emit = defineEmits(["math-jax-loaded"]);

const refMathJaxFunctionName = computed(() => {
  const source =
    {
      mml: "mathml",
      latex: "tex",
    }[props.sourceFormat] || props.sourceFormat;
  const target =
    {
      html: "chtml",
    }[props.targetFormat] || props.targetFormat;
  return `${source}2${target}Promise`;
});

watch(
  refIsMathJaxLoaded,
  (loaded) => {
    if (loaded) {
      emit("math-jax-loaded");
    }
  },
  { immediate: true }
);

const refIsMounted = ref(false);
const refContainer = ref();
onMounted(() => {
  refIsMounted.value = true;
});

watch(
  [() => props.content, refIsMounted, refIsMathJaxLoaded],
  async ([content, isMounted, isMathJaxLoaded]) => {
    if (!isMounted || !isMathJaxLoaded) {
      return;
    }
    const MathJax = window.MathJax,
      MathJaxFunction = MathJax[refMathJaxFunctionName.value];
    if (typeof MathJaxFunction == "function") {
      const el = refContainer.value;
      el.innerHTML = "";
      MathJax.texReset();
      const options = MathJax.getMetricsFor(el) as { display: boolean };
      options.display = props.display;
      el.appendChild(await MathJaxFunction(content, options));
      MathJax.startup?.document?.clear();
      MathJax.startup?.document?.updateDocument();
    } else {
      throw new Error(
        `MathJax function \`${refMathJaxFunctionName.value}\` does not exist.`
      );
    }
  }
);
</script>
