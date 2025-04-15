// components/editor/plugins/ImagePlugin.tsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { $createImageNode } from './custom/ImageNode'; // Adjust the import path as necessary
import { useEffect } from 'react';

export function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  const insertImage = (src: string) => {
    editor.update(() => {
      const imageNode = $createImageNode(src);
      $insertNodes([imageNode]);
    });
  };

//   // Expose to window for demo purposes (replace with proper image upload in production)
//   if (typeof window !== 'undefined') {
//     (window as any).insertImage = insertImage;
//   }

  // Register the insertImage function globally for the toolbar
  useEffect(() => {
    (window as any).insertImage = insertImage;
    return () => {
      delete (window as any).insertImage;
    };
  }, [editor]);

  return null;
}