import AddCategory from '@/components/Dashboard/Categories/AddCategory'
import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div>
      <AddCategory>
        <Button>{"Ajouter une categorie"}</Button>
      </AddCategory>
    </div>
  )
}

export default page
