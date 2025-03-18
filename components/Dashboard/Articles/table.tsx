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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Article, Categorie } from "@/data/temps";
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
import { TbH3 } from "react-icons/tb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ModalWarning from "@/components/modalWarning";
import { Trash2 } from "lucide-react";
import EditArticle from "./EditArticle";
import { LuSquarePen } from "react-icons/lu";
import { LuSend } from "react-icons/lu";
import { LuUndo2 } from "react-icons/lu";
import ShareWarning from "@/components/sharedWarning";
import Link from "next/link";

const FormSchema = z.object({
    items: z.array(z.number()).refine((value) => value.length > 0, {
        message: "You have to select at least one item.",
    }),
});

function ArticleTable() {
    const { dataArticles, deleteArticle } = useStore();
    const queryClient = useQueryClient();
    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles,
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

    //Search value
    const [searchEntry, setSearchEntry] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [sport, setSport] = useState<Article[]>();
    const [full, setFull] = useState(false);
    const [current, setCurrent] = useState("tous");
    const [article, setArticle] = useState<Categorie[]>();

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false)
    const [selectedAuthor, setSelectedAuthor] = useState("none");
    const [auteur, setAuteur] = useState<string[] | undefined>()
    const itemsPerPage = 15;

    useEffect(() => {
        if (articleData.isSuccess) {
            setSport(articleData.data.flatMap(x => x.donnees))
            setArticle(articleData.data)
            setAuteur(articleData.data?.flatMap(x => x.donnees).map(x => x.auteur ? x.auteur.nom : ""))
        }
    }, [articleData.data])

    //Update searchEntry while the user's typing
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    const toNormalDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

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
                const itemDate = toNormalDate(item.ajouteLe);
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
            filtered = filtered.filter((el) => el.auteur?.nom === selectedAuthor);
        }

        return filtered;
    }, [rein, sport, dateRange, searchEntry, selectedAuthor]);




    //Delete function
    function onDeleteArticle(id: number) {
        deleteArticle(id)
        queryClient.invalidateQueries({ queryKey: ["article"] })
        toast.success("Supprimé avec succès");
    }

    function onPublishArticle(id: number) {
        queryClient.invalidateQueries({ queryKey: ["article"] })
        toast.success("Article publié avec succès");
    }

    function onRestoreArticle(id: number) {
        queryClient.invalidateQueries({ queryKey: ["article"] })
        toast.success("Article Restauré avec succès");
    }

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = current === "tous" ?
        filterData.slice(startIndex, startIndex + itemsPerPage) :
        filterData.slice(startIndex, startIndex + itemsPerPage).filter(x => x.statut === current);

    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    return (
        <div className="w-full flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[40px]">{"Tous Les Articles"}</h1>
            <div className="flex flex-row items-center gap-3">
                <Button onClick={() => setCurrent("tous")} className={`shadow-none text-[16px] rounded-[6px] ${current === "tous" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Tous"}</Button>
                <Button onClick={() => setCurrent("publie")} className={`shadow-none text-[16px] rounded-[6px] ${current === "publie" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Publiés"}</Button>
                <Button onClick={() => setCurrent("programme")} className={`shadow-none text-[16px] rounded-[6px] ${current === "programme" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Programmés"}</Button>
                <Button onClick={() => setCurrent("brouillon")} className={`shadow-none text-[16px] rounded-[6px] ${current === "brouillon" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Brouillons"}</Button>
                <Button onClick={() => setCurrent("corbeille")} className={`shadow-none text-[16px] rounded-[6px] ${current === "corbeille" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Corbeille"}</Button>
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
                        {[...new Set(auteur)].map((x, i) => (
                            <SelectItem key={i} value={x}>
                                {x}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Link href={"/dashboard/articles/add-article"} passHref>
                    <Button className="rounded-none">{"Ajouter un Article"}</Button>
                </Link>
            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {articleData.isLoading ? <h3>{"Loading"}</h3> :
                        articleData.isSuccess && filterData.length > 0 ? (
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
                                                                    <TableCell className="inline-block text-nowrap text-ellipsis overflow-hidden max-w-[315px] w-fit">{item.titre}</TableCell>
                                                                    <TableCell className="border">{item.auteur?.nom}</TableCell>
                                                                    <TableCell className="border">{item.type}</TableCell>
                                                                    <TableCell className="border">{item.ajouteLe}</TableCell>
                                                                    <TableCell className="border">{item.statut}</TableCell>
                                                                    <TableCell className="flex gap-4 justify-center">
                                                                        <EditArticle donnee={item} nom={item.titre}>
                                                                            <LuSquarePen className="size-5 cursor-pointer" />
                                                                        </EditArticle>
                                                                        <ModalWarning id={item.id} action={onDeleteArticle} name={item.titre}>
                                                                            <Trash2 className="text-red-400 size-5 cursor-pointer" />
                                                                        </ModalWarning>
                                                                        {
                                                                            item.statut === "brouillon" ?
                                                                                <ShareWarning id={item.id} action={onPublishArticle} name={item.titre} message={"Vous etes sur le point de publier"} bouton={"Publier"}>
                                                                                    <LuSend className="text-[#0128AE] size-5 cursor-pointer" />
                                                                                </ShareWarning> :
                                                                                item.statut === "corbeille" ?
                                                                                    <ShareWarning id={0} action={onRestoreArticle} name={item.titre} message={"Vous etes sur le point de restaurer"} bouton={"Restaurer"}>
                                                                                        <LuUndo2 className="text-[#0128AE] size-5 cursor-pointer" />
                                                                                    </ShareWarning>
                                                                                    : <LuSend className="opacity-0 size-5" />
                                                                        }
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
                        ) : articleData.isSuccess && filterData.length < 1 && articleData.data.length > 0 ? (
                            "No result"
                        ) : articleData.isSuccess && articleData.data.length === 0 ? (
                            "Empty table"
                        ) : (
                            articleData.isError && (
                                "Some error occured"
                            )
                        )}
                </form>
            </Form>

            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

            <ToastContainer />
        </div>
    );
}

export default ArticleTable;
