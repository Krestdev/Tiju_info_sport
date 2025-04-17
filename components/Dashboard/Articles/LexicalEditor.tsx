/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from 'lexical';

import ExampleTheme from './ExempleTheme';
import ToolbarPlugin from './plugings/ToolbarPlugin';
import TreeViewPlugin from './plugings/TreeViewPlugin';
import { parseAllowedColor, parseAllowedFontSize } from './styleConfig';
import { ImageNode } from './plugings/custom/ImageNode';
import { ImagePlugin } from './plugings/ImagePlugin';
import { $createImageNode } from './plugings/custom/ImageNode';
// import { $createImageNode } from './plugings/custom/ImageNode';

const placeholder = 'Entrez votre texte...';

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode,
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute('class');
      el.removeAttribute('style');
      if (el.getAttribute('dir') === 'ltr') {
        el.removeAttribute('dir');
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = '';
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== '' && fontSize !== '15px') {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: 'React.js Demo',
  nodes: [ParagraphNode, TextNode, ImageNode],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

interface LexicalEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function AppLexical({ initialValue, onChange }: LexicalEditorProps) {
  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor,);
      onChange?.(htmlString);
    });
  };

  return (
    <LexicalComposer initialConfig={{
      ...editorConfig,

      editorState: initialValue ? (editor: LexicalEditor) => {
        if (!initialValue) return;

        editor.update(() => {
          const root = $getRoot();
          root.clear();

          try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialValue, 'text/html');

            const parseNode = (node: Node): LexicalNode[] => {
              const nodes: LexicalNode[] = [];
              console.log(node);

              // Traitement du texte brut
              if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                const textNode = $createTextNode(node.textContent);

                // Crée un paragraphe parent pour le texte seul
                const paragraphNode = $createParagraphNode();
                paragraphNode.append(textNode);
                nodes.push(paragraphNode);
                return nodes;
              }

              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;

                // Traitement spécial pour les images
                if (element.tagName === 'IMG') {
                  const src = element.getAttribute('src');
                  if (src) {
                    const imageNode = $createImageNode(src);
                    nodes.push(imageNode);
                  }
                  return nodes;
                }
                if (element.tagName === 'BR') {
                  const brNode = $createTextNode('');
                  nodes.push(brNode);
                  return nodes;
                }

                // Pour les éléments de bloc
                const isBlockElement = ['P', 'DIV', 'H1', 'H2', 'H3', 'UL', 'OL', 'LI'].includes(element.tagName);
                const containerNode = isBlockElement ? $createParagraphNode() : null;

                // Traite les enfants récursivement
                const children = Array.from(element.childNodes).flatMap(parseNode);

                // Traiter le cas sans enfants
                if (containerNode) {
                  if (children.length > 0) {
                    containerNode.append(...children);
                    nodes.push(containerNode);
                  }
                } else {
                  nodes.push(...children);
                }
              }

              return nodes;
            };

            const body = dom.querySelector('body');
            if (body) {
              const nodes = Array.from(body.childNodes).flatMap(parseNode);

              // Filtre les nœuds invalides
              const validNodes = nodes.filter(node =>
                node && ['paragraph', 'text', 'image', 'heading'].includes(node.getType())
              );

              root.append(...validNodes);
            }

          } catch (error) {
            console.error('Erreur lors du parsing du HTML :', error);
            const errorNode = $createParagraphNode();
            errorNode.append($createTextNode('(Erreur de chargement du contenu)'));
            root.append(errorNode);
          }
        });
      } : undefined,
    
    }}>
      <div className="border border-gray-300 rounded-none w-full min-h-[350px] h-auto">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ImagePlugin />
          <OnChangePlugin onChange={handleChange} />
          <AutoFocusPlugin />
          {/* <TreeViewPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
