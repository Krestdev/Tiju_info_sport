"use client"

// import Subscribe from '@/components/Subscribe/Subscribe'
import withAuth from '@/lib/withAuth'
import React from 'react'

const page = () => {
  return (
    <div className='containerBloc'>
      {/* <Subscribe /> */}
    </div>
  )
}

export default withAuth(page)
