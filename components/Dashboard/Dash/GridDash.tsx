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
    tableau: {
        value: number | undefined;
        category: string;
        bgColor: string;
        color: string;
    }[],
}

const GridDash = ({ tableau }: Props) => {
    return (
        <div className='flex flex-row gap-3 px-5 py-3 max-h-[140px] h-full w-full'>
            {
                tableau.map((x, i) => {
                    return (
                        <div key={i} className={`w-full rounded-[6px] flex flex-col gap-2 p-3 ${x.bgColor}`}>
                            <p className={`text-[40px] font-bold leading-[52px] ${x.color}`}>{x.value}</p>
                            <p className='text-[12px] font-normal leading-[15.6px] text-[#545454]'>{x.category}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default GridDash
