"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { EditorState, ParagraphNode, TextNode, LexicalNode } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { Klass } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";

import Toolbar from "./Toolbar";
import LoadInitialContent from "./LoadInitialContent";

interface LexicalEditorProps {
  value: string;
  onChange: (content: string) => void;
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
    onError: (error: Error) => console.error(error),
    nodes: [TextNode, ParagraphNode, HeadingNode, QuoteNode] as Klass<LexicalNode>[],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LoadInitialContent value={value} />
      <div className="border border-black rounded-none">
        <Toolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[280px] p-2 outline-none" />}
          placeholder={<p className="text-gray-400">Description de l'article...</p>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LexicalHtmlConverter onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}

// Composant pour gérer la conversion en HTML
function LexicalHtmlConverter({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState: EditorState) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onChange(htmlString);
        });
      }}
    />
  );
}
