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
import { Search, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import ModalWarning from "@/components/modalWarning";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../Pagination";
import { SlRefresh } from "react-icons/sl";
import { DatePick } from "../DatePick";
import { DateRange } from "react-day-picker";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenubarCheckboxItem } from "@/components/ui/menubar";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { LuTrash2 } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AxiosResponse } from "axios";
import axiosConfig from "@/api/api";

const FormSchema = z.object({
    items: z.array(z.number()).refine((value) => value.length > 0, {
        message: "You have to select at least one item.",
    }),
});


function CommentsTable() {
    const queryClient = useQueryClient();

    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");

    useEffect(() => {
        if (tab) {
            setCurrent(tab);
        }
    }, [tab]);


    const [commentsData, setCommentsData] = useState<Comments[]>([])
    const [comments, setComments] = useState<Comments[]>([])
    const [current, setCurrent] = useState("tous");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState("none");
    const [articles, setArticles] = useState<Article[]>()
    const [searchEntry, setSearchEntry] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [article, setArticle] = useState<Article[]>()
    const axiosClient = axiosConfig();
    const itemsPerPage = 15;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        },
    })

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Article[]>>(
                `/articles`
            );
        },
    });

    const { mutate: onDeleteComment } = useMutation({
        mutationFn: async (commentId: number) => {
            return axiosClient.delete(`/comments/${commentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comment"] });
            toast.success("Commentaire supprimé avec succès");
        },
    });

    useEffect(() => {
        if (articleData.isSuccess) {
            setArticle(articleData.data.data)
        }
    }, [articleData.data])


    useEffect(() => {
        if (article) {
            const commentSignal = article
                .flatMap(y => y.comments ? y.comments : [])
                .filter(x => x.signals.length > 0);

            const respenseSignal = article
                .flatMap(x => x.comments && x.comments)
                .filter(x => x.response.length > 0)
                .flatMap(x => x.response)
                .filter(x => x.signals.length > 0)

            setCommentsData([...commentSignal, ...respenseSignal])
            setComments(article.flatMap(y => y.comments))
            setArticles(article)
        }
    }, [article])

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    function toNormalDate(dateString: string): Date {
        return new Date(dateString.replace(" ", "T"));
    }

    //Updated data with search implemented
    const filterData = useMemo(() => {
        if (!comments) {
            setRein(false);
            return [];
        }

        let filtered = comments;

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
                        .toLowerCase()
                        .includes(searchEntry.toLowerCase())
                )
            );
        }

        // ✅ Filtrage par article sélectionné
        if (selectedArticle && selectedArticle !== "none") {
            filtered = filtered.filter((comment) =>
                articles?.some(article =>
                    article.title === selectedArticle && article.comments.some(c => c.id === comment.id)
                )
            );
        }

        return filtered;
    }, [rein, comments, dateRange, searchEntry, selectedArticle, articles]);




    //Delete function

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = current === "tous" ?
        filterData.slice(startIndex, startIndex + itemsPerPage) :
        filterData.filter(x => x.signals.length > 0).slice(startIndex, startIndex + itemsPerPage)

    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    return (
        <div className="w-full flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[40px]">{"Commentaires"}</h1>
            <div className="flex flex-row items-center gap-3">
                <Button onClick={() => setCurrent("tous")} className={`shadow-none text-[16px] rounded-[6px] ${current === "tous" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Tous"}</Button>
                <Button onClick={() => setCurrent("signale")} className={`shadow-none text-[16px] rounded-[6px] ${current === "signale" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Signalés"}</Button>
                <Button onClick={() => setCurrent("supprime")} className={`shadow-none text-[16px] rounded-[6px] ${current === "supprime" ? "bg-[#182067] hover:bg-[#182067] text-white font-bold" : "bg-transparent hover:bg-gray-50 text-[#545454] font-normal"}`}>{"Supprimés"}</Button>
            </div>
            <span className="flex flex-wrap items-center gap-5">
                <span className="relative max-w-sm w-full">
                    <Input
                        type="search"
                        onChange={handleInputChange}
                        value={searchEntry}
                        placeholder="Intitulé du commentaire"
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
                <Select onValueChange={setSelectedArticle}>
                    <SelectTrigger className="border border-[#A1A1A1] max-w-[180px] w-full h-[40px] flex items-center p-2 rounded-none">
                        <SelectValue placeholder="Articles" className="" />
                    </SelectTrigger>
                    <SelectContent className="border border-[#A1A1A1] w-fit flex items-center p-2">
                        <SelectItem value="none">{"Tous les articles"}</SelectItem>
                        {[...new Set(articles?.filter(x => x.comments.length > 0))].map((x, i) => (
                            <SelectItem key={i} value={x.title} className="max-w-[200px] line-clamp-1 truncate">
                                {x.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {articleData.isLoading && "Chargement..."}
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
                                                        <TableHead>{"Commentaires"}</TableHead>
                                                        <TableHead>{"Auteur"}</TableHead>
                                                        <TableHead>{"Envoyé le"}</TableHead>
                                                        <TableHead>{"Statut"}</TableHead>
                                                        <TableHead>{"Nombre signal"}</TableHead>
                                                        <TableHead>{"Action"}</TableHead>
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
                                                                <TableCell className="inline-block text-nowrap text-ellipsis overflow-hidden max-w-[315px] w-fit">{item.message}</TableCell>
                                                                <TableCell className="border">{item.author?.name}</TableCell>
                                                                <TableCell className="border">{item.created_at}</TableCell>
                                                                <TableCell className="border">{item.signals.length > 0 ? "Signalé" : "Normal"}</TableCell>
                                                                <TableCell className="border">{item.signals.length}</TableCell>
                                                                <TableCell className="flex gap-2 items-center justify-center">
                                                                    <ModalWarning id={item.id} action={onDeleteComment} name={item.message}>
                                                                        <LuTrash2 size={20} className="text-red-500 flex items-center justify-center" />
                                                                    </ModalWarning>
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
                    ) : articleData.isSuccess && filterData.length < 1 && article && article.length > 0 ? (
                        "Pas de résultat"
                    ) : articleData.isSuccess && article?.length === 0 ? (
                        "Aucun commentaire"
                    ) : (
                        articleData.isError && (
                            "Impossible de charger vos données. Verifiez votre connexion et réessayez"
                        )
                    )}
                </form>
            </Form>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            <ToastContainer />
        </div>
    );
}

export default CommentsTable;
