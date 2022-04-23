import Formula from "./Formula";
import Symbols from "./Symbols";
import MathFunction from "./MathFunction";
import Operator from "./Operator";
import Placeholder from "./controls/Placeholder";

export default class Cursor {
  formula: Formula;
  position: number;

  constructor(formula: Formula, position = 0) {
    this.formula = formula;
    this.position = position;
  }

  insertSymbol(symbolName: string | number): void {
    const symbol = Symbols.makeSymbol(symbolName, this.formula);
    if (this.formula[this.position] instanceof Placeholder) {
      this.formula.splice(this.position, 1);
    }
    this.formula.splice(this.position, 0, symbol);
    this.position += 1;
    if (symbol instanceof Operator) {
      if (symbol.needRight) {
        const righthand = this.formula[this.position + 1];
        if (!righthand || righthand instanceof Operator) {
          this.formula.splice(this.position + 1, 0, new Placeholder());
        }
      }
    }
    if (symbol instanceof Operator || symbol instanceof MathFunction) {
      if (symbol.needLeft) {
        const lefthand = this.formula[this.position - 2];
        if (!lefthand || lefthand instanceof Operator) {
          this.formula.splice(this.position - 1, 0, new Placeholder());
        }
      }
    }
    if (symbol instanceof MathFunction) {
      this.formula = symbol.params[0];
      this.position = 0;
    }
  }

  setPosition(formula: Formula | undefined, position: number | undefined) {
    if (formula) {
      this.formula = formula;
    }
    if (position) {
      this.position =
        position < 0 ? this.formula.length + 1 + position : position;
    } else {
      this.position = 0;
    }
  }

  moveOut(direction: number): void {
    const parentFunction = this.formula.parentFunction;
    if (!parentFunction) {
      return;
    }

    let newFormula, newPosition;
    const formulaIndex = parentFunction.params.indexOf(this.formula);
    if (
      formulaIndex <
      ((1 + direction) * (parentFunction.params.length - 1)) / 2
    ) {
      /* current Formula IS NOT the first param NOR the last one of the parent MathFunction */
      newFormula = parentFunction.params[formulaIndex + direction];
      newPosition = ((1 - direction) * newFormula.length) / 2;
    } else {
      /* current Formula IS the first param OR the last one of the parent MathFunction */
      const parentFormula = parentFunction.parentFormula;
      const functionIndex = parentFormula.indexOf(parentFunction);
      newFormula = parentFormula;
      newPosition = functionIndex + (1 + direction) / 2;
    }
    if (newPosition > 0 && newFormula[newPosition - 1] instanceof Placeholder) {
      /* new position is the last place of the formula, so check the previous one is placeholder or not */
      newPosition -= 1;
    }
    this.setPosition(newFormula, newPosition);
  }

  moveLeft(): void {
    if (this.position == 0) {
      this.moveOut(-1);
    } else {
      let newFormula = this.formula,
        newPosition;
      const prevSymbol = this.formula[this.position - 1];
      if (prevSymbol instanceof MathFunction) {
        const childFormula = prevSymbol.params[prevSymbol.params.length - 1];
        newFormula = childFormula;
        newPosition = childFormula.length;
        if (newFormula[newPosition - 1] instanceof Placeholder) {
          newPosition -= 1;
        }
      } else if (prevSymbol instanceof Operator) {
        const symbolBeforeOperator = this.formula[this.position - 2];
        if (symbolBeforeOperator instanceof Placeholder) {
          newPosition = this.position - 2;
        } else {
          newPosition = this.position - 1;
        }
      } else {
        newPosition = this.position - 1;
      }
      this.setPosition(newFormula, newPosition);
    }
  }

  moveRight(): void {
    if (this.position == this.formula.length) {
      this.moveOut(1);
    } else {
      let newFormula = this.formula,
        newPosition;
      const currentSymbol = this.formula[this.position];
      if (currentSymbol instanceof MathFunction) {
        const childFormula = currentSymbol.params[0];
        newFormula = childFormula;
        newPosition = 0;
      } else if (currentSymbol instanceof Placeholder) {
        if (this.position == this.formula.length - 1) {
          this.moveOut(1);
          return;
        } else {
          const nextSymbol = this.formula[this.position + 1];
          if (nextSymbol instanceof MathFunction) {
            newFormula = nextSymbol.params[0];
            newPosition = 0;
          } else if (nextSymbol instanceof Operator) {
            newPosition = this.position + 2;
          } else {
            newPosition = this.position + 1;
          }
        }
      } else {
        newPosition = this.position + 1;
      }
      this.setPosition(newFormula, newPosition);
    }
  }

  renderLatex(): string {
    return "{\\htmlClass{formular-cursor}{\\ \\ \\ }}";
  }
}
