"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Article } from "@/data/temps";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import useEmblaCarousel from "embla-carousel-react"; // ✅ Import correct

interface Aff {
  gridAff: Article[];
}

const Hero = ({ gridAff }: Aff) => {
  const router = useRouter();
  const currentLocale = router;

  // ✅ Utilisation correcte de useEmblaCarousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className="containerBloc w-full px-7 py-4 md:py-8">
      <div className="relative">
        <Carousel
          ref={emblaRef} // ✅ Attache le carrousel
          plugins={[
            Autoplay({
              delay: 10000,
            }),
          ]}
        >
          <CarouselContent>
            {gridAff.map((x) => (
              <CarouselItem key={x.id} className="flex flex-col gap-5 h-full">
                <Link
                  href={`/user/detail-article/${x.id}`}
                  className="flex items-center justify-center"
                >
                  <div
                    className={`w-full h-auto nw-screen md:w-full ${x.media ? "md:items-start" : "md:items-center"
                      } flex flex-col md:flex-row gap-5`}
                  >
                    {x.media &&
                      (/\.(jpg|jpeg|png|gif|webp)$/i.test(x.media[0]) ? (
                        <img
                          className="md:flex max-w-[712px] w-full h-auto aspect-video object-cover rounded-[6px]"
                          src={x.media[0]}
                          alt={x.type}
                        />
                      ) : (
                        <video
                          className="md:flex max-w-[712px] w-full h-auto aspect-video object-cover rounded-[6px]"
                          controls
                          autoPlay
                          muted
                          loop
                          src={x.media[0]}
                        >
                          Votre navigateur ne supporte pas la lecture de cette
                          vidéo.
                        </video>
                      ))}

                    <div className="flex flex-col gap-10">
                      <div className="flex max-w-[512px] w-full h-auto aspect-video flex-col gap-5 pt-2 md:pt-10">
                        <div className="px-3 py-2 bg-[#012BAE] w-fit">
                          <p className="uppercase text-white">{x.type}</p>
                        </div>
                        <h1 className="line-clamp-2">{x.titre}</h1>
                        <p className="line-clamp-3">{x.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:flex">
          <CarouselPrevious />
          <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
