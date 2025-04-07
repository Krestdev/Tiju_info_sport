import React from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    children: React.ReactNode;
    id: number;
    action: (id: number) => void;
    name?: string;
    message: string;
    bouton: string
}

const DeleteValidation = ({ children, id, action, name, message, bouton }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{"Etes-vous sûre ?"}</DialogTitle>
                    <DialogDescription>
                        {message} <strong>{name}</strong>
                    </DialogDescription>
                </DialogHeader>
                <span className="flex gap-3 flex-wrap items-center justify-center">
                    <DialogClose asChild>
                        <Button variant={"destructive"} onClick={() => action(id)}>
                            {bouton}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant={"outline"}>{"Annuler"}</Button>
                    </DialogClose>
                </span>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteValidation
