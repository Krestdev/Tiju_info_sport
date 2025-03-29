
import React from 'react'
import Info from './Info';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

interface Aff {
    gridAff: Article[];
}

const Head = ({ gridAff }: Aff) => {

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    return (
        <div>
            <Carousel
                ref={emblaRef} 
                plugins={[
                    Autoplay({
                        delay: 10000,
                    }),
                ]}
            >
                <CarouselContent className='max-h-[360px] h-full'>
                    {gridAff.map((x) => (
                        <CarouselItem key={x.id} className="flex flex-col gap-5 h-full">
                            <div
                                className="flex items-center justify-center"
                            >
                                <Info article={x} taille={'max-w-[824px] max-h-[320px]'} couleur={'bg-[#01AE35]'}  />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}

export default Head
