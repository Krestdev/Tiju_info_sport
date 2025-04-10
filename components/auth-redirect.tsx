'use client'
import useStore from '@/context/store'
import { useRouter } from 'next/navigation';
import React from 'react'

interface Props {
    children: React.ReactNode;
}

function AuthRedirect({children}:Props) {
    const { currentUser } = useStore();
    const router = useRouter();

    if(!!currentUser){
        router.replace("/")
    }
  return (
    children
  )
}

export default AuthRedirect