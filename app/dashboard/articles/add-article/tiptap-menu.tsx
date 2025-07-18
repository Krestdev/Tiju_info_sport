'use client'
import InsertImage from '@/components/insert-image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SetImageUrl } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, List, ListOrdered, Quote, Redo, SeparatorHorizontal, Strikethrough, Undo, WrapText } from 'lucide-react';
import React from 'react';
import AddYoutubeVideo from './youtube';

function TiptapMenu({editor}:{editor: Editor|null}) {
    if(!editor){
        return null;
    }
    //Logic for a select, it's flashy and thats what I proposed on the design :/
    const [currentStyle, setCurrentStyle] = React.useState('paragraph');
    React.useEffect(()=>{
        if (editor.isActive('paragraph')) {
            setCurrentStyle('paragraph')
          } else if (editor.isActive('heading', { level: 1 })) {
            setCurrentStyle('h1')
          } else if (editor.isActive('heading', { level: 2 })) {
            setCurrentStyle('h2')
          } else if (editor.isActive('heading', { level: 3 })) {
            setCurrentStyle('h3')
          } else if (editor.isActive('heading', { level: 4 })) {
            setCurrentStyle('h4')
          }
    },[editor, editor?.state.selection]);

    //Select handler
    const handleValueChange = (value: string) => {
        switch (value) {
          case 'paragraph':
            editor.chain().focus().setParagraph().run()
            break
          case 'h1':
            editor.chain().focus().toggleHeading({ level: 1 }).run()
            break
          case 'h2':
            editor.chain().focus().toggleHeading({ level: 2 }).run()
            break
          case 'h3':
            editor.chain().focus().toggleHeading({ level: 3 }).run()
            break
          case 'h4':
            editor.chain().focus().toggleHeading({ level: 4 }).run()
            break
        }
      }

      const addImage = (image:string, caption?:string) => {
        if(caption){
          editor.chain().focus().setFigure({ src: SetImageUrl(image), caption }).run()
        } else {
          editor.chain().focus().setImage({ src: SetImageUrl(image) }).run()
        }
      }

    const addYoutubeVideo = (url:string) => {
      editor.commands.setYoutubeVideo({
        src: url
      })
    }

    const handleTableAction = (action: string) => {
      if (!editor) return;

      switch (action) {
        case 'addTable':
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          break;
        case 'addColumnBefore':
          editor.chain().focus().addColumnBefore().run();
          break;
        case 'addColumnAfter':
          editor.chain().focus().addColumnAfter().run();
          break;
        case 'deleteColumn':
          editor.chain().focus().deleteColumn().run();
          break;
        case 'addRowBefore':
          editor.chain().focus().addRowBefore().run();
          break;
        case 'addRowAfter':
          editor.chain().focus().addRowAfter().run();
          break;
        case 'deleteRow':
          editor.chain().focus().deleteRow().run();
          break;
        case 'mergeCells':
          editor.chain().focus().mergeCells().run();
          break;
        case 'splitCell':
          editor.chain().focus().splitCell().run();
          break;
        case 'toggleHeaderRow':
          editor.chain().focus().toggleHeaderRow().run();
          break;
        case 'toggleHeaderColumn':
          editor.chain().focus().toggleHeaderColumn().run();
          break;
        case 'toggleHeaderCell':
          editor.chain().focus().toggleHeaderCell().run();
          break;
        case 'dropTable':
          editor.chain().focus().deleteTable().run();
          break;
        default:
          break;
      }
    }


    return (
          <div className="flex flex-wrap items-center divide-x divide-y divide-input border border-input border-b-0">
            {/* <Button variant={editor.isActive('paragraph') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setParagraph().run()}}
            >
              {"Paragraph"}
            </Button> */}
            <Select defaultValue={currentStyle} onValueChange={handleValueChange}>
                <SelectTrigger className='w-40 border-none focus:ring-0'>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='paragraph'>{"Paragraphe"}</SelectItem>
                    <SelectItem value='h1'>{"Titre 1"}</SelectItem>
                    <SelectItem value='h2'>{"Titre 2"}</SelectItem>
                    <SelectItem value='h3'>{"Titre 3"}</SelectItem>
                    <SelectItem value='h4' >{"Titre 4"}</SelectItem>
                </SelectContent>
            </Select>
            <Button size={"icon"} variant={editor.isActive('bold') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBold().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleBold()
                  .run()
              }
            >
              <Bold/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('italic') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleItalic().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleItalic()
                  .run()
              }
            >
              <Italic/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('strike') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleStrike().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleStrike()
                  .run()
              }
            >
              <Strikethrough/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'left'}) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('left').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('left').run()
              }
            >
              <AlignLeft/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'center'}) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('center').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('center').run()
              }
            >
              <AlignCenter/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'right'}) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('right').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('right').run()
              }
            >
              <AlignRight/>
            </Button>
            <Button size={"icon"} variant={editor.isActive({textAlign: 'justify'}) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().setTextAlign('justify').run()}}
              disabled={
                !editor.can().chain().focus().setTextAlign('justify').run()
              }
            >
              <AlignJustify/>
            </Button>
            <InsertImage image={undefined} onChange={addImage}/>
            <AddYoutubeVideo addVideo={addYoutubeVideo}/>
            {/* <Button variant={editor.isActive('table') ? "default" : "ghost"} family={"sans"} disabled={!editor.can().chain().focus().insertTable().run()}
            onClick={(e) =>{ e.preventDefault(); editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}}>
              {"Table"}
            </Button> */}
            <Select onValueChange={(value) => handleTableAction(value)}>
              <SelectTrigger className='w-48 focus:ring-0'>
                <SelectValue placeholder="Tableau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='addTable'>{"Ajouter une table"}</SelectItem>
                <SelectItem value='addColumnBefore'>{"Ajouter une colonne avant"}</SelectItem>
                <SelectItem value='addColumnAfter'>{"Ajouter une colonne après"}</SelectItem>
                <SelectItem value='deleteColumn'>{"Supprimer une colonne"}</SelectItem>
                <SelectItem value='addRowBefore'>{"Ajouter une ligne avant"}</SelectItem>
                <SelectItem value='addRowAfter'>{"Ajouter une ligne après"}</SelectItem>
                <SelectItem value='deleteRow'>{"Supprimer une ligne"}</SelectItem>
                <SelectItem value='mergeCells'>{"Fusionner les cellules"}</SelectItem>
                <SelectItem value='splitCell'>{"Diviser la cellule"}</SelectItem>
                <SelectItem value='toggleHeaderRow'>{"Basculer ligne d’en-tête"}</SelectItem>
                <SelectItem value='toggleHeaderColumn'>{"Basculer colonne d’en-tête"}</SelectItem>
                <SelectItem value='toggleHeaderCell'>{"Basculer cellule d’en-tête"}</SelectItem>
                <SelectItem value='dropTable'>{"Supprimer la table"}</SelectItem>
              </SelectContent>
            </Select>
{/*             <button
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleCode().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .toggleCode()
                  .run()
              }
              className={editor.isActive('code') ? 'is-active' : ''}
            >
              Code
            </button> */}
            {/* <button onClick={(e) =>{e.preventDefault(); editor.chain().focus().unsetAllMarks().run()}}>
              Clear marks
            </button>
            <button onClick={(e) =>{e.preventDefault(); editor.chain().focus().clearNodes().run()}}>
              Clear nodes
            </button> */}
            {/* <Button size={"icon"} variant={editor.isActive('heading', { level: 1 }) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run()}}
            >
              <Heading1/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('heading', { level: 2 }) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run()}}
              className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
              <Heading2/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('heading', { level: 3 }) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run()}}
              className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
            >
              <Heading3/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('heading', { level: 4 }) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 4 }).run()}}
              className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
            >
              <Heading4/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('heading', { level: 5 }) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 5 }).run()}}
              className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
            >
              <Heading5/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('heading', { level: 6 }) ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleHeading({ level: 6 }).run()}}
              className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
            >
              <Heading6/>
            </Button> */}
            <Button size={"icon"} variant={editor.isActive('bulletList') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBulletList().run()}}
            >
              <List/>
            </Button>
            <Button size={"icon"} variant={editor.isActive('orderedList') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleOrderedList().run()}}
            >
              <ListOrdered/>
            </Button>
            {/* <Button size={"icon"} variant={editor.isActive('bold') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleCodeBlock().run()}}
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
            >
              Code block
            </Button> */}
            <Button size={"icon"} variant={editor.isActive('blockquote') ? "default" : "ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().toggleBlockquote().run()}}
            >
              <Quote/>
            </Button>
            <Button size={"icon"} variant={"ghost"} family={"sans"}
             onClick={(e) =>{e.preventDefault(); editor.chain().focus().setHorizontalRule().run()}}>
              <SeparatorHorizontal/>
            </Button>
            <Button size={"icon"} variant={"ghost"} family={"sans"}
             onClick={(e) =>{e.preventDefault(); editor.chain().focus().setHardBreak().run()}}>
              <WrapText/>
            </Button>
            <Button size={"icon"} variant={"ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().undo().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .undo()
                  .run()
              }
            >
              <Undo/>
            </Button>
            <Button size={"icon"} variant={"ghost"} family={"sans"}
              onClick={(e) =>{e.preventDefault(); editor.chain().focus().redo().run()}}
              disabled={
                !editor.can()
                  .chain()
                  .focus()
                  .redo()
                  .run()
              }
            >
              <Redo/>
            </Button>
            {/* <button
              onClick={() => editor.chain().focus().setColor('#958DF1').run()}
              className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
            >
              Purple
            </button> */}
          </div>
      )
}

export default TiptapMenu