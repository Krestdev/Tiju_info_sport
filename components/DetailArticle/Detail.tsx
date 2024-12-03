import { Article } from '@/data/temps'
import Link from 'next/link';
import React, { useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";

interface Details {
    details: Article,
    similaire: Article[] | undefined
}

const Detail = ({ details, similaire }: Details) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const handleImageClick = (src: string) => {
        setFullscreenImage(src);
    };

    const handleCloseFullscreen = () => {
        setFullscreenImage(null);
    };

    console.log(similaire);


    return (
        <div className='containerBloc flex flex-col lg:flex-row gap-5'>
            <div className='flex flex-col gap-5 md:gap-7 px-5 max-w-[844px]'>
                <h2>{details.titre}</h2>
                {details.media && (
                    isImage(details.media) ? (
                        <img
                            onClick={() => handleImageClick(`${details.media}`)}
                            className="h-[300px] md:h-[400px] md:max-w-[844px] w-screen md:w-auto md:p-0 object-cover cursor-pointer"
                            src={details.media}
                            alt={`${details.type}`}
                        />
                    ) : (
                        <video
                            onClick={() => handleImageClick(`${details.media}`)}
                            className="h-[300px] md:h-[400px] md:max-w-[844px] w-screen md:w-auto md:p-0 object-cover cursor-pointer"
                            controls
                            autoPlay
                            muted
                            loop
                            src={details.media}
                        >
                            Votre navigateur ne supporte pas la lecture de cette vidéo.
                        </video>
                    )
                )}
                <p className='text-[#545454]'>{details.ajouteLe}</p>
                <p className='text-[#333333] font-[700px]'>{details.description}</p>
            </div>
            <h2 className='flex lg:hidden border-b-2'>{"Ceci pourrait aussi vous plaire"}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-5 md:gap-8'>
                {
                    similaire?.map(x => (
                        <Link href={`/detail-article/${x.id}`} key={x.id} className='flex flex-col gap-4'>
                            {x.media && (
                                isImage(x.media) ? (
                                    <img
                                        className="h-[300px] md:h-[200px] lg:h-[300px] w-screen md:max-w-[250px] lg:max-w-[300px] md:w-full p-5 md:p-0 object-cover rounded-lg"
                                        src={x.media}
                                        alt={`${x.type}`}
                                    />
                                ) : (
                                    <video
                                        className="h-[300px] md:h-[200px] lg:h-[300px] w-screen md:max-w-[250px] lg:max-w-[300px] md:w-full p-5 md:p-0 object-cover rounded-lg"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        src={x.media}
                                    >
                                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                                    </video>
                                )
                            )}
                            <div className='flex flex-col gap-2'>
                                <p className='text-[#182067] pl-2'>{x.type}</p>
                                <h3 className='line-clamp-2'>{x.titre}</h3>
                            </div>
                        </Link>
                    ))
                }
            </div>
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                    onClick={handleCloseFullscreen}
                >
                    <div className="relative">
                    {fullscreenImage && (
                                isImage(fullscreenImage) ? (
                                    <img
                                        className="max-w-screen-sm md:max-w-screen-lg max-h-screen object-contain"
                                        src={fullscreenImage}
                                    />
                                ) : (
                                    <video
                                        className="max-w-screen-sm md:max-w-screen-lg max-h-screen object-contain"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        src={fullscreenImage}
                                    >
                                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                                    </video>
                                )
                            )}
                        <button
                            className="absolute top-4 right-4 text-white bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCloseFullscreen();
                            }}
                        >
                            <IoCloseOutline size={30}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Detail
