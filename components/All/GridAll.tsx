
import useStore from '@/context/store';
import Link from 'next/link'
import React from 'react'

interface Props {
    article: Article[]
}

const isImage = (media: string | undefined): boolean => {
    if (!media) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
};

const GridAll = ({ article }: Props) => {
    const { settings } = useStore()
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
                                {x.images && (
                                    isImage(x.images[0] ? x.images[0].url : settings.noImage) ? (
                                        <img
                                            className='max-w-[400px] w-full h-auto aspect-video object-cover rounded-lg'
                                            src={x.images[0] ? x.images[0].url : settings.noImage}
                                            alt={`${x.type} - ${x.title}`}
                                        />
                                    ) : (
                                        <video
                                            className='max-w-[400px] w-full h-auto aspect-video object-cover rounded-lg'
                                            controls
                                            autoPlay
                                            muted
                                            loop
                                            src={x.images[0] ? x.images[0].url : settings.noImage}
                                        >
                                            Votre navigateur ne supporte pas la lecture de cette vidéo.
                                        </video>
                                    )
                                )}
                                <div>
                                    <p className='text-[#545454]'>{x.type}</p>
                                    <h3 className='line-clamp-2'>{x.title}</h3>
                                </div>
                            </Link>
                        )) :
                        "Aucun element trouvé..."
                }
            </div>
        </div>
    )
}

export default GridAll
