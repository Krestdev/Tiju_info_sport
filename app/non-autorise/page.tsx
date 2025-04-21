import Link from 'next/link'
import React from 'react'

const Acces = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-red-600">Accès refusé</h1>
      <p className="text-xl mt-4">Oups ! vous n'avez pas les accès pour cette page. Contactez votre administrateur</p>
      <img src="/images/404.jpg" alt="Not Found" className='max-w-[400px] w-full h-auto object-cover'/>
      <Link href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Retour à l'accueil
      </Link>
    </div>
  )
}

export default Acces
