'use client'
import { Badge } from "@/components/ui/badge";;
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { fr } from "date-fns/locale";


export const columnsArticles:ColumnDef<Article>[] = [
    {
        accessorKey: "title",
        header: "Titre",
    },
    {
        accessorKey: "type",
        header: "Catégorie",
    },
    {
        accessorKey: "created_at",
        header: "Créé le",
        cell: ({ row }) => {
            const date:string = row.getValue("created_at");
            if(!date){
                return "-"
            }
            return format(date, "PPP", {locale: fr});
        }
    },
    {
        accessorKey: "updated_at",
        header: "Mis à jour le",
        cell: ({ row }) => {
            const date:string = row.getValue("updated_at");
            if(!date){
                return "-"
            }
            return format(date, "PPP", {locale: fr});
        }
    },
    {
        accessorKey: "publish_on",
        header: "Programmé le",
        cell: ({ row }) => {
            const date:string = row.getValue("publish_on");
            if(!date){
                return "-"
            }
            return format(date, "PPpp", {locale: fr});
        }
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
            const status:StatusType = row.getValue("status");
            const publish_on:string = row.getValue("publish_on");
            return (
                <Badge variant={status === "published" ? "success" : status==="draft" && publish_on.length < 3 ? "outline" :  status==="deleted" ? "destructive" : "default"}>
                    {status === "published" ? "Publié" : status === "draft" && publish_on.length < 3 ? "Brouillon" : status==="deleted" ? "Supprimé" : "Programmé"}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const article:Article = row.original;
        }
    }
]