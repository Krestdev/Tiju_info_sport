import { Article } from '@/data/temps'
import Link from 'next/link'
import React from 'react'

interface Props {
    article: Article[]
}

const GridAll = ({ article }: Props) => {
    return (
        <div className='containerBloc pt-5'>
            <div className='w-full flex items-center justify-start py-5 gap-3'>
                <div className='px-4 gap-2 w-fit bg-[#EEEEEE] rounded-[6px]'><h1>{"Tous les produits"}</h1></div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14'>
            {
                article.length > 0 ?
                article.map(x => (
                    <Link key={x.id} href={`/user/detail-article/${x.id}`} className='max-w-[400px] w-full flex flex-col items-center gap-3'>
                        {x.media && <img src={x.media[0]} alt={x.type} className='max-w-[400px] w-full h-auto aspect-video object-cover rounded-lg'/>}
                        <div>
                            <p className='text-[#545454]'>{x.type}</p>
                            <h3 className='line-clamp-2'>{x.titre}</h3>
                        </div>
                    </Link>
                )):
                "Aucun element trouvé..."
            }
        </div>
        </div>
    )
}

export default GridAll
