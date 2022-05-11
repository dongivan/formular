import { AbstractNode } from "./internal";

console.log("in Leaf.ts");

export class Leaf extends AbstractNode {
  value: any;

  constructor(params: { parent?: AbstractNode; thing: any }) {
    super(params);
    this.value = params.thing;
  }

  print() {
    return this.value;
  }
}
