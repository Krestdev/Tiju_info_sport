"use client";

import useStore from '@/context/store';
import Link from 'next/link';
import React, { useEffect } from 'react';

import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { event } from "nextjs-google-analytics";

interface PubProps {
  pub: Advertisement[];
  taille: string;
  clip: string;
}

const PubsComp = ({ pub, clip, taille }: PubProps) => {
  const { settings, setClick } = useStore();

  // const handleClick = (clickedPub: Advertisement) => {
  //   // Incrémente le compteur de clics localement
  //   const updatedPub = { ...clickedPub, nbClick: clickedPub.nbClick + 1 };

  //   // Met à jour le store
  //   setClick(updatedPub);

  //   // Enregistre l'événement dans Google Analytics
  //   event("click", {
  //     category: "Publicité",
  //     label: clickedPub.nom,
  //     value: 1,
  //   });
  // };

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className='mx-auto max-w-7xl w-full'
    >
      <CarouselContent className='w-full px-7 md:px-0'>
        {pub.map((x, i) => {
          return (
            <CarouselItem key={i} className='w-full h-auto aspect-[4/1]'>
              <Link
                // onClick={() => handleClick(x)}
                href={x.url}
                target="_blank"
                className='w-full h-full'
              >
                <div
                  className={`w-full h-full flex items-center justify-center bg-contain ${taille === 'h-[200px]' && 'bg-repeat-x'}`}
                  style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API}image/${x.image.id})`}}
                >
                  {taille === 'h-[200px]' ? "" : (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API}image/${x.image.id}`}
                      alt={settings?.pub || "Publicité"}
                      className={`w-full object-cover ${taille} ${clip}`}
                    />
                  )}
                </div>

              </Link>
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default PubsComp;
