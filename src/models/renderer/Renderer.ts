import { AbstractParen, MathChar } from "../math-char";
import { MathNode } from "../math-node";
import type { MathTree } from "../math-tree";
import { findByClass } from "../utils";

type InteractableFunction<N> = (r: N, sn: number) => N;
type SetParenthesesLevelFunction<N> = (r: N, level: number) => N;
type RenderVariableFunction<N> = (char: MathChar) => N;
type RenderMathFunction<N> = (char: MathChar, params: N[]) => N;
type RenderEmptyTree<N> = () => N;

type AfterRenderFunction<N> = (
  r: N,
  afterRenderOptions?: AfterRenderFunctionOptions
) => N;
type AfterRenderFunctionOptions = { active?: boolean; incomplete?: boolean };

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
  private _interactiveFn?: InteractableFunction<N>;
  private _setParenthesesLevelFn?: SetParenthesesLevelFunction<N>;
  private _renderEmptyTreeFn?: RenderEmptyTree<N>;
  private _afterRenderFunction?: AfterRenderFunction<N>;

  private _nodeFns: Record<string, DecoratorNodeTemplateFunction<N, H>> = {};

  private _renderTextFunction?: RenderTextFunction<N>;

  readonly renderVariable: RenderVariableFunction<N>;
  readonly renderMathFunction: RenderMathFunction<N>;

  constructor(config: {
    helper: H;
    interactiveFunction?: InteractableFunction<N>;
    setParenthesesLevelFunction?: SetParenthesesLevelFunction<N>;
    renderEmptyTreeFunction?: RenderEmptyTree<N>;
    renderTextFunction?: RenderTextFunction<N>;
    afterRenderFunction?: AfterRenderFunction<N>;
    renderVariable: RenderVariableFunction<N>;
    renderMathFunction: RenderMathFunction<N>;
  }) {
    this._helper = config.helper;
    this._interactiveFn = config.interactiveFunction;
    this._setParenthesesLevelFn = config.setParenthesesLevelFunction;
    this._renderEmptyTreeFn = config.renderEmptyTreeFunction;
    this._afterRenderFunction = config.afterRenderFunction;
    this._renderTextFunction = config.renderTextFunction;
    this.renderVariable = config.renderVariable;
    this.renderMathFunction = config.renderMathFunction;
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

  private _renderChar(
    char: MathChar,
    params: N[],
    interactive: boolean,
    afterRenderOptions: AfterRenderFunctionOptions
  ): N {
    const fn = findByClass(char, this._charFns);
    let result: N;
    if (fn == undefined) {
      throw new Error(
        `Render failed: cannot find char template of \`${char.constructor.name}\`(\`{ ${char.value}}\`).`
      );
    } else {
      result = fn({ char, params, h: this._helper });
    }

    if (interactive && char.interactive && this._interactiveFn) {
      result = this._interactiveFn(result, char.sequenceNumber);
    }

    if (this._setParenthesesLevelFn && char instanceof AbstractParen) {
      result = this._setParenthesesLevelFn(result, char.level);
    }

    if (this._afterRenderFunction) {
      result = this._afterRenderFunction(result, afterRenderOptions);
    }

    return result;
  }

  private _renderNode(
    node: MathNode,
    interactive: boolean,
    cursorRendered: boolean,
    incompleteChars: readonly MathChar[]
  ): N {
    const template = findByClass(node.char, this._nodeFns);
    if (template == undefined) {
      throw new Error(
        `Render failed: cannot find node template of \`${node.char.constructor.name}\`(\`{ ${node.char.value}}\`).`
      );
    } else {
      const active =
          !cursorRendered && !!this._afterRenderFunction && node.hasCursor,
        incomplete =
          incompleteChars.findIndex((char) => node.char == char) > -1;
      return template({
        node,
        left: node.leftChild
          ? this._renderNode(
              node.leftChild,
              interactive,
              active,
              incompleteChars
            )
          : undefined,
        right: node.rightChild
          ? this._renderNode(
              node.rightChild,
              interactive,
              active,
              incompleteChars
            )
          : undefined,
        current: this._renderChar(
          node.char,
          (node.paramTrees || []).map<N>((tree) => this.render(tree)),
          interactive,
          { active, incomplete }
        ),
        h: this._helper,
        renderChar: (char, params) => {
          return this._renderChar(char, params, interactive, {
            active,
            incomplete,
          });
        },
      });
    }
  }

  render(tree: MathTree): N {
    if (!tree.root) {
      if (this._renderEmptyTreeFn) {
        return this._renderEmptyTreeFn();
      } else {
        throw new Error(
          "Render failed: the `root` of `MathTree` is `undefined`."
        );
      }
    }
    return this._renderNode(
      tree.root,
      false,
      tree.interactive,
      tree.incompleteChars
    );
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
