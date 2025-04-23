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
  action: (id: number) => void;
  name?: string;
  message: string;
  bouton: string;
};

function ShareWarning({ children, id, action, name = "an element", message, bouton }: Props) {

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Etes-vous sûre ?"}</DialogTitle>
          <DialogDescription>
              {message} <strong>{name}</strong>
          </DialogDescription>
        </DialogHeader>
        <span className="flex gap-3 flex-wrap items-center justify-center">
          <DialogClose asChild>
            <Button onClick={() => action(id)}>
              {bouton}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"outline"}>{"Annuler"}</Button>
          </DialogClose>
        </span>
      </DialogContent>
    </Dialog>
  );
}

export default ShareWarning;
