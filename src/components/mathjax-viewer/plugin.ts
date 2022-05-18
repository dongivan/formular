/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, ref } from "vue";
import MathJaxViewer from "./MathJaxViewer.vue";

type MathJaxOptions = {
  loader?: {
    load?: string[];
    ready?: (name: string) => string | void;
    [name: string]: any;
  };
  tex: {
    packages: {
      [name: string]: any;
    };
    [name: string]: any;
  };
  startup: {
    input?: string[];
    output?: string;
    [name: string]: any;
  };
  [name: string]: any;
};
type MathJaxViewerPluginOptions = {
  componentName: string;
  script?: string;
  options: MathJaxOptions;
};

async function loadScript(src: string) {
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
}

async function loadMathJax(src: string, options: MathJaxOptions) {
  const ready = function () {
    if (window.MathJax.startup?.defaultReady) {
      window.MathJax.startup.defaultReady();
    }
    isMathJaxLoadedRef.value = true;
  };

  const _options = { ...options };
  if (!_options.startup) {
    _options.startup = {};
  }
  if (typeof _options.startup.ready == "function") {
    const oldReady = _options.startup.ready;
    _options.startup.ready = () => {
      oldReady();
      ready();
    };
  } else {
    _options.startup.ready = ready;
  }
  _options.startup.typeset = false;

  window.MathJax = {
    ...window.MathJax,
    ..._options,
  };
  return loadScript(src);
}

const isMathJaxLoadedRef = ref(false);
let initialized = false;

async function install(app: App, options: MathJaxViewerPluginOptions) {
  app.component(options.componentName || "MathJaxViewer", MathJaxViewer);
  if (options.script && !initialized) {
    await loadMathJax(options.script, options.options);
    initialized = true;
  }
}

export { install, isMathJaxLoadedRef };
