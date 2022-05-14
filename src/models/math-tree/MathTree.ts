// import { ExpressionNode } from "../expression-tree";
// import PostfixList from "../expression-tree/PostfixList";
// import Formula from "../Formula";
// import { InstanceResolver } from "../InstanceResolver";
// import { MathChar } from "../math-char";
// import MathNode from "./MathNode";

// class ExpressionTree {
//   private _formulaId: string;
//   private _addParen = false;
//   private _infixList: MathNode[] = [];
//   // private _root: ExpressionNode | undefined;
//   private _root: MathNode | undefined;

//   constructor(formula: Formula, addParen: boolean) {
//     this._formulaId = formula.instanceId;
//     this._addParen = addParen;
//   }

//   get formula() {
//     return InstanceResolver.getTrackedInstance<Formula>(this._formulaId);
//   }

//   get infixMaker() {
//     return this.formula.infixMaker;
//   }

//   get treeMaker() {
//     return this.formula.binaryTreeMaker;
//   }

//   get postfixMaker() {
//     return this.formula.postfixMaker;
//   }

//   get root() {
//     return this._root;
//   }

//   resetInfixList(chars: MathChar[]) {
//     this._infixList = this.infixMaker.make(chars);
//     this._generateTree();
//   }

//   private _generateTree() {
//     const postfix = this.postfixMaker.make(this._infixList);
//     this._parsePostfixToBinaryTree(postfix);
//   }

//   private _parsePostfixToBinaryTree(postfix: PostfixList): void {
//     let root: MathNode | undefined;

//     if (postfix.length == 0) {
//       throw new Error("Create expression tree failed: postfix array is empty.");
//     }
//     const stack: MathNode[] = [];
//     let pos = 0;
//     while (pos < postfix.length) {
//       const symbol = postfix[pos];
//       // const node = new ExpressionNode(oper);
//       if (symbol instanceof OperandSymbol) {
//         stack.push(symbol);
//       } else if (symbol instanceof OperatorSymbol) {
//         if (symbol.hasRightOperand) {
//           const rightChild = stack.pop();
//           if (rightChild) {
//             node.rightChild = rightChild;
//           }
//         }
//         if (symbol.hasLeftOperand) {
//           const leftChild = stack.pop();
//           if (leftChild) {
//             node.leftChild = leftChild;
//           }
//         }
//         stack.push(node);
//       }
//       node.paramTrees = node.symbol.params.map<ExpressionTree>((param, i) => {
//         return this.formula.generateExpressionTree(
//           param,
//           node.symbol.char.hasParamParen(i)
//         );
//       });
//       root = node;

//       pos += 1;
//     }
//     if (!root) {
//       throw new Error(
//         "Create expression tree failed: create root node failed."
//       );
//     }
//     if (this._addParen) {
//       const [left, right] = this.formula.charFactory.createTempParen();
//       const rightNode = new ExpressionNode(new OperatorSymbol(right)),
//         leftNode = new ExpressionNode(new OperatorSymbol(left));
//       rightNode.leftChild = root;
//       leftNode.rightChild = rightNode;
//       root = leftNode;
//     }
//     root.setParenLevelRecursively();
//     this._root = root;
//   }
// }
