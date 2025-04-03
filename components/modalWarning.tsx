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
};

function ModalWarning({ children, id, action, name = "an element" }: Props) {

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Etes-vous sûre ?"}</DialogTitle>
          <DialogDescription>
              {`Vous etes sur le point de supprimer ${name}`}
          </DialogDescription>
        </DialogHeader>
        <span className="flex gap-3 flex-wrap items-center justify-center">
          <DialogClose asChild>
            <Button variant={"destructive"} onClick={() => action(id)}>
              {"Supprimer"}
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

export default ModalWarning;
