const path = require("path");
const { defineConfig } = require("@vue/cli-service");

const formularSvgsPath = path.join(__dirname, "src/assets/formular-svgs");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.module.rule("svg").exclude.add(formularSvgsPath).end();
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(formularSvgsPath)
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "svg-icon-[name]",
      });
  },
});
