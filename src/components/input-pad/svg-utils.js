const path = require("path");

const svgPath = path.join(__dirname, "./svgs");

module.exports = {
  workWithSprite: (config) => {
    config.module.rule("svg").exclude.add(svgPath).end();
    config.module
      .rule("svg-sprite-loader")
      .test(/\.svg$/)
      .include.add(svgPath)
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "svg-icon-[name]",
      });
  },
};
