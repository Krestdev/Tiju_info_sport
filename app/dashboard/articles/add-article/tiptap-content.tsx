'use client'
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import TextAlign from '@tiptap/extension-text-align'

import TiptapMenu from './tiptap-menu'
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface TiptapProps{
    value:string;
    onValueChange: (content:string)=>void;
}

function TiptapEditor({value, onValueChange}:TiptapProps) {
    const [mounted, setMounted] = useState(false)
    const editor = useEditor({
        extensions: [StarterKit, Image, TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
          defaultAlignment: 'left',
        })],
        content: value,
        onUpdate: ({editor}) => {
            const currentValue = editor.getHTML();
            onValueChange(currentValue);
        },
        editorProps: {
            attributes: {
                class: "min-h-[300px] border rounded-none p-4 prose prose-sm max-w-none my-0"
            }
        }
    })

    // Hydratation différée
  useEffect(() => {
    setMounted(true)
    return () => {
      if (editor) editor.destroy()
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[150px] border rounded-md p-4 flex items-center justify-center gap-2">
        <span>{"chargement"}</span><Loader className="animate-spin"/>
      </div>
    )
  }

  return (
    <div>
    <TiptapMenu editor={editor}/>
    <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor