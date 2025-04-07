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
    action1: (id: number) => void;
    action2: (id: number) => void;
    name?: string;
    message: string;
    bouton1: string
    bouton2: string
}

const DeleteValidation = ({ children, id, action1, action2, name, message, bouton1, bouton2 }: Props) => {
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
                        <Button variant={"destructive"} onClick={() => action1(id)}>
                            {bouton1}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={() => action2(id)}>
                            {bouton2}
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
