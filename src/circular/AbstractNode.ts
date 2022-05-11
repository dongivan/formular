import { Leaf, Node } from "./internal";

console.log("in AbstractNode.ts");

export class AbstractNode {
  parent: AbstractNode | undefined;

  constructor(params: { parent?: AbstractNode }) {
    this.parent = params.parent;
  }

  getDepth(): number {
    if (this.parent) return this.parent.getDepth() + 1;
    return 0;
  }

  print() {
    throw "abstract; not implemented";
  }

  static from(thing: any, parent?: AbstractNode) {
    if (thing && typeof thing === "object") return new Node({ parent, thing });
    else return new Leaf({ parent, thing });
  }
}
