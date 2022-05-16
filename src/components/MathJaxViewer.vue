<template>
  <div ref="containerRef" class="mathjax-viewer"></div>
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from "vue";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MathJax: any;
  }
}

const loadScript = async function (src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = src;

    const el = document.getElementsByTagName("head")[0];
    el.appendChild(script);

    script.addEventListener("load", () => {
      resolve();
    });

    script.addEventListener("error", () => {
      reject(new Error(`${src} failed to load.`));
    });
  });
};

const isMathJaxLoadedRef = ref(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadMathJax = function (src: string, jaxOptions: Record<string, any>) {
  const ready = function () {
    if (window.MathJax.startup?.defaultReady) {
      window.MathJax.startup?.defaultReady();
    }
    console.log("ready function: tex2chtml", window.MathJax.tex2chtml);
    isMathJaxLoadedRef.value = true;
  };

  const options = { ...jaxOptions };
  if (!options.startup) {
    options.startup = {};
  }
  if (typeof options.startup.ready == "function") {
    const oldReady = options.startup.ready;
    options.startup.ready = () => {
      oldReady();
      ready();
    };
  } else {
    options.startup.ready = ready;
  }
  options.startup.typeset = false;

  window.MathJax = {
    ...window.MathJax,
    ...options,
  };
  loadScript(src);
};
</script>

<script setup lang="ts">
/* declare props & emits */
const props = defineProps({
  mathJaxSrc: { type: String, default: "" },
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
  mathJaxOptions: {
    type: Object,
    default: () => {
      return {};
    },
  },
  content: { type: String, required: true },
});
const emit = defineEmits(["math-jax-loaded"]);

/* load MathJax if needed */
const mathJaxFunctionNameRef = computed(() => {
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
  isMathJaxLoadedRef,
  (loaded) => {
    if (loaded) {
      emit("math-jax-loaded");
    }
  },
  { immediate: true }
);

if (
  !(window.MathJax && window.MathJax[mathJaxFunctionNameRef.value]) &&
  props.mathJaxSrc
) {
  loadMathJax(props.mathJaxSrc, props.mathJaxOptions);
}

/* setup components */
const isMountedRef = ref(false);
const containerRef = ref();
onMounted(() => {
  isMountedRef.value = true;
});

watch(
  [() => props.content, isMountedRef, isMathJaxLoadedRef],
  async ([content, isMounted, isMathJaxLoaded]) => {
    if (!isMounted || !isMathJaxLoaded) {
      return;
    }
    const MathJax = window.MathJax,
      MathJaxFunction = MathJax[mathJaxFunctionNameRef.value];
    if (typeof MathJaxFunction == "function") {
      const el = containerRef.value;
      el.innerHTML = "";
      el.appendChild(await MathJaxFunction(content));
      MathJax.startup?.document?.clear();
      MathJax.startup?.document?.updateDocument();
    } else {
      throw new Error(
        `MathJax function \`${mathJaxFunctionNameRef.value}\` does not exist.`
      );
    }
  }
);
</script>

<style scoped lang="scss"></style>
