import React from 'react'
import { IconType } from 'react-icons/lib';

// interface Props {
//     icon: string,
//     value: number,
//     category: string,
//     iconBgColor: string
// }

interface Props {
    tableau: {
        icon: IconType;
        value: number | undefined;
        category: string;
        color: string;
    }[],
}

const GridDash = ({ tableau }: Props) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-full'>
            {
                tableau.map((tab, index) => (
                    <div key={index} className="w-full px-4 py-6 bg-white rounded shadow-sm flex gap-6">
                        <span className={`w-10 h-10 rounded-full inline-flex items-center justify-center bg-${tab.color}-100 `}>
                            {<tab.icon className={`text-${tab.color}-500 size-7`}/>}
                        </span>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-400">{tab.category}</span>
                            <span className="text-xl font-bold text-gray-900">{tab.value}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default GridDash
