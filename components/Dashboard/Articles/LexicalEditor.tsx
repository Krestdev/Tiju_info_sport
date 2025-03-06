import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { EditorState, TextNode, ParagraphNode } from "lexical";

import Toolbar from "./Toolbar";

interface LexicalEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function LexicalEditor({ value, onChange }: LexicalEditorProps) {
  const initialConfig = {
    namespace: "LexicalEditor",
    theme: { paragraph: "text-gray-800" },
    onError: (error: Error) => console.error(error),
    nodes: [TextNode, ParagraphNode]
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border border-black rounded-none">
        <Toolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-[280px] p-2 outline-none" />}
          placeholder={<p className="text-gray-400">Saisir du texte ici...</p>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState: EditorState) => {
            editorState.read(() => {
              onChange(JSON.stringify(editorState.toJSON()));
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}
