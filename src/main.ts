import { createApp } from "vue";
import App from "./App.vue";
import "./components/input-pad/svgs";

const app = createApp(App);
app.mount("#app");
console.log("in main.ts");
import AbstractNode from "./circular";

console.log(
  AbstractNode.from({
    today: {
      needCoffee: true,
      writeBlog: true,
    },
    tomorrow: {
      holiday: "hopefully!",
      zenMode: {
        forever: true,
      },
    },
  }).print()
);
