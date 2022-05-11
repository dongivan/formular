import { AbstractNode } from "./internal";

console.log("in Node.ts");

export class Node extends AbstractNode {
  children: Record<string, AbstractNode>;

  constructor(params: { parent?: AbstractNode; thing: any }) {
    super(params);
    this.children = {};
    Object.keys(params.thing).forEach((key) => {
      this.children[key] = AbstractNode.from(params.thing[key], this);
    });
  }

  print() {
    return (
      "\n" +
      Object.keys(this.children)
        .map(
          (key) =>
            `${"".padStart(this.getDepth() * 2)}${key}: ${this.children[
              key
            ].print()}`
        )
        .join("\n")
    );
  }
}
