import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
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
import { ImageNode } from "./ImageNode"; // facultatif
import sanitizeHtml from "sanitize-html";
import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  type Ref,
} from "react";
import Toolbar from "./Toolbar"; // facultatif

// Props & ref exposé
interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface LexicalEditorRef {
  getHtml: () => Promise<string>;
}

// Composant principal
const LexicalEditor = forwardRef(
  ({ value, onChange }: LexicalEditorProps, ref: Ref<LexicalEditorRef>) => {
    const initialConfig: InitialConfigType = {
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
        ImageNode,
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
          <ExposeGetHtml ref={ref} />
          <SyncOnChange onChange={onChange} />
        </div>
      </LexicalComposer>
    );
  }
);

export default LexicalEditor;

function SyncOnChange({ onChange }: { onChange: (value: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onChange(html);
      });
    });
  }, [editor, onChange]);

  return null;
}

function LoadInitialContent({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!value || hasInitialized.current) return;
    hasInitialized.current = true;

    const sanitizedHtml = sanitizeHtml(value, {
      allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "p",
        "div",
        "h1",
        "h2",
        "ul",
        "ol",
        "li",
        "blockquote",
        "img",
      ],
      allowedAttributes: {
        a: ["href", "title"],
        img: ["src", "alt"],
      },
    });

    const parser = new DOMParser();
    const dom = parser.parseFromString(sanitizedHtml, "text/html");

    editor.update(() => {
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      nodes.forEach((node) => {
        if (node.getParent() === null && node instanceof ElementNode) {
          root.append(node);
        }
      });
    });
  }, [value, editor]);

  return null;
}

const ExposeGetHtml = forwardRef((_, ref: Ref<LexicalEditorRef>) => {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(ref, () => ({
    getHtml: async () => {
      let html = "";
      await editor.getEditorState().read(() => {
        html = $generateHtmlFromNodes(editor, null);
      });
      return html;
    },
  }));

  return null;
});
