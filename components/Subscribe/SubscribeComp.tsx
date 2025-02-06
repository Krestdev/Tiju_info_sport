'use client'

import useStore from '@/context/store'
import { Abonnement } from '@/data/temps'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SubscribePage() {

  const { dataSubscription } = useStore()
  const [subs, setSubs] = useState<Abonnement[]>()

  const subsData = useQuery({
    queryKey: ["abonnement"],
    queryFn: async () => dataSubscription
  })

  useEffect(() => {
    if (subsData.isSuccess) {
      setSubs(subsData.data)
    }
  }, [subsData.data])


  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 items-center justify-center">
      {
        subs?.filter(a => a.cout !== 0).map((x, i) => {
          return (
            <div key={x.id} className={`h-[400px] max-w-[320px] w-full flex flex-col gap-10 items-center justify-center px-5 pt-5 pb-10 rounded-ss-[150px] ${i % 2 === 0 ? "bg-blue-50" : "bg-orange-50"} rounded-ee-[150px]`}>
              <div className='w-full h-full flex flex-col gap-10 items-center justify-center rounded-ss-[150px] rounded-ee-[150px] bg-white'>
                <div className=' flex flex-col'>
                  <p className='font-black text-4xl'>{"XAF"}</p>
                  <p className='font-black text-2xl'>{x.cout}</p>
                </div>
                <p>{x.nom}</p>
              </div>
              <Link className={`${i % 2 === 0 ? "bg-blue-500" : "bg-orange-500"} px-3 py-1 rounded-lg`} href={""}>{"S'abonner"}</Link>
            </div>
          )
        })
      }
    </div>
  )
}