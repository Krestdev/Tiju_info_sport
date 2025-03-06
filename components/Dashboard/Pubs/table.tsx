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
import { Article, Categorie, Pubs } from "@/data/temps";
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

const FormSchema = z.object({
    items: z.array(z.number()),
});

function ArticleTable() {
    const { dataPubs, deleteArticle } = useStore();
    const queryClient = useQueryClient();
    const pubsData = useQuery({
        queryKey: ["pubs"],
        queryFn: async () => dataPubs,
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
    const [sport, setSport] = useState<Pubs[]>();
    const [full, setFull] = useState(false);
    const [current, setCurrent] = useState("tous");
    const [article, setArticle] = useState<Categorie[]>();

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false)
    const itemsPerPage = 15;

    useEffect(() => {
        if (pubsData.isSuccess) {
            setSport(pubsData.data)
        }
    }, [pubsData.data])

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

                const itemDebut = new Date(toNormalDate(item.dateDebut)).setHours(0, 0, 0, 0);
                const itemFin = new Date(toNormalDate(item.dateFin)).setHours(23, 59, 59, 999);
                const rangeDebut = new Date(dateRange.from).setHours(0, 0, 0, 0);
                const rangeFin = dateRange.to
                    ? new Date(dateRange.to).setHours(23, 59, 59, 999)
                    : null;

                return rangeFin
                    ? itemFin >= rangeDebut && itemDebut <= rangeFin
                    : itemFin >= rangeDebut;
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
    const currentItems = filterData.slice(startIndex, startIndex + itemsPerPage) 

    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    return (
        <div className="w-full flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[40px]">{"Publicités"}</h1>
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
                    {pubsData.isLoading && "Loading"}
                    {pubsData.isSuccess && filterData.length > 0 ? (
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
                                                        <TableHead>{"Type"}</TableHead>
                                                        <TableHead>{"Date de debut"}</TableHead>
                                                        <TableHead>{"Date de fin"}</TableHead>
                                                        <TableHead>{"Nombre clics"}</TableHead>
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
                                                                <TableCell className="border">{item.nom}</TableCell>
                                                                <TableCell className="border">{item.type}</TableCell>
                                                                <TableCell className="border">{item.dateDebut}</TableCell>
                                                                <TableCell className="border">{item.dateFin}</TableCell>
                                                                <TableCell className="border">252</TableCell>
                                                                <TableCell className="border">Action</TableCell>



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
                                                                    <EditArticleForm donnee={item} nom={pubsData.data.find(x => x.donnees.some(x => x === item))?.nom}>
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
                    ) : pubsData.isSuccess && filterData.length < 1 && pubsData.data.length > 0 ? (
                        "No result"
                    ) : pubsData.isSuccess && pubsData.data.length === 0 ? (
                        "Empty table"
                    ) : (
                        pubsData.isError && (
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
