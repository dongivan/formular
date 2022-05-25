import { createApp } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import "virtual:svg-icons-register";
import MathJaxVuewer from "@dongivan/mathjax-vuewer";

window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

const app = createApp(App);
app.use(MathJaxVuewer, {
  script: "mathjax/es5/startup.js",
  options: {
    loader: {
      load: ["input/tex-base", "input/mml", "output/chtml", "[tex]/html"],
    },
    tex: {
      packages: {
        "[+]": ["base"],
      },
    },
    startup: {
      output: ["chtml"],
    },
  },
});
app.mount("#app");
