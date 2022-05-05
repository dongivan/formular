export default interface ConfigInterface {
  cursorLatex?: string;
  placeholderLatex?: string;
  cursorMML?: string;
  placeholderMML?: string;
  cursorCssClass?: string;
  placeholderCssClass?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
