'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

interface commentaire {
    openRepondre: boolean | undefined,
    setOpenRepondre: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const Test = ({openRepondre, setOpenRepondre}: commentaire) => {

    console.log(openRepondre);
    
    
  return (
    <div>
      <Popover open={openRepondre} onOpenChange={setOpenRepondre}>
        <PopoverTrigger asChild>
          <button onClick={() => setOpenRepondre(true)} className='hover:text-blue-500'>{"Repondre"}</button>
        </PopoverTrigger>
        <PopoverContent className="w-80 flex flex-col gap-2">
          <div className="space-y-2 bg-gray-100 rounded-full">
            <h3 className="line-clamp-1">{}</h3>
          </div>
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Répondre au commentaire"
              rows={2}
            />
            <Button>{"Répondre"}</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Test
