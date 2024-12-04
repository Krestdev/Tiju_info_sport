"use client";
import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Article } from '@/data/temps';


interface Aff {
    gridAff: Article[]
}
const Hero = ({ gridAff }: Aff) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    return (
        <div className='w-full min-h-[480px] h-full'>
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
                            style={{
                                backgroundImage: `url(${x.media})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <Link href={`/detail-article/${x.id}`}>
                                <div
                                    className={`items-center justify-center bg-gradient-to-b from-[#012BAE]/70 to-[#182067]/100  md:${x.media ? 'bg-[#182067]' : 'bg-gradient-to-b from-[#012BAE]/60 to-[#182067]/100'}`}
                                >
                                    <div className='containerBloc min-h-[480px] w-screen md:w-full flex flex-row items-center gap-5 justify-center'>
                                        {x.media && (

                                            isImage(x.media) ? (
                                                <img
                                                    className='hidden md:flex max-h-[360px] max-w-[640px] w-full object-cover rounded-xl'
                                                    src={x.media}
                                                    alt={x.type}
                                                />
                                            ) : (
                                                <video
                                                    className='hidden md:flex max-h-[360px] max-w-[640px] w-full object-cover rounded-xl'
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
                                        <div
                                            className={`h-full flex flex-col md:${x.media ? 'items-start text-start' : 'items-center text-center'} justify-center text-white gap-1`}
                                        >
                                            <p className='uppercase text-[#80CEFF]'>{x.type}</p>
                                            <h1>{x.titre}</h1>
                                            <p>{x.ajouteLe}</p>
                                        </div>
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
