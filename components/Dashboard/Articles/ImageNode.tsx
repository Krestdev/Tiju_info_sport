import { DecoratorNode, LexicalEditor, NodeKey } from "lexical";

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;

  constructor(src: string, key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__key);
  }

  createDOM() {
    const img = document.createElement("img");
    img.src = this.__src;
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    return img;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <img src={this.__src} alt="Uploaded" style={{ maxWidth: "100%" }} />;
  }
}
