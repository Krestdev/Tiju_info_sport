import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

interface LoadInitialContentProps {
  value: string;
}

const LoadInitialContent = ({ value }: LoadInitialContentProps) => {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false); // Pour éviter de recharger le texte à chaque frappe

  useEffect(() => {
    if (isInitialized.current) return; // Empêcher la réinitialisation après la première charge
    isInitialized.current = true;

    editor.update(() => {
      try {
        if (value.startsWith("{") || value.startsWith("[")) {
          const editorState = editor.parseEditorState(value);
          editor.setEditorState(editorState);
        } else {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(value));
          root.append(paragraph);
        }
      } catch (error) {
        console.error("Erreur de parsing de l'éditeur :", error);
      }
    });
  }, [editor, value]);

  return null;
};

export default LoadInitialContent;
