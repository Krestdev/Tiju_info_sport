"use client"

import React, { useEffect, useState } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel'
import { Box, Input } from '@mui/material';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LucideArrowLeft } from 'lucide-react';
import Email from './Email';
import Code from './Code';
import Password from './Password';
import { FaCheck } from "react-icons/fa6";


const ForgetPassword = () => {


  const [active, setActive] = useState(0)
  const [email, setEmail] = useState("")
  const router = useRouter();

  const handleDecrement = () => {
    setActive((prevCount) => Math.max(prevCount - 1, 0));
  };

  const steps = [
    'Confirmation',
    'Code de validation',
    'Nouveau mot de passe',
    'Terminé'
  ];

  return (
    <Box>
      <Stepper activeStep={active} alternativeLabel>

        {steps.map((label) => (
          <Step className='flex flex-col items-center' key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {
        active === 0 ?
          <Email setActive={setActive} setEmail={setEmail} />
          : active === 1 ?
            <Code setActive={setActive} /> : active === 2 ?
              <Password setActive={setActive} email={email} />
              : active === 3 ?
                <div className='pb-10 flex flex-col items-center gap-4'>
                  <div className='flex flex-row items-center gap-2'>
                    <div className='rounded-full bg-green-500 text-white'><FaCheck className='size-10 p-2' /></div>
                    <h3 className='text-green-500'>{"Mot de passe modifié avec succès"}</h3>
                  </div>
                  <Button onClick={() => router.back()}>{"Revenir à la page de connection"}</Button>
                </div>
                : ""
      }
      {active >= 1 && active < 3 && <Button onClick={handleDecrement} variant={'secondary'}> <LucideArrowLeft /> {"Precedent"}</Button>}
    </Box>
  )
}

export default ForgetPassword
