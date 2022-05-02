interface BinaryNodeInterface {
  leftChild: this | undefined;
  rightChild: this | undefined;
}

interface BinaryTreeInterface {
  root: BinaryNodeInterface | undefined;
}

class BinaryNode<V, T extends BinaryTreeInterface>
  implements BinaryNodeInterface
{
  value: V;
  tree: T;
  leftChild: this | undefined;
  rightChild: this | undefined;

  constructor(tree: T, value: V) {
    this.value = value;
    this.tree = tree;
  }

  traverse<R>(
    fn: (node: this, leftResult: R | undefined, rightResult: R | undefined) => R
  ): R {
    const leftChildResult = this.leftChild?.traverse<R>(fn),
      rightChildResult = this.rightChild?.traverse<R>(fn);
    return fn(this, leftChildResult, rightChildResult);
  }
}

class BinaryTree<N extends BinaryNodeInterface> implements BinaryTreeInterface {
  root: N | undefined;
}

export { BinaryTree, BinaryNode };
