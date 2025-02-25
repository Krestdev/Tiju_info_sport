"use client";

import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Pubs } from '@/data/temps';

interface pub {
  pub: Pubs[] | undefined
  taille: string
  clip: string
}

const PubsComp = ({
  pub,
  clip,
  taille
}: pub) => {
  const { settings } = useStore();

  return (

    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {
          pub?.map((x, i) => (
            <CarouselItem key={i}>
              <Link href={x.lien} target="_blank">
                <div className='w-full flex items-center justify-center'>
                  <img src={x.image} alt={settings?.pub || "Publicité"} className={`w-full object-cover ${taille} ${clip}`}/>
                </div>
              </Link>
            </CarouselItem>
          ))
        }
      </CarouselContent>
    </Carousel>
  );
};

export default PubsComp;
