'use client'
import React from "react";
import { ReactNode, useEffect, useState } from "react"

type Props = {
    children: ReactNode;
}

const HydrationZustand = ({ children }:Props) => {
  const [isHydrated, setIsHydrated] = useState(false)

  // Wait till Next.js rehydration completes
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return <>{isHydrated ? <div>{children}</div> : null}</>
}

export default HydrationZustand