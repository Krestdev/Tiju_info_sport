import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog';
import React from 'react'

interface Props {
    open:boolean;
}

function ResetDialog({open}:Props) {
  return (
    <Dialog open={open}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-success'>{"Opération réussie !"}</DialogTitle>
                <DialogDescription/>
            </DialogHeader>
            <div className='py-8 flex flex-col items-center justify-center gap-3'>
                <p>{"Nous avons envoyé un email à votre adresse avec un lien pour votre permettre de définir un nouveau mot de passe."}</p>
                <DialogClose asChild>
                    <Button variant={"outline"}>{"Fermer"}</Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default ResetDialog