import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import React from 'react'

interface Props {
    article:Article
}

function ArticleActions({article}:Props) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button family={"sans"}></Button>
        </DropdownMenuTrigger>
    </DropdownMenu>
  )
}

export default ArticleActions