import type { MathChar, Cursor } from "./math-char";
import {
  MathCharFactory,
  ParamEnd,
  ParamSeparator,
  Placeholder,
} from "./math-char";
import {
  ExpressionTreeMaker,
  PostfixListMaker,
  InfixListMaker,
  ExpressionTree,
} from "./expression-tree";
import Config from "./Config";
import MathMLNode from "./MathMLNode";
import { Latex, MathML } from "./Renderer";
import Instance from "./InstanceResolver";

export default class Formula extends Instance {
  private _chars: MathChar[] = [];
  private _steps: number[][] = [];
  private _currentStep = -1;
  private _cursor: Cursor;

  constructor() {
    super();

    Config.init();

    const charFactory = new MathCharFactory();
    this.addRelation({ prop: MathCharFactory, instance: charFactory });
    this.addRelation({
      prop: InfixListMaker,
      instance: new InfixListMaker(),
      backProp: Formula,
    });
    this.addRelation({
      prop: PostfixListMaker,
      instance: new PostfixListMaker(),
    });
    this.addRelation({
      prop: ExpressionTreeMaker,
      instance: new ExpressionTreeMaker(),
      backProp: Formula,
    });

    this._cursor = charFactory.createCursor();
    this._chars.push(this._cursor);
    this._pushStep();
  }

  get cursor(): Cursor {
    return this._cursor;
  }

  get length(): number {
    return this._chars.length;
  }

  get charFactory(): MathCharFactory {
    return this.getTrackedRelated(MathCharFactory);
  }

  get infixMaker(): InfixListMaker {
    return this.getTrackedRelated(InfixListMaker);
  }

  get postfixMaker(): PostfixListMaker {
    return this.getTrackedRelated(PostfixListMaker);
  }

  get binaryTreeMaker(): ExpressionTreeMaker {
    return this.getTrackedRelated<ExpressionTreeMaker>(ExpressionTreeMaker);
  }

  get(pos: number): MathChar | undefined {
    return this._chars[pos];
  }

  insertAtCursor(value: string) {
    if (this._currentStep < this._steps.length - 1) {
      this.charFactory.clearCharsAfterSequenceNumber(
        Math.max(...this._steps[this._currentStep])
      );
    }

    const cursorPos = this._chars.indexOf(this._cursor),
      chars = this.charFactory.create(value, this._cursor);
    this._chars.splice(cursorPos, 1, ...chars);

    this._pushStep();
  }

  deleteCharBeforeCursor() {
    const cursorPos = this._chars.indexOf(this._cursor);
    if (cursorPos > 0) {
      const char = this._chars[cursorPos - 1];
      if (char instanceof ParamSeparator || char instanceof ParamEnd) {
        /* previous char is a param separator or a param end, just move left. */
        this.moveCursorLeft();
        return;
      }
      if (char.paramsNumber > 0) {
        /* previous char has params */
        let nextPos = cursorPos + 1,
          paramsEmpty = true;
        while (nextPos < this._chars.length) {
          const nextChar = this._chars[nextPos];
          if (nextChar instanceof ParamSeparator) {
            /* next char is a param separator, go next pos */
            nextPos += 1;
          } else if (nextChar instanceof ParamEnd) {
            /* next char is a param end, AND chars between `char` and `nextChar` ARE
              ALL ParamSeparator objects.*/
            break;
          } else {
            /* next char IS NOT ParamSeparator OR ParamEnd, which means params are not empty. */
            paramsEmpty = false;
            break;
          }
        }
        if (paramsEmpty) {
          /* params ARE empty, remove all chars from `cursorPos + 1` to `nextPos` */
          this._chars.splice(cursorPos + 1, nextPos - cursorPos);
        } else {
          /* params ARE NOT empty, just move left. */
          this.moveCursorLeft();
          return;
        }
      }
      this._chars.splice(cursorPos - 1, 1);
    }
    this._pushStep();
  }

  moveCursorBeforeChar(sequenceNumber: number) {
    const char = this.charFactory.findCharBySequenceNumber(sequenceNumber);
    if (!char) {
      return;
    }
    let pos;
    if (char instanceof Placeholder) {
      pos = this._chars.indexOf(char.masterChar);
    } else {
      pos = this._chars.indexOf(char);
    }
    if (pos > -1) {
      const cursorPos = this._chars.indexOf(this._cursor);
      this.moveCursorTo(cursorPos < pos - 1 ? pos - 1 : pos);
    }
  }

  moveCursorTo(pos: number) {
    if (pos < 0 || pos >= this._chars.length) {
      return;
    }
    const cursorPos = this._chars.indexOf(this._cursor);
    if (cursorPos == pos) {
      return;
    }
    this._chars.splice(cursorPos, 1);
    this._chars.splice(pos, 0, this._cursor);
  }

  moveCursor(direction: number) {
    const cursorPos = this._chars.indexOf(this._cursor),
      newPos = direction + cursorPos;
    if (newPos < 0 || newPos >= this._chars.length) {
      return;
    }
    this._chars.splice(cursorPos, 1);
    this._chars.splice(newPos, 0, this._cursor);
  }

  moveCursorLeft() {
    this.moveCursor(-1);
  }

  moveCursorRight() {
    this.moveCursor(1);
  }

  private _pushStep(): void {
    this._steps.splice(this._currentStep + 1);
    this._steps.push(this._chars.map<number>((char) => char.sequenceNumber));
    this._currentStep = this._steps.length - 1;
  }

  undo(): void {
    if (!this.couldUndo) {
      return;
    }
    this._currentStep -= 1;
    const step = this._steps[this._currentStep];
    if (!step) {
      return;
    }
    this._chars = this._rebuildStep(step);
  }

  redo(): void {
    if (!this.couldRedo) {
      return;
    }
    this._currentStep += 1;
    const step = this._steps[this._currentStep];
    if (!step) {
      return;
    }
    this._chars = this._rebuildStep(step);
  }

  private _rebuildStep(step: number[]): MathChar[] {
    const list: MathChar[] = step.map<MathChar>((sn) =>
      this.charFactory.findCharBySequenceNumber(sn)
    );
    return list;
  }

  get couldRedo(): boolean {
    return this._currentStep < this._steps.length - 1;
  }

  get couldUndo(): boolean {
    return this._currentStep > 0;
  }

  toLatex(): string {
    const tree = this.generateExpressionTree(this._chars);
    return Latex.render(tree);
  }

  toMathMLNode(): MathMLNode {
    const tree = this.generateExpressionTree(this._chars);
    return new MathMLNode("math", { children: MathML.render(tree) });
  }

  generateExpressionTree(chars: MathChar[], addParen = false): ExpressionTree {
    const infix = this.infixMaker.make(chars);
    const postfix = this.postfixMaker.make(infix);
    return this.binaryTreeMaker.make(postfix, addParen);
  }

  toString(): string {
    return "[" + this._chars.toString() + "]";
  }
}
