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
import { Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import ModalWarning from "@/components/modalWarning";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import EditUserForm from "./editUserForm";
// import AddPubsForm from "./addPubsForm";
// import EditPubsForm from "./editPubsForm";
import FullScreen from "../FullScreen";
import { Article } from "@/data/temps";
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
    const [sport, setSport] = useState<Article[]>()
    const [full, setFull] = useState(false)

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false)
    const itemsPerPage = 15;

    useEffect(() => {
        if (articleData.isSuccess) {
            setSport(articleData.data.flatMap(x => x.donnees))
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
            setRein(false)
            return []
        };

        if (rein) {
            setRein(false)
            return sport
        }
        return sport.filter((item) => {
            setRein(false)
            if (!dateRange?.from) return true;
            const itemDate = toNormalDate(item.ajouteLe);
            return (
                itemDate >= dateRange.from &&
                (dateRange.to ? itemDate <= dateRange.to : true)
            );
        });

    }, [rein, sport, dateRange]);


    //Updated data with search implemented
    //to do: change data articles for data
    // const filterData = useMemo(() => {
    //     if (!sport) return [];
    //     if (searchEntry === "") return sport;
    //     return sport.filter((el) =>
    //         Object.values(el).some((value) =>
    //             String(value)
    //                 .toLocaleLowerCase()
    //                 .includes(searchEntry.toLocaleLowerCase())
    //         )
    //     );
    //     //to do: complete this code
    // }, [searchEntry, sport]);


    //Delete function
    function onDeleteArticle(id: number) {
        deleteArticle(id)
        queryClient.invalidateQueries({ queryKey: ["users"] })
        toast.success("Supprimé avec succès");
    }

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filterData.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    return (
        <div className="w-full">
            <span className="flex flex-wrap items-center justify-end gap-5 mb-10">
                {/* <span className="relative max-w-sm w-full">
                    <Input
                        type="search"
                        onChange={handleInputChange}
                        value={searchEntry}
                        placeholder="Rechercher un utilisateur"
                        className="max-w-lg pr-3"
                    />
                    <Search
                        size={16}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 ${searchEntry != "" && "hidden"
                            }`}
                    />
                </span> */}
                <div className="flex gap-2 items-center">
                    <SlRefresh className="cursor-pointer size-5"
                        onClick={() => {
                            setDateRange(undefined);
                            setRein(true);
                        }} />
                    <DatePick onChange={(range) => setDateRange(range)} />
                </div>
                <AddArticleForm addButton={"Ajouter un article"} />
            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {articleData.isLoading && "Loading"}
                    {articleData.isSuccess && filterData.length > 0 ? (
                        <div className="min-h-[70vh] overflow-y-auto w-full">
                            <FormField
                                control={form.control}
                                name="items"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormControl>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="text-[18px]">
                                                        <TableHead>
                                                            <Checkbox
                                                                checked={currentItems.length > 0 && field.value?.length === currentItems.length}
                                                                onCheckedChange={(checked) => {
                                                                    field.onChange(checked ? currentItems.map((item) => item.id) : []);
                                                                }}
                                                            />
                                                        </TableHead>
                                                        <TableHead>{"type"}</TableHead>
                                                        <TableHead>{"titre"}</TableHead>
                                                        <TableHead>{"Image"}</TableHead>
                                                        <TableHead>{"Nbr Likes"}</TableHead>
                                                        <TableHead>{"Nbr Commentaires"}</TableHead>
                                                        <TableHead>{"Ajouté le"}</TableHead>
                                                        <TableHead>{"Type d'abonnement"}</TableHead>
                                                        <TableHead>{"Actions"}</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {currentItems.map((item, id) => {
                                                        return (
                                                            <TableRow className="text-[16px]" key={id}>
                                                                <TableCell>
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
                                                                <TableCell>{item.type}</TableCell>
                                                                <TableCell className="inline-block text-nowrap text-ellipsis overflow-hidden max-w-[200px] w-full">{item.titre}</TableCell>
                                                                <TableCell onClick={() => setFull(!full)} className="cursor-pointer">
                                                                    {item.media &&
                                                                        <FullScreen image={item.media[0]}>
                                                                            <img src={item.media[0]} alt={item.type} className="size-12 object-cover" />
                                                                        </FullScreen>}
                                                                </TableCell>

                                                                <TableCell>{item.like.length}</TableCell>
                                                                <TableCell>{item.commentaire.length}</TableCell>
                                                                <TableCell>{item.ajouteLe}</TableCell>
                                                                <TableCell>{item.abonArticle.nom}</TableCell>
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

                    <Button type="submit">Soumetre</Button>
                </form>
            </Form>

            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

            <ToastContainer />
        </div>
    );
}

export default ArticleTable;
