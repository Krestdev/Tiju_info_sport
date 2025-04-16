import { RiText } from "react-icons/ri";
import { BsTypeH1 } from "react-icons/bs";
import { BsTypeH2 } from "react-icons/bs";
import { BsListUl } from "react-icons/bs";
import { AiOutlineOrderedList } from "react-icons/ai";
import { MdFormatQuote, MdImage } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { MdUndo } from "react-icons/md";
import { MdRedo } from "react-icons/md";
import { MdFormatBold } from "react-icons/md";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa6";
import { MdInsertLink } from "react-icons/md";
import { BsTextLeft } from "react-icons/bs";
import { BsTextRight } from "react-icons/bs";
import { BsJustify } from "react-icons/bs";




export const eventTypes = {
  paragraph: "paragraph",
  h1: "h1",
  h2: "h2",
  ul: "ul",
  ol: "ol",
  quote: "quote",
  formatCode: "formatCode",
  formatUndo: "formatUndo",
  formatRedo: "formatRedo",
  formatBold: "formatBold",
  formatItalic: "formatItalic",
  formatUnderline: "formatUnderline",
  formatStrike: "formatStrike",
  formatInsertLink: "formatInsertLink",
  formatAlignLeft: "formatAlignLeft",
  formatAlignCenter: "formatAlignCenter",
  formatAlignRight: "formatAlignRight",
  insertImage: "insertImage",
};

const pluginsList = [
  {
    id: 1,
    Icon: RiText,
    event: eventTypes.paragraph,
  },
  {
    id: 2,
    Icon: BsTypeH1,
    event: eventTypes.h1,
  },
  {
    id: 3,
    Icon: BsTypeH2,
    event: eventTypes.h2,
  },
  {
    id: 4,
    Icon: BsListUl,
    event: eventTypes.ul,
  },

  {
    id: 5,
    Icon: AiOutlineOrderedList,
    event: eventTypes.ol,
  },
  {
    id: 6,
    Icon: MdFormatQuote,
    event: eventTypes.quote,
  },

  {
    id: 7,
    Icon: BsCodeSlash,
    event: eventTypes.formatCode,
  },
  {
    id: 8,
    Icon: MdUndo,
    event: eventTypes.formatUndo,
  },
  {
    id: 9,
    Icon: MdRedo,
    event: eventTypes.formatRedo,
  },
  {
    id: 10,
    Icon: MdFormatBold,
    event: eventTypes.formatBold,
  },
  {
    id: 11,
    Icon: FaItalic,
    event: eventTypes.formatItalic,
  },
  {
    id: 12,
    Icon: FaUnderline,
    event: eventTypes.formatUnderline,
  },
  // { // reactive it if you need it
  //   id: 13,
  //   Icon: StrikethroughSOutlinedIcon,
  //   event: eventTypes.formatStrike,
  // },
  {
    id: 13,
    Icon: MdImage,
    event: eventTypes.insertImage,
  },
  {
    id: 14,
    Icon: MdInsertLink,
    event: eventTypes.formatInsertLink,
  },
  {
    id: 15,
    Icon: BsTextLeft,
    event: eventTypes.formatAlignLeft,
  },

  {
    id: 16,
    Icon: BsJustify,
    event: eventTypes.formatAlignCenter,
  },
  {
    id: 17,
    Icon: BsTextRight,
    event: eventTypes.formatAlignRight,
  },
];

export default pluginsList;
