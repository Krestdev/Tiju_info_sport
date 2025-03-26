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
    >
      <CarouselContent>
        {pub?.map((x, i) => {
          return (
            <CarouselItem key={i}>
              <Link
                // onClick={() => handleClick(x)}
                href={x.url}
                target="_blank"
              >
                <div className="w-full flex items-center justify-center">
                  <img
                    src={x.image}
                    alt={settings?.pub || "Publicité"}
                    className={`w-full object-cover ${taille} ${clip}`}
                  />
                </div>
              </Link>
            </CarouselItem>
          )})}
      </CarouselContent>
    </Carousel>
  );
};

export default PubsComp;
