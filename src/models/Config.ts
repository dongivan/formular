export interface ConfigInterface {
  cursorKatex?: string;
  placeholderKatex?: string;
  cursorLatex?: string;
  placeholderLatex?: string;
  cursorMathML?: string;
  placeholderMathML?: string;
  cursorCssClass?: string;
  placeholderCssClass?: string;

  interactiveDataName?: string;
  activeClass?: string;
  incompleteClass?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class Config {
  private static _instance: Config;

  private static _defaultConfig: ConfigInterface = {
    cursorLatex: "{\\class{<0>}{{\\phantom{O}\\mathstrut}}}",
    placeholderLatex: "\\class{<0>}{\\ ?\\ \\mathstrut}",

    cursorKatex: "{\\htmlClass{<0>}{{\\phantom{O}\\mathstrut}}}",
    placeholderKatex: "\\htmlClass{<0>}{\\ ?\\ \\mathstrut}",

    cursorMathML: `<mtext>&#xA0;&#xA0;&#xA0;</mtext><mrow><mpadded width="0"><mphantom><mo stretchy="false">(</mo></mphantom></mpadded></mrow>`,
    placeholderMathML: `<mtext>&#xA0;?&#xA0;</mtext><mrow><mpadded width="0"><mphantom><mo stretchy="false">(</mo></mphantom></mpadded></mrow>`,

    cursorCssClass: "formular-cursor",
    placeholderCssClass: "formular-placeholder",

    interactiveDataName: "formular-char-sn",
    activeClass: "formular-active",
    incompleteClass: "formular-incomplete",
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
