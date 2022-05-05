<template>
  <div ref="containerRef" class="math-ml-viewer"></div>
</template>

<script lang="ts">
import { computed, onMounted, ref, watch } from "vue";

declare global {
  interface Window {
    MathJax: {
      mathml2chtml: (mml: string) => void;
      startup: {
        document: {
          clear: () => void;
          updateDocument: () => void;
        };
      };
    };
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
</script>

<script setup lang="ts">
const props = defineProps({
  mathJaxScriptSrc: { type: String, default: "" },
  content: { type: String, required: true },
});
const emit = defineEmits(["math-jax-loaded"]);

const isMathJaxLoadedRef = ref(false);
const setMathJaxLoaded = () => {
  isMathJaxLoadedRef.value = true;
  emit("math-jax-loaded");
};
if (window.MathJax) {
  setMathJaxLoaded();
} else if (props.mathJaxScriptSrc) {
  loadScript(props.mathJaxScriptSrc).then(() => {
    setMathJaxLoaded();
  });
} else {
  const interval = setInterval(() => {
    if (window.MathJax) {
      setMathJaxLoaded();
      clearInterval(interval);
    }
  }, 500);
}

const isMountedRef = ref(false);
const containerRef = ref();
onMounted(() => {
  isMountedRef.value = true;
});

const mmlRef = computed(() => props.content);
watch(
  [mmlRef, isMountedRef, isMathJaxLoadedRef],
  ([mmlContent, isMounted, isMathJaxLoaded]) => {
    if (!isMounted || !isMathJaxLoaded) {
      return;
    }
    const MathJax = window.MathJax;
    const el = containerRef.value;
    el.innerHTML = "";
    el.appendChild(MathJax.mathml2chtml(mmlContent));
    MathJax.startup.document.clear();
    MathJax.startup.document.updateDocument();
  }
);
</script>

<style scoped lang="scss"></style>
