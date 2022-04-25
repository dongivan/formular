import GenericSymbol from "../GenericSymbol";

export default abstract class SymbolOperation {
  abstract run(symbol: GenericSymbol): unknown;
}
