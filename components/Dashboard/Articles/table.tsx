"use client";
import { Badge } from "@/components/ui/badge";
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
import { Search, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import ModalWarning from "@/components/modalWarning";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import EditUserForm from "./editUserForm";
// import AddPubsForm from "./addPubsForm";
// import EditPubsForm from "./editPubsForm";
import FullScreen from "../FullScreen";
import { Article, Categorie } from "@/data/temps";
import AddArticleForm from "./addArticleForm";
import EditArticleForm from "./editArticleForm";
import { FiEdit } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { DateRange } from "react-day-picker";
import { DatePick } from "../DatePick";
import { SlRefresh } from "react-icons/sl";
import Pagination from "../Pagination";
import ShowArticle from "./showArticle";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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
    const itemsPerPage = 15;

    useEffect(() => {
        if (articleData.isSuccess) {
            setSport(articleData.data.flatMap(x => x.donnees))
            setArticle(articleData.data)
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
    
        return filtered;
    }, [rein, sport, dateRange, searchEntry]);
    


    //Delete function
    function onDeleteArticle(id: number) {
        deleteArticle(id)
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Supprimé avec succès");
    }

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = current === "tous" ?
        filterData.slice(startIndex, startIndex + itemsPerPage) :
        filterData.slice(startIndex, startIndex + itemsPerPage).filter(x => x.statut === current);

    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    return (
        <div className="w-full flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[52px]">{"Tous Les Articles"}</h1>
            <div className="flex flex-row items-center gap-3">
                <Button onClick={() => setCurrent("tous")} className={`shadow-none text-[16px] rounded-[6px] ${current === "tous" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Tous"}</Button>
                <Button onClick={() => setCurrent("publie")} className={`shadow-none text-[16px] rounded-[6px] ${current === "publie" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Publiés"}</Button>
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
                    <DatePick onChange={(range) => setDateRange(range)} />
                </div>

            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {articleData.isLoading && "Loading"}
                    {articleData.isSuccess && filterData.length > 0 ? (
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
                                                        <TableHead>{"statut"}</TableHead>
                                                        {/* <TableHead>{"Nbr Commentaires"}</TableHead>
                                                        <TableHead>{"Type d'abonnement"}</TableHead>
                                                        <TableHead>{"Actions"}</TableHead> */}
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


                                                                {/* <TableCell onClick={() => setFull(!full)} className="cursor-pointer border">
                                                                    {item.media &&
                                                                        <FullScreen image={item.media[0]}>
                                                                            <img src={item.media[0]} alt={item.type} className="size-12 object-cover" />
                                                                        </FullScreen>}
                                                                </TableCell> */}
                                                                {/* <TableCell className="border">{item.like.length}</TableCell>
                                                                <TableCell className="border">{item.commentaire.length}</TableCell>
                                                                <TableCell className="border">{item.abonArticle.nom}</TableCell>
                                                                <TableCell className="flex gap-2 items-center">
                                                                    <ModalWarning id={item.id} action={onDeleteArticle} name={item.type}>
                                                                        <Button
                                                                            variant={"destructive"}
                                                                            size={"icon"}
                                                                        >
                                                                            <Trash2 size={20} />
                                                                        </Button>
                                                                    </ModalWarning>
                                                                    <EditArticleForm donnee={item} nom={articleData.data.find(x => x.donnees.some(x => x === item))?.nom}>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm">
                                                                            <FiEdit size={"20px"} />
                                                                        </Button>
                                                                    </EditArticleForm>
                                                                    <ShowArticle id={item.id} type={item.type} titre={item.titre} extrait={item.extrait} description={item.description} media={item.media} ajouteLe={item.ajouteLe} commentaire={item.commentaire} like={item.like} user={item.user} abonArticle={item.abonArticle}>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm">
                                                                            <FaRegEye size={"20px"} />
                                                                        </Button>
                                                                    </ShowArticle>
                                                                </TableCell> */}


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

                    <Button type="submit">Soumetre</Button>
                </form>
            </Form>

            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

            <ToastContainer />
        </div>
    );
}

export default ArticleTable;
