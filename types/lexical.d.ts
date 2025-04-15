// types/lexical.d.ts
import { TextFormatType } from 'lexical';

declare module 'lexical' {
  interface TextFormatType {
    fontSize: string;
  }
}