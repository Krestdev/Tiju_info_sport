"use client";

import useStore from '@/context/store';
import Link from 'next/link';
import React from 'react';

import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Pubs } from '@/data/temps';
import { event } from "nextjs-google-analytics";

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

  const handleClick = () => {
    event("click", {
      category: "interaction",
      label: "Publicité",
      value: 1,
    });
  };

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
              <Link onClick={handleClick} href={x.lien} target="_blank">
                <div className='w-full flex items-center justify-center'>
                  <img src={x.image} alt={settings?.pub || "Publicité"} className={`w-full object-cover ${taille} ${clip}`} />
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
