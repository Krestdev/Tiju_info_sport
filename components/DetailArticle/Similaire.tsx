import { Article, Categorie } from '@/data/temps'
import Link from 'next/link'
import React from 'react'


interface Props {
    tous: Categorie[] | undefined,
    similaire: Article | undefined
}

const Similaire = ({ similaire, tous }: Props) => {

    const sim = tous?.find(x => x.donnees.find(a => a === similaire))

    return (
        <div className='flex flex-col gap-4 w-full'>
            <div className='w-full'>
                <h2 className='flex flex-row justify-start'>{`Dans ${sim?.nom}`}</h2>
                {
                    sim?.donnees.filter(x => x !== similaire).slice(0, 2).map(item => (
                        <Link href={`/user/detail-article/${item.id}`} key={item.id} className='flex flex-col gap-7 px-5 py-4'>
                            <img src={item.media} alt={item.type} className='max-w-[264px] w-full h-[140px] rounded-lg object-cover' />
                            <div className='flex flex-col'>
                                <p className='text-[#A1A1A1]'>{item.type}</p>
                                <h2 className='line-clamp-2'>{item.titre}</h2>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Similaire
