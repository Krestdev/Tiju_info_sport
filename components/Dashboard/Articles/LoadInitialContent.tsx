import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";

interface LoadInitialContentProps {
  value: string;
}

const LoadInitialContent = ({ value }: LoadInitialContentProps) => {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !value) return;
    isInitialized.current = true;

    editor.update(() => {
      try {
        console.log("Contenu HTML reçu :", value);

        const parser = new DOMParser();
        const doc = parser.parseFromString(value, "text/html") as any;
        const body = doc.body;

        const nodes = $generateNodesFromDOM(editor, body);
        console.log("Nodes générés :", nodes);

        const root = $getRoot();
        root.clear();

        nodes.forEach((node) => {
          root.append(node);
        });

        if (nodes.length === 0) {
          console.warn("❌ Aucun nœud généré. Ajout manuel d’un paragraphe.");
          const paragraphNode = $createParagraphNode();
          paragraphNode.append($createTextNode("Valeur par défaut"));
          root.append(paragraphNode);
        }
      } catch (err) {
        console.error("❌ Erreur lors du parsing HTML pour Lexical:", err);
      }
    });
  }, [editor, value]);

  return null;
};

export default LoadInitialContent;
