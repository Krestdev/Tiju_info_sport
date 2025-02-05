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
import { Abonnement, comment, Users } from "@/data/temps";
import FullScreen from "../FullScreen";



type Props = {
  children: React.ReactNode;
  id: number;
  type: string;
  titre: string;
  extrait: string;
  description: string;
  media: string[] | undefined;
  ajouteLe: string;
  commentaire: comment[];
  like: Omit<Users, "password">[];
  user: Users,
  abonArticle: Abonnement
};



function ShowArticle({ children, id, type, titre, extrait, description, media, ajouteLe, commentaire, like, user, abonArticle }: Props) {

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="!max-w-screen-lg !w-full">
        <DialogHeader className="!border-b-gray-400 border-b px-7 pb-7 flex flex-col gap-3">
          <DialogTitle>{type}</DialogTitle>
          <DialogDescription>
            {` Detail de la publication N° ${id}`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col overflow-auto scrollbar max-h-[600px] justify-between gap-5 px-7">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <p className="font-semibold">{"Media"}</p>
              <div className="grid grid-cols-5 gap-1 ">
                {
                  media?.map((x, i) => {
                    return (
                      <FullScreen key={i} image={x}>
                        <img src={x} alt="" className="size-10 bg-blue-700" />
                      </FullScreen>
                    )
                  })
                }
              </div>
            </div>
            <div>
              <p className="font-semibold">{"Titre"}</p>
              <p>{titre}</p>
            </div>
            <div>
              <p className="font-semibold">{"Extrait"}</p>
              <p>{extrait}</p>
            </div>
            <div>
              <p className="font-semibold">{"Date de publication"}</p>
              <p>{ajouteLe}</p>
            </div>
            <div>
              <p className="font-semibold">{"Nombre de commentaires"}</p>
              <p>{commentaire.length}</p>
            </div>
            <div>
              <p className="font-semibold">{"Nombre de likes"}</p>
              <p>{like.length}</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">{"Description"}</p>
            <p>{description}</p>
          </div>
          <div className="flex flex-row justify-between">
            <div>
              <p className="font-semibold">{"Type d'abonnement"}</p>
              <p>{abonArticle.nom}</p>
            </div>
            <div>
              <p className="font-semibold">{"Publié par"}</p>
              <p>{user.nom}</p>
            </div>
          </div>
          <span className="flex gap-3 flex-wrap items-center">
            <DialogClose asChild>
              <Button variant={"outline"}>{"Fermer"}</Button>
            </DialogClose>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ShowArticle;
