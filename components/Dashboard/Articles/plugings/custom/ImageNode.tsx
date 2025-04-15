// components/editor/nodes/ImageNode.tsx
import { DecoratorNode, SerializedLexicalNode } from 'lexical';
import React from 'react';

type SerializedImageNode = {
  src: string;
  type: 'image';
  version: 1;
} & SerializedLexicalNode;

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string = '';

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key);
  }
  // static importJSON(serializedNode: SerializedImageNode): ImageNode {
  constructor(src: string, key?: string) {
    super(key);
    this.__src = src;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
      return $createImageNode(serializedNode.src);
    }

  exportJSON() {
    return {
      src: this.__src,
      type: 'image',
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactNode {
    return (
      <img
        src={this.__src}
        alt="Editor content"
        style={{ maxWidth: '50%', maxHeight: '200px', objectFit: 'cover' }}
        draggable="false"
      />
    );
  }

  exportDOM() {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', 'Editor content');
    return { element };
  }
}

export function $createImageNode(src: string): ImageNode {
  return new ImageNode(src);
}

export function $isImageNode(node: any): node is ImageNode {
  return node instanceof ImageNode;
}