import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Props = {
  children: React.ReactNode;
  id: number;
  action: (id:number)=>void;
  name?: string;
};

function  ModalWarning({ children, id, action, name="an element" }: Props) {
  
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Are you sure ?"}</DialogTitle>
          <DialogDescription>
            {`You are about to delete ${name}`}
          </DialogDescription>
        </DialogHeader>
        <span className="flex gap-3 flex-wrap items-center">
          <DialogClose asChild>
            <Button variant={"destructive"} onClick={()=>action(id)}>
              {"Delete"}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"outline"}>{"Cancel"}</Button>
          </DialogClose>
        </span>
      </DialogContent>
    </Dialog>
  );
}

export default ModalWarning;
