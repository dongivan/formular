import { MathChar } from "../math-char";
import { MathSymbol } from "../math-symbol";
import SymbolRenderer from "./SymbolRenderer";

export type OperandRendererFunction<R> = (
  symbol: MathSymbol<MathChar>,
  self: SymbolRenderer<R>
) => R;

export type OperatorRendererFunction<R> = (
  symbol: MathSymbol<MathChar>,
  leftOperand: R | undefined,
  rightOperand: R | undefined,
  self: SymbolRenderer<R>
) => R;

type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> &
    Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type SymbolRendererFunction<R> = RequireAtLeastOne<{
  operandRenderer: OperandRendererFunction<R>;
  operatorRenderer: OperatorRendererFunction<R>;
}>;
