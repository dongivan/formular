# formular

`formular` is a toy libray which presents an interactive context of mathematics expressions.

What `formular` could do:
- Build a mathematics expression step by step.
- Move the cursor.
- Undo / redo.
- Render the expression to Latex / MathML.

What `formular` could not do:
- Render a Latex string / MathML node to HTML / SVG.
- Read from a Latex string or MathML node.
- Compute the expression. 

# Demo
See [here](https://dongivan.github.io).

See more details from the source code of the project.

# Concept
In this library, the instance of the `Formular` class is used to input the math symbols and build them to an expression. Each math symbol is parsed to a `MathChar` instance, and then all the `MathChar` instances will be used to generate a `MathTree` instance using shunting yard algorithm. And then the renderers could render the `MathTree` to text or other formats.

# Install
```bash
npm install @dongivan/formular --save
```

# Usage
## Import & Renderer
Import `Formular` and the renderer you need (e.g. `Latex`).
```ts
import { Formular, Latex, MathML } from "@dongivan/formular"
```
`Formular` instance will hold all status of the expression and rebuild an expression tree whenever the expression changed. And the expression tree could be rendered to specific format by the renderer.
```ts
const formular = new Formular();
formular.addTreeChangedListener({ tree } => {
  result = Latex.renderText(tree);
  /* If you use an reactive framework(e.g. Vue), you should also get the result here */
  resultReference.value = MathML.renderText(tree);
})
```
Then you will get the latex result of the expression after it is changed.

### Latex vs MathML
Latex (or LaTeX) is a famous technology especilly when rendering mathematics expression (with Katex or MathJax in broswer). However, it is not a good renderer while rendering an interactive expression. For example, if we want to add some information to the second symbol of expression `a+2` (which is the operator `+`), and the information would show as a tip when the mouse move over the symbol, the Latex could not help us (to take the information).

MathML, on the other hand, is a structured language which could easily take informations with it but only the MathJax could render it.

## Cursor
A `Formular` instance always has one (and only one) cursor, and the new `MathChar` (like digits, variables or operators) will be inserted at the position of the cursor. The cursor could be moved to left or right, or to specific position / `MathChar`.
```ts
/* Move the cursor to the left 1 step */
formular.moveCursorLeft();
/* Move the cursor to the right 1 step */
formular.moveCursorRight();
/* Move the cursor to the right 5 steps. The cursor will be moved to the left steps if the param is negative. */
formular.moveCursor(5);
/* Move the cursor to position 0 */
formular.moveCursorTo(0);
/* Move the cursor to the position before the `MathChar` with sequence number 1. */
formular.moveCursorBeforeChar(1);
```
### Sequence Number
Each `MathChar` instance has a `sequenceNumber` attribute (as id), and `MathML` renderer will render the instance to a MathML node with data attribute `data-formular-char-sn`, and then MathJax will render this node to a html element with the same data attribute. However, the `Latex` renderer will ignore the sequence number.

## Insert / Delete `MathChar`
```ts
formular.insertAtCursor('+');
formular.deleteCharBeforeCursor();
```

## Undo / Redo
```ts
formular.undo();
formular.redo();
```

## Listeners
```ts
const listener: TreeChangedListener = ({ tree }) => { /* do something */ }
formular.addTreeChangedListener(listener);
formular.removeTreeChangedListener(listener);
```

## Check Valid
The expression inputed may not be valid (e.g. `1+` or `2-(5+4` ), you can check it using `checkIntegrity`.
```ts
const isValid = formular.checkIntegrity(true)
```
If the parameter is set to `true`, all the invalid symbols will be saved to `tree.incompleteChars` and the MathML renderer will render them with specific class `formular-incomplete`.

If the parameter is set `false`, the method will just return whether the expression is valid or not.

## Pure Tree
A pure tree is a `MathTree` without cursor. It is usefull when you want to render the expression and hidint the cursor.
```ts
const tree = formular.getPureTree();
Latex.renderText(tree);
```

## More
Please read [./src/App.vue](./src/App.vue).

# Caution
Remember: this project is just a toy. DO NOT use it in any production.
