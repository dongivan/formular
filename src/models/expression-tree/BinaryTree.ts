interface BinaryNodeInterface {
  leftChild: this | undefined;
  rightChild: this | undefined;
}

interface BinaryTreeInterface {
  root: BinaryNodeInterface | undefined;
}

class BinaryNode<V> implements BinaryNodeInterface {
  value: V;
  leftChild: this | undefined;
  rightChild: this | undefined;

  constructor(value: V) {
    this.value = value;
  }

  /**
   * Traverse node by Left-Right-Node order.
   *
   * The first parameter is a function which will be run on the left child, the right child and the node, and
   * it has 5 parameters to indicates the current node, the traverse result of the left child, the traverse
   * result of the right child, the parent node of the current node (if exists), and the relation between the
   * parent node and the current one (if exists).
   *
   * The relation should be "left" if the child node is the left child node of the parent node, and "right"
   * vice versa.
   *
   * @param fn actual function on each node.
   * @param parentNode parent node if exists. node should be root node of binary tree if `parentNode` is undefined.
   * @param parentRelation "left" if the current node is the left child of the parent node, "right" vice versa.
   * @returns the result of the first parameter function `fn`
   */
  traverse<R>(
    fn: (
      node: this,
      leftResult: R | undefined,
      rightResult: R | undefined,
      parentNode?: this,
      parentRelation?: "left" | "right"
    ) => R,
    parentNode?: this,
    parentRelation?: "left" | "right"
  ): R {
    /* use `this.leftChild?.travserse(...)` will cause `this` type change to `NonNullable<this>` */
    const leftChildResult = this.leftChild
        ? this.leftChild.traverse<R>(fn, this, "left")
        : undefined,
      rightChildResult = this.rightChild
        ? this.rightChild.traverse<R>(fn, this, "right")
        : undefined;
    return fn(
      this,
      leftChildResult,
      rightChildResult,
      parentNode,
      parentRelation
    );
  }
}

class BinaryTree<N extends BinaryNodeInterface> implements BinaryTreeInterface {
  root: N;

  constructor(root: N) {
    this.root = root;
  }
}

export { BinaryTree, BinaryNode };
