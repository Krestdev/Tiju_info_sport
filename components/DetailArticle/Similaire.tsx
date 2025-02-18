import useStore from '@/context/store'
import { Article, Categorie } from '@/data/temps'
import Link from 'next/link'
import React from 'react'


interface Props {
    similaire: Article | undefined
    sim: Categorie | undefined,
}

const Similaire = ({ sim, similaire }: Props) => {
    

    return (
        <div className='max-w-[360px] w-full flex flex-col gap-4'>
            <div className='w-full'>
                <h2 className='flex flex-row justify-start font-oswald font-medium'>{`Dans ${sim?.nom}`}</h2>
                {
                    sim?.donnees.filter(x => x !== similaire).slice(0, 2).map(item => (
                        <Link href={`/user/detail-article/${item.id}`} key={item.id} className='flex flex-col gap-7 px-5 py-4'>
                            <img src={item.media && item.media[0]} alt={item.type} className='max-w-[264px] w-full h-auto aspect-video rounded-[6px] object-cover' />
                            <div className='flex flex-col'>
                                <p className='text-[#A1A1A1]'>{item.type}</p>
                                <h2 className='line-clamp-2 font-bold'>{item.titre}</h2>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Similaire
