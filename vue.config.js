const { defineConfig } = require("@vue/cli-service");
const { workWithSprite } = require("./src/components/input-pad/svg-utils");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    workWithSprite(config);
  },
});
