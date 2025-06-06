import { ArrowRight, X } from 'lucide-react';
import React, { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from 'next/link';
import { DatePick } from '../DatePick';
import { DateRange } from 'react-day-picker';

interface Props {
  children: React.JSX.Element;
  texte: string;
  page: string;
  width: string;
  value: string;
  setValue: (value: string) => void;
  isLink?: boolean;
  link: string;
  setDateRanges: React.Dispatch<React.SetStateAction<{
    [key: string]: DateRange | undefined;
  }>>;
  dateRanges: DateRange | undefined;
  rangeKey: string;
}

const Compo = ({ children, texte, page, width, setValue, isLink, link, setDateRanges, rangeKey }: Props) => {

  const handleValueChange = (value: string) => {
    setValue(value);
    
  };  

  const handleChange = (key: string, newValue: DateRange | undefined) => {
    setDateRanges((prev) => ({...prev, [key]: newValue}));
  };

  return (
    <div className={`${width} h-fit flex flex-col justify-between gap-[9px] rounded-[6px] border border-[#182067]/20`}>
      <div className='flex flex-row items-center justify-between gap-4 px-5 py-3 bg-[#FAFAFA]'>
        <p className='font-medium text-[16px] leading-[20.8px]'>{texte}</p>
        <div className='flex flex-row items-center gap-2'>
          <Select defaultValue="semaine" onValueChange={handleValueChange}>
            <SelectTrigger className="w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="semaine">{"Cette semaine"}</SelectItem>
                <SelectItem value="mois">{"Ce mois"}</SelectItem>
                <SelectItem value="annee">{"Cette année"}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="relative">
            <DatePick
              onChange={(range) => handleChange(rangeKey, range)} 
              show={false}
            />
          </div>
        </div>
      </div>

      {children}

      {isLink && (
        <Link href={link} className='flex flex-row items-center justify-between px-5 py-3 border-t bg-[#0128AE]/10'>
          <p className='font-normal text-[16px] leading-[20.8px]'>{page}</p>
          <ArrowRight />
        </Link>
      )}
    </div>
  );
};

export default Compo;
