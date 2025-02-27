"use client";

import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Article } from '@/data/temps';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


interface Aff {
    gridAff: Article[]
}
const Hero = ({ gridAff }: Aff) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    const router = useRouter();
    const currentLocale = router

    return (
        <div className='w-full px-7 py-8'>
            <Carousel
                plugins={[
                    Autoplay({
                        delay: 10000,
                    }),
                ]}
            >
                <CarouselContent>
                    {gridAff.map((x) => (
                        <CarouselItem
                            key={x.id}
                            className='h-full'
                        >
                            <Link href={`/user/detail-article/${x.id}`}>
                                <div className={`containerBloc w-full h-auto nw-screen md:w-full ${x.media ? 'md:items-start' : 'md:items-center'} flex flex-col md:flex-row gap-5`}>
                                    {x.media && (

                                        isImage(x.media[0]) ? (
                                            <img
                                                className='md:flex max-w-[640px] w-full h-auto aspect-video  object-cover rounded-[6px]'
                                                src={x.media[0]}
                                                alt={x.type}
                                            />
                                        ) : (
                                            <video
                                                className='md:flex max-w-[640px] w-full h-auto aspect-video object-cover rounded-[6px]'
                                                controls
                                                autoPlay
                                                muted
                                                loop
                                                src={x.media[0]}
                                            >
                                                Votre navigateur ne supporte pas la lecture de cette vidéo.
                                            </video>
                                        )

                                    )}
                                    
                                        <div
                                            className="flex max-w-[512px] w-full h-auto aspect-video flex-col gap-5 pt-10"
                                        >
                                            <div className='px-3 py-2 bg-[#012BAE] w-fit'>
                                                <p className='uppercase text-white'>{x.type}</p>
                                            </div>
                                            <h1 className='line-clamp-2'>{x.titre}</h1>
                                            <p className='line-clamp-3'>{x.description}</p>
                                        </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default Hero;
