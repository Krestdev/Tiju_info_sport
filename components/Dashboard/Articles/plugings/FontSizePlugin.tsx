import { 
  $getSelection, 
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  TextNode,
  RangeSelection
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const FONT_SIZES = ['10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '40', '48', '56', '64', '72'];

export function FontSizePlugin() {
  const [editor] = useLexicalComposerContext();

  const applyFontSize = (fontSize: string) => {
    editor.update(() => {
      const selection = $getSelection();
      
      if (!$isRangeSelection(selection)) return;

      // Sauvegarder la sélection originale
      const anchor = selection.anchor;
      const focus = selection.focus;
      const textContent = selection.getTextContent();

      // Traiter chaque nœud sélectionné
      const selectedNodes = selection.getNodes();
      const newNodes: TextNode[] = [];

      selectedNodes.forEach((node) => {
        if ($isTextNode(node)) {
          const text = node.getTextContent();
          const textNode = new TextNode(text);
          textNode.setStyle(`font-size: ${fontSize}px`);
          newNodes.push(textNode);
          node.replace(textNode);
        }
      });

      // Restaurer la sélection
      if (newNodes.length > 0) {
        const firstNode = newNodes[0];
        const lastNode = newNodes[newNodes.length - 1];
        
        selection.anchor.set(
          firstNode.__key,
          anchor.offset,
          anchor.type
        );
        selection.focus.set(
          lastNode.__key,
          focus.offset > lastNode.getTextContentSize() 
            ? lastNode.getTextContentSize() 
            : focus.offset,
          focus.type
        );
        
        $setSelection(selection);
      }
    });
  };

  return (
    <select 
      onChange={(e) => applyFontSize(e.target.value)}
      className="p-2 border rounded mr-2"
      defaultValue=""
    >
      <option value="" disabled>Taille</option>
      {FONT_SIZES.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  );
}