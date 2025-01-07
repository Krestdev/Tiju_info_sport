import { Categorie, Pubs } from '@/data/temps'
import Link from 'next/link'
import React from 'react'

interface Aff {
    gridAff: Categorie[] | undefined,
    pubAff: Pubs[] | undefined
}

const UnePub = ({gridAff, pubAff}: Aff) => {
  return (
    <div className='flex flex-col px-7 py-5 gap-7 max-w-[360px] w-full'>
                <div className='flex flex-col gap-5'>
                    <p className='text-[20px] font-semibold'>{"À la une"}</p>
                    <div className='flex flex-col gap-2'>
                        {
                            gridAff?.slice(0, 3).map(x => x.donnees.slice(1, 3).map(x => {
                                return (
                                    <Link key={x.id} href={`/user/detail-article/${x.id}`} className='flex flex-row items-center gap-4 p-4'>
                                        <img src={x.media} alt={x.type} className='object-cover max-w-[80px] max-h-[60px] h-full w-full rounded-lg' />
                                        <p className='line-clamp-3 font-medium'>{x.titre}</p>
                                    </Link>
                                )
                            })
                            )
                        }
                    </div>
                </div>
                <div className='flex flex-col w-full gap-7'>
                    {
                        pubAff?.slice(0,2).map(x =>{
                            return(
                                <Link key={x.id} href={x.lien}>
                                    <img className='w-[300px] h-[300px] object-cover' src={x.image} alt={x.description} />
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
  )
}

export default UnePub
