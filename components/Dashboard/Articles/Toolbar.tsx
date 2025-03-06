"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
} from "react-icons/md";
import { useEffect, useState } from "react";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [color, setColor] = useState("#000000");

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };
  useEffect(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node?.getType() === "text") {
            (node as any).setStyle(`color: ${color}`);
            (node as any).setStyle(`font: underline`)
          }
        });
      }
    });
  }, [color, editor]);

  return (
    <div className="flex contain-layout border-b items-center bg-gray-100 border-black h-10">
      {/* Styles Texte */}
      <button onClick={() => formatText("bold")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdFormatBold />
      </button>
      <button onClick={() => formatText("italic")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdFormatItalic />
      </button>
      <button onClick={() => formatText("underline")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdFormatUnderlined />
      </button>
      <button onClick={() => formatText("strikethrough")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdStrikethroughS />
      </button>
    </div>
  );
};

export default Toolbar;
