import React from 'react'

const RessourcePage = () => {
  return (
    <div>
      
    </div>
  )
}

export default RessourcePage


   // Ceci met les image avant le texte
      // editorState: initialValue ? (editor: LexicalEditor) => {
      //   if (!initialValue) return;

      //   editor.update(() => {
      //     const root = $getRoot();
      //     root.clear();

      //     // Parse HTML and convert to Lexical nodes
      //     const parser = new DOMParser();
      //     const dom = parser.parseFromString(initialValue, 'text/html');

      //     // Handle image tags separately
      //     const images = dom.querySelectorAll('img');
      //     images.forEach(img => {
      //       const src = img.getAttribute('src');
      //       if (src) {
      //         const imageNode = $createImageNode(src);
      //         root.append(imageNode);
      //       }
      //     });

      //     // Remove image nodes before general parsing
      //     images.forEach(img => img.remove());

      //     // Convert remaining content
      //     const nodes = $generateNodesFromDOM(editor, dom);
      //     root.append(...nodes);
      //   });
      // } : undefined,

      // editorState: initialValue ? (editor: LexicalEditor) => {
      //   if (!initialValue) return;


      // Celui ci dupllique les texte
      //   editor.update(() => {
      //     const root = $getRoot();
      //     root.clear();

      //     const parser = new DOMParser();
      //     const dom = parser.parseFromString(initialValue, 'text/html');

      //     const walker = document.createTreeWalker(dom.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

      //     while (walker.nextNode()) {
      //       const currentNode = walker.currentNode;

      //       if (currentNode.nodeType === Node.ELEMENT_NODE) {
      //         const el = currentNode as HTMLElement;

      //         if (el.tagName === 'IMG') {
      //           const src = el.getAttribute('src');
      //           if (src) {
      //             const imageNode = $createImageNode(src);
      //             root.append(imageNode); // OK car c'est un DecoratorNode
      //           }
      //         } else {
      //           // Pour les autres éléments (p, div...) :
      //           const tempDoc = document.implementation.createHTMLDocument('');
      //           tempDoc.body.appendChild(el.cloneNode(true));
      //           const lexicalNodes = $generateNodesFromDOM(editor, tempDoc);

      //           // On les enveloppe dans un paragraphe s’ils ne le sont pas déjà
      //           const paragraph = $createParagraphNode();
      //           paragraph.append(...lexicalNodes);
      //           root.append(paragraph);
      //         }
      //       }

      //       if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent?.trim()) {
      //         const text = currentNode.textContent.trim();
      //         const paragraph = $createParagraphNode();
      //         paragraph.append($createTextNode(text));
      //         root.append(paragraph);
      //       }
      //     }
      //   });
      // } : undefined 