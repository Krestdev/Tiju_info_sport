"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
  MdFormatColorText,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdFormatListBulleted,
  MdFormatListNumbered,
} from "react-icons/md";
import { ChangeEvent, useEffect, useState } from "react";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [color, setColor] = useState("#000000");

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertList = (type: "bullet" | "number") => {
    editor.dispatchCommand(
      type === "bullet" ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
      undefined
    );
  };

  const alignText = (align: "left" | "center" | "right" | "justify") => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
  };

  const changeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  useEffect(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node?.getType() === "text") {
            (node as any).setStyle(`color: ${color}`);
          }
        });
      }
    });
  }, [color, editor]);

  return (
    <div className="flex contain-layout border-b items-center bg-gray-100 border-black h-10">
      {/* Styles Texte */}
      <button onClick={() => formatText("bold")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatBold />
      </button>
      <button onClick={() => formatText("italic")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatItalic />
      </button>
      <button onClick={() => formatText("underline")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatUnderlined />
      </button>
      <button onClick={() => formatText("strikethrough")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdStrikethroughS />
      </button>

      {/* Sélecteur de couleur */}
      <label className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full cursor-pointer">
        <MdFormatColorText className="text-xl" />
        <input
          type="color"
          value={color}
          onChange={changeColor}
          className="absolute opacity-0 w-0 h-0"
        />
      </label>

      {/* Alignement */}
      <button onClick={() => alignText("left")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatAlignLeft />
      </button>
      <button onClick={() => alignText("center")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatAlignCenter />
      </button>
      <button onClick={() => alignText("right")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatAlignRight />
      </button>
      <button onClick={() => alignText("justify")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatAlignJustify />
      </button>

      {/* Listes */}
      <button onClick={() => insertList("number")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatListNumbered />
      </button>
      <button onClick={() => insertList("bullet")} className="size-10 flex items-center justify-center px-2 gap-2 hover:bg-gray-200 rounded-none border-r border-black h-full">
        <MdFormatListBulleted />
      </button>
    </div>
  );
};

export default Toolbar;
