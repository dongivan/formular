<template>
  <div ref="containerRef" class="mathjax-viewer"></div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from "vue";

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
</script>

<script setup lang="ts">
const props = defineProps({
  mathJaxSrc: { type: String, default: "" },
  mathJaxFunctionName: {
    type: String,
    validator(val: string) {
      return ["mathml2chtml", "tex2chtml"].includes(val);
    },
    required: true,
  },
  content: { type: String, required: true },
});
const emit = defineEmits(["math-jax-loaded"]);

if (
  !(window.MathJax && window.MathJax[props.mathJaxFunctionName]) &&
  props.mathJaxSrc
) {
  loadScript(props.mathJaxSrc);
  window.MathJax = {
    ...window.MathJax,
    ...{
      loader: {
        load: ["[tex]/html"],
      },
      startup: {
        ready() {
          if (window.MathJax.startup?.defaultReady) {
            window.MathJax.startup?.defaultReady();
          }
          isMathJaxLoadedRef.value = true;
          emit("math-jax-loaded");
        },
      },
    },
  };
}

const isMountedRef = ref(false);
const containerRef = ref();
onMounted(() => {
  isMountedRef.value = true;
});

watch(
  [() => props.content, isMountedRef, isMathJaxLoadedRef],
  ([content, isMounted, isMathJaxLoaded]) => {
    if (!isMounted || !isMathJaxLoaded) {
      return;
    }
    const MathJax = window.MathJax,
      MathJaxFunction = MathJax[props.mathJaxFunctionName];
    if (typeof MathJaxFunction == "function") {
      const el = containerRef.value;
      el.innerHTML = "";
      el.appendChild(MathJaxFunction(content));
      MathJax.startup?.document?.clear();
      MathJax.startup?.document?.updateDocument();
    }
  }
);
</script>

<style scoped lang="scss"></style>
