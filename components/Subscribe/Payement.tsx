// "use client"

// import useStore from '@/context/store'
// import { Abonnement } from '@/data/temps'
// import { useQuery } from '@tanstack/react-query'
// import React, { useEffect, useState } from 'react'


// interface Props {
//     setMethode: React.Dispatch<React.SetStateAction<string>>
//     setActive: React.Dispatch<React.SetStateAction<number>>
//     abonId: number
// }

// const Payement = ({ setActive, setMethode, abonId }: Props) => {

//     const { dataSubscription } = useStore()
//     // const [subs, setSubs] = useState<Abonnement[]>()

//     const subsData = useQuery({
//         queryKey: ["abonnement"],
//         queryFn: async () => dataSubscription
//     })

//     useEffect(() => {
//         if (subsData.isSuccess) {
//             setSubs(subsData.data)
//         }
//     }, [subsData.data])

//     const handlePay = (methode: string) => {
//         setMethode(methode)
//         setActive(2)
//     }

//     return (
//         <div className='containerBloc flex flex-col items-center gap-5'>
//             <h3 className='text-[#012BAE]'>{`Offre: ${subsData.data?.find(x => x.id === abonId)?.nom} ${subsData.data?.find(x => x.id === abonId)?.coutMois} FCFA`}</h3>
//             <h3>{"Selectionnez le moyen de payement"}</h3>
//             <div className='flex flex-row gap-3 items-center justify-center'>
//                 <div onClick={() => handlePay("mobile")} className='flex flex-col items-center justify-center gap-3 p-5 cursor-pointer hover:bg-blue-50'>
//                     <img src="/images/Mobile.png" alt="" className='max-w-[250px] w-full h-auto aspect-video object-cover' />
//                     <h3>{"Mobile"}</h3>
//                 </div>
//                 <div className="flex flex-col items-center justify-center gap-3 p-5 cursor-pointer hover:bg-blue-50">
//                     <img src="/images/Visa.jpg" alt="" className='max-w-[250px] w-full h-auto aspect-video object-cover' />
//                     <h3>{"Carte Visa"}</h3>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Payement
