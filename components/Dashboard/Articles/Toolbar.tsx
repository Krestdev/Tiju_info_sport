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
import { Button } from "@/components/ui/button";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <div className="flex contain-layout border-b items-center bg-gray-100 border-black h-10">
      <Button type="button" variant="ghost" onClick={() => formatText("bold")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdFormatBold />
      </Button>
      <Button type="button" variant="ghost" onClick={() => formatText("italic")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdFormatItalic />
      </Button>
      <Button type="button" variant="ghost" onClick={() => formatText("underline")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdFormatUnderlined />
      </Button>
      <Button type="button" variant="ghost" onClick={() => formatText("strikethrough")} className="size-10 rounded-none border-r border-[#545454] flex items-center gap-2 px-2">
        <MdStrikethroughS />
      </Button>
    </div>
  );
};


export default Toolbar;
