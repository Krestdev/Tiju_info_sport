"use client"

import withAdminAuth from '@/lib/whithAdminAuth'
import React from 'react'

const DashbordPage = () => {
  return (
    <div className='containerBloc'>
      <h1>Tableau de bord</h1>
    </div>
  )
}

export default withAdminAuth(DashbordPage)
