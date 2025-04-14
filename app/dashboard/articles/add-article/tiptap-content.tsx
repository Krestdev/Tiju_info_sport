'use client'
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"

import TiptapMenu from './tiptap-menu'

interface TiptapProps{
    value:string;
}

function TiptapEditor({value}:TiptapProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editorProps: {
            attributes: {
                class: "min-h-[300px] border rounded-none p-4 prose prose-sm max-w-none my-0"
            }
        }
    })
  return (
    <div>
    <TiptapMenu editor={editor}/>
    <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor