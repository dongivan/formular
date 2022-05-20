import { AbstractParen, MathChar } from "../math-char";
import { MathNode } from "../math-node";
import type { MathTree } from "../math-tree";
import { findByClass } from "../utils";

type AddClickableMarkFunction<N> = (r: N, sn: number) => N;
type SetParenthesesLevelFunction<N> = (r: N, level: number) => N;
type RenderVariableFunction<N> = (char: MathChar) => N;
type RenderActiveNode<N> = (r: N) => N;

type DecoratorCharTemplateFunction<N, H> = (args: {
  char: MathChar;
  params: N[];
  h: H;
}) => N;

type DecoratorNodeTemplateFunction<N, H> = (args: {
  current: N;
  left?: N;
  right?: N;
  node: MathNode;
  h: H;
  renderChar: (char: MathChar, params: N[]) => N;
}) => N;

type RenderTextFunction<N> = (r: N, ...args: unknown[]) => string;

export class Renderer<N, H> {
  private _helper: H;

  private _charFns: Record<string, DecoratorCharTemplateFunction<N, H>> = {};
  private _addClickableMarkFn?: AddClickableMarkFunction<N>;
  private _setParenthesesLevelFn?: SetParenthesesLevelFunction<N>;
  private _renderActiveNode?: RenderActiveNode<N>;
  private _interactive = true;

  private _nodeFns: Record<string, DecoratorNodeTemplateFunction<N, H>> = {};

  private _renderTextFunction?: RenderTextFunction<N>;

  readonly renderVariable: RenderVariableFunction<N>;

  constructor(config: {
    helper: H;
    addClickableMarkFunction?: AddClickableMarkFunction<N>;
    setParenthesesLevelFunction?: SetParenthesesLevelFunction<N>;
    renderTextFunction?: RenderTextFunction<N>;
    renderActiveNode?: RenderActiveNode<N>;
    renderVariable: RenderVariableFunction<N>;
  }) {
    this._helper = config.helper;
    this._addClickableMarkFn = config.addClickableMarkFunction;
    this._setParenthesesLevelFn = config.setParenthesesLevelFunction;
    this._renderActiveNode = config.renderActiveNode;
    this._renderTextFunction = config.renderTextFunction;
    this.renderVariable = config.renderVariable;
  }

  /* setters / getters */

  set interactive(flag: boolean) {
    this._interactive = flag;
  }

  /* decorators */

  RenderChar(fn: DecoratorCharTemplateFunction<N, H>) {
    return <T extends typeof MathChar>(constructor: T) => {
      this._charFns[constructor.name] = fn;
    };
  }

  RenderNode(fn: DecoratorNodeTemplateFunction<N, H>) {
    return <T extends typeof MathChar>(constructor: T) => {
      this._nodeFns[constructor.name] = fn;
    };
  }

  /* functions */

  private _renderChar(char: MathChar, params: N[], active: boolean): N {
    const fn = findByClass(char, this._charFns);
    let result: N;
    if (fn == undefined) {
      throw new Error(
        `Render failed: cannot find char template of \`${char.constructor.name}\`(\`{ ${char.value}}\`).`
      );
    } else {
      result = fn({ char, params, h: this._helper });
    }

    if (this._interactive && this._addClickableMarkFn) {
      result = this._addClickableMarkFn(result, char.sequenceNumber);
    }

    if (this._setParenthesesLevelFn && char instanceof AbstractParen) {
      result = this._setParenthesesLevelFn(result, char.level);
    }

    if (active && this._renderActiveNode) {
      result = this._renderActiveNode(result);
    }

    return result;
  }

  private _renderNode(node: MathNode, cursorRendered = false): N {
    const template = findByClass(node.char, this._nodeFns);
    if (template == undefined) {
      throw new Error(
        `Render failed: cannot find node template of \`${node.char.constructor.name}\`(\`{ ${node.char.value}}\`).`
      );
    } else {
      const active =
        !cursorRendered && !!this._renderActiveNode && node.hasCursor;
      return template({
        node,
        left: node.leftChild
          ? this._renderNode(node.leftChild, active)
          : undefined,
        right: node.rightChild
          ? this._renderNode(node.rightChild, active)
          : undefined,
        current: this._renderChar(
          node.char,
          (node.paramTrees || []).map<N>((tree) => this.render(tree)),
          active
        ),
        h: this._helper,
        renderChar: (char, params) => {
          return this._renderChar(char, params, active);
        },
      });
    }
  }

  render(tree: MathTree): N {
    if (!tree.root) {
      throw new Error(
        "Render failed: the `root` of `MathTree` is `undefined`."
      );
    }
    return this._renderNode(tree.root);
  }

  renderText(tree: MathTree, ...args: unknown[]): string {
    if (!this._renderTextFunction) {
      throw new Error(
        "Render text failed: `renderTextFunction` has not been defined."
      );
    }
    return this._renderTextFunction(this.render(tree), ...args);
  }
}
