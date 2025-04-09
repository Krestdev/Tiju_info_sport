"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useStore from "@/context/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Categorie } from "@/data/temps";
import { DateRange } from "react-day-picker";
import { DatePick } from "../DatePick";
import { SlRefresh } from "react-icons/sl";
import Pagination from "../Pagination";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ModalWarning from "@/components/modalWarning";
import { Trash2 } from "lucide-react";
import EditArticle from "./EditArticle";
import { LuSend, LuSquarePen, LuUndo2 } from "react-icons/lu";
import Link from "next/link";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";
import ShareWarning from "@/components/sharedWarning";
import DatePubli from "./DatePubli";
import DeleteValidation from "./DeleteValidation";

const FormSchema = z.object({
    items: z.array(z.number()),
});

function ArticleTable() {
    const { currentUser } = useStore();
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig();
    //Search value
    const [searchEntry, setSearchEntry] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [sport, setSport] = useState<Article[]>();
    const [current, setCurrent] = useState("tous");
    const [article, setArticle] = useState<Categorie[]>();

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false)
    const [selectedAuthor, setSelectedAuthor] = useState("none");
    const [auteur, setAuteur] = useState<User[] | undefined>()
    const [dialog, setDialog] = React.useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState<number>(0);
    const [selectedArticle, setSelectedArticle] = useState<Article>()
    const itemsPerPage = 15;


    const articleCate = useQuery({
        queryKey: ["articles"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Article[]>>(
                `/articles`
            );
        },
    });

    useEffect(() => {
        if (articleCate.isSuccess) {
            setSport(articleCate.data.data)
            setAuteur(sport?.flatMap(x => x.author).filter((value, index, self) => index === self.findIndex((v) => v.id === value.id)))
        }
    }, [articleCate.data])

    const articleToTrash = useMutation({
        mutationKey: ["pictures"],
        mutationFn: (id: number) => {
            const idU = currentUser && String(currentUser.id)
            return axiosClient.patch(`/articles/trash/${id}`, {
                user_id: idU,
            });
        },
        onSuccess() {
            toast.success("AJouté à la corbeille avec succès");
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        retry: 5,
        retryDelay: 5000
    });


    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        },
    })

    //Update searchEntry while the user's typing
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    function toNormalDate(dateString: string): Date {
        return new Date(dateString.replace(" ", "T"));
    }


    const filterData = useMemo(() => {
        if (!sport) {
            setRein(false);
            return [];
        }

        let filtered = sport;

        // Filtrage par date
        if (!rein) {
            filtered = filtered.filter((item) => {
                if (!dateRange?.from) return true;
                const itemDate = toNormalDate(item.created_at);

                return (
                    itemDate >= dateRange.from &&
                    (dateRange.to ? itemDate <= dateRange.to : true)
                );
            });
        } else {
            setRein(false);
        }

        // Filtrage par recherche
        if (searchEntry !== "") {
            filtered = filtered.filter((el) =>
                Object.values(el).some((value) =>
                    String(value)
                        .toLocaleLowerCase()
                        .includes(searchEntry.toLocaleLowerCase())
                )
            );
        }
        // Filtrage par auteur
        if (selectedAuthor && selectedAuthor !== "none") {
            filtered = filtered.filter((el) => el.author?.id === Number(selectedAuthor));
        }

        return filtered;
    }, [rein, sport, dateRange, searchEntry, selectedAuthor]);


    const { mutate: deleteArticle } = useMutation({
        mutationFn: async (articleId: number) => {
            return axiosClient.delete(`/articles/${articleId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
    });

    const editArticle = useMutation({
        mutationKey: ["articles"],
        mutationFn: (id: number) => {
            const art = sport?.find(x => x.id === id)
            const idU = currentUser && String(currentUser.id)
            return axiosClient.patch(`/articles/${id}`, {
                user_id: idU,
                ...art,
                summary: art?.summery,
                status: "draft"
            });
        },
        onSuccess() {
            // setDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        retry: 5,
        retryDelay: 5000,
    });

    function onRestoreArticle(id: number) {
        editArticle.mutate(id);
        queryClient.invalidateQueries({ queryKey: ["article"] })
        toast.success("Article Restauré avec succès");
    }

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = current === "tous" ?
        filterData.slice(startIndex, startIndex + itemsPerPage)
        : filterData.slice(startIndex, startIndex + itemsPerPage).filter(x => x.status === current);

    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    return (
        <div className="w-full flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[40px]">{"Tous Les Articles"}</h1>
            <div className="flex flex-row items-center gap-3">
                <Button onClick={() => setCurrent("tous")} className={`shadow-none text-[16px] rounded-[6px] ${current === "tous" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Tous"}</Button>
                <Button onClick={() => setCurrent("published")} className={`shadow-none text-[16px] rounded-[6px] ${current === "published" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Publiés"}</Button>
                <Button onClick={() => setCurrent("programmed")} className={`shadow-none text-[16px] rounded-[6px] ${current === "programmed" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Programmés"}</Button>
                <Button onClick={() => setCurrent("draft")} className={`shadow-none text-[16px] rounded-[6px] ${current === "draft" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Brouillons"}</Button>
                <Button onClick={() => setCurrent("deleted")} className={`shadow-none text-[16px] rounded-[6px] ${current === "deleted" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Corbeille"}</Button>
            </div>
            <span className="flex flex-wrap items-center gap-5">
                <span className="relative max-w-sm w-full">
                    <Input
                        type="search"
                        onChange={handleInputChange}
                        value={searchEntry}
                        placeholder="Nom de l'article"
                        className="max-w-lg h-[40px] rounded-none"
                    />
                </span>
                <div className="flex gap-2 items-center">
                    <SlRefresh className="cursor-pointer size-5"
                        onClick={() => {
                            setDateRange(undefined);
                            setRein(true);
                        }} />
                    <DatePick onChange={(range) => setDateRange(range)} show={true} />
                </div>
                <Select onValueChange={setSelectedAuthor}>
                    <SelectTrigger className="border border-[#A1A1A1] w-fit h-[40px] flex items-center p-2 rounded-none">
                        <SelectValue placeholder="Auteur" />
                    </SelectTrigger>
                    <SelectContent className="border border-[#A1A1A1] w-fit flex items-center p-2">
                        <SelectItem value="none">{"Tous les auteurs"}</SelectItem>
                        {[...new Set(auteur)].map((x, i) => {
                            return (
                                <SelectItem key={i} value={String(x.id)}>
                                    {x.name}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
                <Link href={"/dashboard/articles/add-article"} passHref>
                    <Button className="rounded-none">{"Ajouter un Article"}</Button>
                </Link>
            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {articleCate.isLoading ? <h3>{"Chargement..."}</h3> :
                        articleCate.isSuccess && filterData.length > 0 ? (
                            <div className="min-h-[70vh] overflow-y-auto w-full">
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Table className="border divide-x">
                                                    <TableHeader>
                                                        <TableRow className="text-[18px] capitalize font-normal">
                                                            <TableHead>
                                                                <Checkbox
                                                                    checked={currentItems.length > 0 && field.value?.length === currentItems.length}
                                                                    onCheckedChange={(checked) => {
                                                                        field.onChange(checked ? currentItems.map((item) => item.id) : []);
                                                                    }}
                                                                />
                                                            </TableHead>
                                                            <TableHead>{"titre"}</TableHead>
                                                            <TableHead>{"Auteur"}</TableHead>
                                                            <TableHead>{"Categories"}</TableHead>
                                                            <TableHead>{"À la une"}</TableHead>
                                                            <TableHead>{"Date"}</TableHead>
                                                            <TableHead>{"Statut"}</TableHead>
                                                            <TableHead>{"Actions"}</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {currentItems.map((item, id) => {
                                                            return (
                                                                <TableRow className="text-[16px]" key={id}>
                                                                    <TableCell className="border">
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item.id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item.id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="inline-block text-nowrap text-ellipsis overflow-hidden max-w-[315px] w-fit">{item.title}</TableCell>
                                                                    <TableCell className="border">{item.author?.name}</TableCell>
                                                                    <TableCell className="border">{item.type}</TableCell>
                                                                    <TableCell className="border">{item.headline ? "Oui" : "Non"}</TableCell>
                                                                    <TableCell className="border">{item.publish_on ? item.publish_on : item.created_at}</TableCell>
                                                                    <TableCell className="border">{item.publish_on === "" && item.status === "draft" ?
                                                                        "Brouillon" :
                                                                        item.status === "published" ? "Publié" :
                                                                            // item.status === "programmed" ? "Programmé" :
                                                                            item.status === "deleted" ? "Corbeille" : item.status === "draft" && item.publish_on !== "" ? "Programmé" : ""
                                                                    }</TableCell>
                                                                    <TableCell className="flex gap-4 justify-center">
                                                                        <EditArticle donnee={item} nom={item.title}>
                                                                            <LuSquarePen className="size-5 cursor-pointer" />
                                                                        </EditArticle>
                                                                        <DeleteValidation id={selectedArticleId} action={item.status === "deleted" ? deleteArticle : articleToTrash.mutate} bouton={item.status === "deleted" ? "Supprimer définitivement" : "Ajouter a la corbeille"} message="Vous etes sur le point de supprimer" name={item.title}>
                                                                            <Trash2 onClick={() => setSelectedArticleId(item.id)} className="text-red-400 size-5 cursor-pointer" />
                                                                        </DeleteValidation>
                                                                        {
                                                                            item.status === "draft"
                                                                                // || item.status === "programmed" 
                                                                                ?
                                                                                // <LuSend
                                                                                //     onClick={(e) => {
                                                                                //         e.preventDefault();
                                                                                //         setSelectedArticleId(item.id);
                                                                                //         setSelectedArticle(item)
                                                                                //         handleOpen();
                                                                                //     }}
                                                                                //     className="text-[#0128AE] size-5 cursor-pointer" />
                                                                                <LuSend className="opacity-0 size-5" />
                                                                                :
                                                                                item.status === "deleted" ?
                                                                                    <ShareWarning id={item.id} action={onRestoreArticle} name={item.title} message={"Vous etes sur le point de restaurer"} bouton={"Restaurer"}>
                                                                                        <LuUndo2 className="text-[#0128AE] size-5 cursor-pointer" />
                                                                                    </ShareWarning>
                                                                                    : <LuSend className="opacity-0 size-5" />
                                                                        }
                                                                        <DatePubli formId={`form-article-${item.id}`} artId={selectedArticleId} isOpen={dialog} onOpenChange={setDialog} article={selectedArticle} />
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        }
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : articleCate.isSuccess && filterData.length < 1 && sport && sport?.length > 0 ? (
                            "Pas de résultat"
                        ) : articleCate.isSuccess && sport?.length === 0 ? (
                            "Aucun article"
                        ) : (
                            articleCate.isError && (
                                "Impossible de charger vos données. Verifiez votre connexion et réessayez"
                            )
                        )}
                </form>
                <ToastContainer />
            </Form>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
    );
}

export default ArticleTable;
