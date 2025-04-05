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
      className='w-full'
    >
      <CarouselContent className='w-full px-7 md:px-0'>
        {pub.map((x, i) => {
          return (
            <CarouselItem key={i} className='w-full'>
              <Link
                // onClick={() => handleClick(x)}
                href={x.url}
                target="_blank"
                className='w-full'
              >
                <div
                  className={`w-full flex items-center justify-center ${taille === 'h-[200px]' ? 'bg-repeat' : ''}`}
                  style={taille === 'h-[200px]' ? { backgroundImage: `url(https://tiju.krestdev.com/api/image/${x.image.id})`, height: 200} : {}}
                  // style={{
                  //   backgroundImage: `url(https://tiju.krestdev.com/api/image/${x.image.id})`,
                  //   height: 200,
                  //   // width: "100%",
                  // }}
                >
                  {taille === 'h-[200px]' ? "" : (
                    <img
                      src={`https://tiju.krestdev.com/api/image/${x.image.id}`}
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
