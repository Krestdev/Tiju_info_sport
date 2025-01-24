import { Article } from '@/data/temps'
import Link from 'next/link'
import React from 'react'

interface Props {
    article: Article[]
}

const GridAll = ({ article }: Props) => {
    return (
        <div className='containerBloc grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-14 gap-14'>
            {
                article.length > 0 ?
                article.map(x => (
                    <Link key={x.id} href={`/user/detail-article/${x.id}`} className='flex flex-col items-center gap-3'>
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
    )
}

export default GridAll
