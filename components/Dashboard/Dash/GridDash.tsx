import React from 'react'

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
        <div className='flex flex-row gap-3 px-5 py-3 h-[140px] w-full'>
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
