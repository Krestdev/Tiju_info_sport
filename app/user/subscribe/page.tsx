"use client"

import SubscribePage from '@/components/Subscribe/SubscribeComp'
import withAuth from '@/lib/withAuth'
import React from 'react'

const page = () => {
  return (
    <div className='containerBloc'>
      <SubscribePage />
    </div>
  )
}

export default withAuth(page)
