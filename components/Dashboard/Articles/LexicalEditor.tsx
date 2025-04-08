import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
 EditorState,
 ParagraphNode,
 TextNode,
 LexicalNode,
 $getRoot,
 ElementNode,
} from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { Klass } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
 $generateHtmlFromNodes,
 $generateNodesFromDOM,
} from "@lexical/html";
import { ImageNode } from "./ImageNode"; // Conserver si utilisé
import sanitizeHtml from "sanitize-html";
import { useEffect, useRef } from "react";
import Toolbar from "./Toolbar"; // Conserver si utilisé

interface LexicalEditorProps {
 value: string; // HTML initial à afficher
 onChange: (content: string) => void; // Callback pour renvoyer le contenu HTML édité
}

export default function LexicalEditor({ value, onChange }: LexicalEditorProps) {
 const initialConfig = {
   namespace: "LexicalEditor",
   theme: {
     paragraph: "text-gray-800",
     text: {
       bold: "font-bold",
       italic: "italic",
       underline: "underline",
       strikethrough: "line-through",
     },
   },
   onError: (error: Error) => console.error("Lexical error:", error),
   nodes: [
     TextNode,
     ParagraphNode,
     HeadingNode,
     QuoteNode,
     ImageNode, // Conserver uniquement si utilisé
   ] as Klass<LexicalNode>[],
 };

 return (
   <LexicalComposer initialConfig={initialConfig}>
     <div className="border border-gray-600 rounded-none">
       <Toolbar /> 
       <RichTextPlugin
         contentEditable={
           <ContentEditable className="min-h-[280px] p-2 outline-none" />
         }
         placeholder={
           <p className="font-light text-gray-400 px-5 py-2">
             {"Description de l'article"}
           </p>
         }
         ErrorBoundary={LexicalErrorBoundary}
       />
       <LoadInitialContent value={value} />
       <LexicalHtmlConverter onChange={onChange} />
     </div>
   </LexicalComposer>
 );
}

// 🧠 Insère le HTML initial dans l'éditeur (appelée une seule fois)
function LoadInitialContent({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!value || hasInitialized.current) return;

    hasInitialized.current = true;

    const sanitizedHtml = sanitizeHtml(value, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'div', 'h1', 'h2', 'ul', 'ol', 'li', 'blockquote', 'img'],
      allowedAttributes: {
        'a': ['href', 'title'],
        'img': ['src', 'alt']
      }
    });

    console.log("Sanitized HTML:", sanitizedHtml);

    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(sanitizedHtml, "text/html");
      editor.update(() => {
        const nodes = $generateNodesFromDOM(editor, dom);
        console.log("Generated nodes:", nodes);
        const root = $getRoot();
        root.clear();
        nodes.forEach((node) => {
          if (node.getParent() === null && node instanceof ElementNode) {
            root.append(node); 
          }
        });
      });
    } catch (error) {
      console.error("Error loading initial content:", error);
    }
  }, [value, editor]);

  return null;
}


// 🔁 Écoute les changements et convertit l'éditeur en HTML
function LexicalHtmlConverter({ onChange }: { onChange: (content: string) => void }) {
 const [editor] = useLexicalComposerContext();

 return (
   <OnChangePlugin
     onChange={(editorState: EditorState) => {
       editorState.read(() => {
         const htmlString = $generateHtmlFromNodes(editor, null);
         onChange(htmlString); // Renvoie le HTML à chaque modification
       });
     }}
   />
 );
}
