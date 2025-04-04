import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getRoot } from "lexical";
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdStrikethroughS, MdImage } from "react-icons/md";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageNode } from "./ImageNode"; 

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        editor.update(() => {
          const imageNode = new ImageNode(src);
          const root = $getRoot();
          root.append(imageNode); 
        });
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <div className="flex contain-layout border-b items-center bg-gray-100 border-black h-10">
      <Button type="button" variant="ghost" onClick={() => formatText("bold")} className="size-10 border-r border-[#545454]">
        <MdFormatBold />
      </Button>
      <Button type="button" variant="ghost" onClick={() => formatText("italic")} className="size-10 border-r border-[#545454]">
        <MdFormatItalic />
      </Button>
      <Button type="button" variant="ghost" onClick={() => formatText("underline")} className="size-10 border-r border-[#545454]">
        <MdFormatUnderlined />
      </Button>
      <Button type="button" variant="ghost" onClick={() => formatText("strikethrough")} className="size-10 border-r border-[#545454]">
        <MdStrikethroughS />
      </Button>
      <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()} className="size-10 border-r border-[#545454]">
        <MdImage />
      </Button>
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
};

export default Toolbar;
