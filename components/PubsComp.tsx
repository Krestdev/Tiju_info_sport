"use client";

import useStore from '@/context/store';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

interface pub {
  id: number,
  lien: string,
  image: string,
}

const PubsComp = ({
  id,
  lien,
  image,
}: pub) => {
  const { settings } = useStore();

  return (
    <Link href={lien} target="_blank">
      <div className='containerBloc py-0 relative'>
        <img src={image} alt={settings?.pub || "Publicité"} className='object-cover h-[300px]' />
      </div>
    </Link>
  );
};

export default PubsComp;
