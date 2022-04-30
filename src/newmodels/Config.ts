import ConfigInterface from "./ConfigInterface";

export default class Config {
  private static _instance: Config;

  private static _defaultConfig: ConfigInterface = {
    cursorLatex: "{\\htmlClass{formular-cursor}{{\\phantom{O}\\mathstrut}}}",
    placeholderLatex: "\\htmlClass{formular-placeholder}{\\ ?\\ \\mathstrut}",
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
