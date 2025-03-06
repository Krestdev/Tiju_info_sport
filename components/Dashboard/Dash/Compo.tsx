import { ArrowRight } from 'lucide-react';
import React from 'react'
import { IconType } from 'react-icons/lib';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    children: React.JSX.Element
    texte: string,
    page: string,
    width: string
}

const Compo = ({ children, texte, page, width }: Props) => {
    return (
        <div className={`${width}  h-fit flex flex-col justify-between gap-[9px] rounded-[6px] border border-[#182067]/20 `}>
            <div className='flex flex-row items-center justify-between gap-4 px-5 py-3 bg-[#FAFAFA] '>
                <p className='font-medium text-[16px] leading-[20.8px] '>{texte}</p>
                <Select defaultValue="semaine">
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
            </div>
            {
                children
            }
            <div className='flex flex-row items-center justify-between px-5 py-3 border-t bg-[#0128AE]/10 '>
                <p className='font-normal text-[16px] leading-[20.8px] '>{page}</p>
                <ArrowRight />
            </div>
        </div>
    )
}

export default Compo
