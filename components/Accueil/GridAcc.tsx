import { Article } from '@/data/temps'
import { isImage } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

interface Props {
    gridAff: Article[]
}

const GridAcc = ({ gridAff }: Props) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-7'>
            {
                gridAff.slice(0,6).map(x => (
                    <Link href={`/user/detail-article/${x.id}`} key={x.id} className='max-w-[398px] w-full flex flex-col gap-5'>
                        {x.media && (
                            isImage(x.media[0]) ? (
                                <img
                                    className="max-w-[398px] w-full h-auto aspect-video rounded-[6px] object-cover"
                                    src={x.media[0]}
                                    alt={`${x.type} - ${x.titre}`}
                                />
                            ) : (
                                <video
                                    className="max-w-[398px] w-full h-auto aspect-video rounded-[6px] object-cover"
                                    controls
                                    muted
                                    loop
                                    src={x.media[0]}
                                >
                                    Votre navigateur ne supporte pas la lecture de cette vidéo.
                                </video>
                            )
                        )}
                        <div>
                            <p className='text-[#A1A1A1] text-[20px] uppercase font-medium leading-[26px] font-oswald'>{x.type}</p>
                            <p className='text-[28px] font-medium leading-[36.4px] line-clamp-2 font-oswald'>{x.titre}</p>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default GridAcc
