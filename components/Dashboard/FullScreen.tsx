import React from "react";
import { Button } from "@/components/ui//button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";



type Props = {
    children: React.ReactNode;
    image: string
};


function FullScreen({ children, image }: Props) {

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="!max-w-screen-md !w-full">
                <DialogHeader className="!border-b-gray-400 border-b px-7 pb-7 flex flex-col gap-3">
                    <DialogTitle>
                        <img src={image} alt="" className="w-full h-full"/>
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
export default FullScreen;
