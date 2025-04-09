// "use client"

// import React, { useState } from 'react'
// import Stepper from '@mui/material/Stepper'
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel'
// import { Box } from '@mui/material';
// import { Button } from '@/components/ui/button';
// import { LucideArrowLeft } from 'lucide-react';
// import SubscribePage from './SubscribeComp';
// import Payement from './Payement';
// import Mobile from './Mobile';
// import Visa from './Visa';
// import Confirm from './Confirm';


// const Subscribe = () => {


//     const [active, setActive] = useState(0)
//     const [abon, setAbon] = useState(0)
//     const [methode, setMethode] = useState("")

//     const handleDecrement = () => {
//         setActive((prevCount) => Math.max(prevCount - 1, 0));
//     };

//     const steps = [
//         'Abonnement',
//         'Methode payement',
//         'Payement',
//         'Terminé'
//     ];

//     return (
//         <Box>
//             <div className='flex flex-col justify-center'>
//                 <Stepper activeStep={active} alternativeLabel>

//                     {steps.map((label) => (
//                         <Step className='flex flex-col items-center' key={label}>
//                             <StepLabel>{label}</StepLabel>
//                         </Step>
//                     ))}
//                 </Stepper>
//                 <div className='py-10'>
//                     {
//                         active === 0 ?
//                             <SubscribePage setActive={setActive} setAbon={setAbon} abonId={abon} />
//                             : active === 1 ?
//                                 <Payement setMethode={setMethode} setActive={setActive} abonId={abon} />
//                                 : active === 2 ?
//                                     methode === "mobile" ? <Mobile setActive={setActive} abonId={abon} /> : <Visa />
//                                     : active === 3 ?
//                                         <Confirm abonId={abon} />
//                                         : ""
//                     }
//                 </div>
//                 {active >= 1 && active < 3 && <Button onClick={handleDecrement} variant={'secondary'} className='w-fit'> <LucideArrowLeft /> {"Precedent"}</Button>}
//             </div>
//         </Box>
//     )
// }

// export default Subscribe
