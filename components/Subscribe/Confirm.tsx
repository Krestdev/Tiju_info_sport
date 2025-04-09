// import React, { useEffect, useState } from 'react'
// import { Button } from '../ui/button'
// import { FaCheck } from 'react-icons/fa'
// import { useRouter } from 'next/navigation';
// import { Abonnement } from '@/data/temps';
// import useStore from '@/context/store';
// import { useQuery } from '@tanstack/react-query';


// interface Props {
//     abonId: number
// }

// const Confirm = ({abonId}: Props) => {

//     const [subs, setSubs] = useState<Abonnement[]>()

//     // const subsData = useQuery({
//     //     queryKey: ["abonnement"],
//     //     queryFn: async () => dataSubscription
//     // })

//     useEffect(() => {
//         if (subsData.isSuccess) {
//             setSubs(subsData.data)
//         }
//     }, [subsData.data])

//     const router = useRouter();
//     return (
//         <div className='pb-10 flex flex-col items-center gap-4'>
//             <div className='flex flex-row items-center gap-2'>
//                 <div className='rounded-full bg-green-500 text-white'><FaCheck className='size-10 p-2' /></div>
//                 <div>
//                     <h3 className='text-green-500'>{"Abonnement effectué avec succès à l'offre "}</h3>
//                     <h3 className='text-[#012BAE]'>{`${subsData.data?.find(x => x.id === abonId)?.nom} ${subsData.data?.find(x => x.id === abonId)?.coutMois} FCFA`}</h3>
//                 </div>
//             </div>
//             <Button onClick={() => router.push('/')}>{"Revenir à la page d'accueil"}</Button>
//         </div>
//     )
// }

// export default Confirm

