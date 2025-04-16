
import toolbarIconsList from "./toolbarIconsList";
import useOnClickListener from "./useOnClickListener";
import { createPortal } from "react-dom";
import FloatingLinkEditor from "./FloatingLinkEditor";
import ImagesPlugin from "../CustomPlugins/ImagePlugin";

const LexicalEditorTopBar = () => {
  const { onClick, selectedEventTypes, blockType, isLink, editor, modal } =
    useOnClickListener();

  const isIconSelected = (plugin) =>
    selectedEventTypes.includes(plugin.event) ||
    blockType.includes(plugin.event);

  return (
    <div className="flex flex-row gap-2 bg-white ">

      {toolbarIconsList.map((plugin) => (
        <div key={plugin.id} className="cursor-pointer hover:bg-[#A1A1A1]">
          {
            <plugin.Icon
              sx={plugin.iconSx}
              onClick={() => onClick(plugin.event)}
              color={isIconSelected(plugin) ? "secondary" : undefined}
              className="size-5 "
            />
          }
        </div>
      ))}
      <ImagesPlugin captionsEnabled={false} />
      {modal}
      {isLink &&
        createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
    </div>
  );
};

export default LexicalEditorTopBar;
