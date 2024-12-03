"use client";

import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

interface pub {
  id: number,
  lien: string,
  image: string,
  description?: string,
  prix?: number
}

const PubsComp = ({
  id,
  lien,
  image,
  description,
  prix
}: pub) => {
  const { settings } = useStore();

  return (
    <Link href={lien} target="_blank">
      <div className='containerBloc py-0 relative'>
        <img src={image} alt={settings?.pub || "Publicité"} className='object-cover' />
        {description && prix && <div className='bg-black text-white absolute z-10 top-[5px] left-[40px] h-[60px] w-1/3 text-[7px] md:top-[20px] md:left-[80px] md:h-[93px] lg:top-[50px] lg:left-[115px] lg:h-[103px] max-w-[300px] px-3 py-2 md:py-4'>
          <p className='text-[6px] md:text-[14px]'>{description}</p>
          <h3 className='text-[8px] md:text-[12px] lg:text-[16px]'>{prix} FCFA/mois</h3>
        </div>}
      </div>
    </Link>
  );
};

export default PubsComp;
