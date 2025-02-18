import { Article } from '@/data/temps'
import Link from 'next/link'
import React from 'react'

interface Props {
    liste: Article[] | undefined
}

const GridSport = ({ liste }: Props) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
            {
                liste?.map(x => (
                    <Link href={`/user/detail-article/${x.id}`} key={x.id} className='flex flex-col max-w-[400px] w-full px-5 py-4 gap-7'>
                        <img src={x.media && x.media[0]} alt={x.type} className='max-w-[360px] w-full h-[203px] object-cover rounded-[6px]' />
                        <div>
                            <p className='text-[#A1A1A1]'>{x.type}</p>
                            <h2 className='line-clamp-2 font-bold'>{x.titre}</h2>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default GridSport
