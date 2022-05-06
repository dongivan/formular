export default interface ConfigInterface {
  cursorKatex?: string;
  placeholderKatex?: string;
  cursorLatex?: string;
  placeholderLatex?: string;
  cursorMathML?: string;
  placeholderMathML?: string;
  cursorCssClass?: string;
  placeholderCssClass?: string;

  clickableDataKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
