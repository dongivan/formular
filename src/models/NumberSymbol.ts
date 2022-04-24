import GenericSymbol from "./GenericSymbol";

export default class NumberSymbol extends GenericSymbol {
  append(value: number) {
    this.value += value.toString();
  }

  unshift(value: number) {
    this.value = value.toString() + this.value;
  }

  pop() {
    const tail = this.value.slice(-1);
    this.value = this.value.slice(0, -1);
    return tail;
  }

  shift() {
    const head = this.value.slice(0, 1);
    this.value = this.value.slice(1);
    return head;
  }

  get length() {
    return this.value.length;
  }
}
