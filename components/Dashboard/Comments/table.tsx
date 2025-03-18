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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import ModalWarning from "@/components/modalWarning";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Article, comment } from "@/data/temps";
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

const FormSchema = z.object({
    items: z.array(z.number()).refine((value) => value.length > 0, {
        message: "You have to select at least one item.",
    }),
});


function CommentsTable() {
    const { dataArticles, deleteComment } = useStore();
    const queryClient = useQueryClient();

    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");

    useEffect(() => {
        if (tab) {
            setCurrent(tab);
        }
    }, [tab]);


    const [commentsData, setCommentsData] = useState<comment[]>([])
    const [comments, setComments] = useState<comment[]>([])
    const [current, setCurrent] = useState("tous");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false)
    const [selectedArticle, setSelectedArticle] = useState("none");
    const [articles, setArticles] = useState<Article[]>()

    const itemsPerPage = 15;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        },
    })

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles,
    });

    useEffect(() => {
        if (articleData.isSuccess) {
            const commentSignal = articleData.data.flatMap(x => x.donnees).flatMap(y => y.commentaire && y.commentaire).filter(x => x.signals.length > 0)
            const respenseSignal = articleData.data.flatMap(x => x.donnees)
                .flatMap(x => x.commentaire && x.commentaire)
                .filter(x => x.reponse.length > 0)
                .flatMap(x => x.reponse)
                .filter(x => x.signals.length > 0)

            setCommentsData([...commentSignal, ...respenseSignal])
            setComments(articleData.data.flatMap(x => x.donnees).flatMap(y => y.commentaire))
            setArticles(articleData.data?.flatMap(x => x.donnees))
        }
    }, [articleData.data])


    //Search value
    const [searchEntry, setSearchEntry] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    const toNormalDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

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
                const itemDate = toNormalDate(item.date);
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
                    article.titre === selectedArticle && article.commentaire.some(c => c.id === comment.id)
                )
            );
        }
    
        return filtered;
    }, [rein, comments, dateRange, searchEntry, selectedArticle, articles]);
    
    


    //Delete function
    function onDeleteComment(id: number) {
        deleteComment(id)
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Supprimé avec succès");
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = current === "tous" ?
        filterData.filter(x => x.delete === false).slice(startIndex, startIndex + itemsPerPage) :
        current === "signale" ?
            filterData.filter(x => x.signals.length > 0).slice(startIndex, startIndex + itemsPerPage) :
            filterData.filter(x => x.delete === true).slice(startIndex, startIndex + itemsPerPage);

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
                    <DatePick onChange={(range) => setDateRange(range)} />
                </div>
                <Select onValueChange={setSelectedArticle}>
                    <SelectTrigger className="border border-[#A1A1A1] max-w-[180px] w-full h-[40px] flex items-center p-2 rounded-none">
                        <SelectValue placeholder="Articles" className="" />
                    </SelectTrigger>
                    <SelectContent className="border border-[#A1A1A1] w-fit flex items-center p-2">
                        <SelectItem value="none">{"Tous les articles"}</SelectItem>
                        {[...new Set(articles)].map((x, i) => (
                            <SelectItem key={i} value={x.titre} className="max-w-[200px] line-clamp-1 truncate">
                                {x.titre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                                                        <TableHead>{"Commentaires"}</TableHead>
                                                        <TableHead>{"Auteur"}</TableHead>
                                                        <TableHead>{"Envoyé le"}</TableHead>
                                                        <TableHead>{"Statut"}</TableHead>
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
                                                                <TableCell className="border">{item.user?.nom}</TableCell>
                                                                <TableCell className="border">{item.date}</TableCell>
                                                                <TableCell className="border">{item.signals.length > 0 ? "Signalé" : "Normal"}</TableCell>
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

export default CommentsTable;
