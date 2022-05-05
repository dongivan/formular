import ConfigInterface from "./ConfigInterface";

export default class Config {
  private static _instance: Config;

  private static _defaultConfig: ConfigInterface = {
    cursorLatex: "{\\htmlClass{<0>}{{\\phantom{O}\\mathstrut}}}",
    placeholderLatex: "\\htmlClass{<0>}{\\ ?\\ \\mathstrut}",

    cursorMML: "&nbsp;&nbsp;&nbsp;",
    placeholderMML: "&nbsp;?&nbsp;",
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
