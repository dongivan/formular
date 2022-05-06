import ConfigInterface from "./ConfigInterface";

export default class Config {
  private static _instance: Config;

  private static _defaultConfig: ConfigInterface = {
    cursorLatex: "{\\class{<0>}{{\\phantom{O}\\mathstrut}}}",
    placeholderLatex: "\\class{<0>}{\\ ?\\ \\mathstrut}",

    cursorKatex: "{\\htmlClass{<0>}{{\\phantom{O}\\mathstrut}}}",
    placeholderKatex: "\\htmlClass{<0>}{\\ ?\\ \\mathstrut}",

    cursorMML: `<mtext>&#xA0;&#xA0;&#xA0;</mtext><mrow><mpadded width="0"><mphantom><mo stretchy="false">(</mo></mphantom></mpadded></mrow>`,
    placeholderMML: `<mtext>&#xA0;?&#xA0;</mtext><mrow><mpadded width="0"><mphantom><mo stretchy="false">(</mo></mphantom></mpadded></mrow>`,

    cursorCssClass: "formular-cursor",
    placeholderCssClass: "formular-placeholder",
  };

  static getConfig(): ConfigInterface {
    if (!Config._instance) {
      Config.init();
    }
    return Config._instance._config;
  }

  static init(config?: ConfigInterface) {
    Config._instance = new Config(config);
  }

  private _config: ConfigInterface;

  private constructor(config?: ConfigInterface) {
    this._config = Object.assign<
      ConfigInterface,
      ConfigInterface,
      ConfigInterface | undefined
    >({}, Config._defaultConfig, config);
  }
}
