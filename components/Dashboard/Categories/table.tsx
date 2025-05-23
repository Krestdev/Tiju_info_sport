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
import Pagination from "../Pagination";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ModalWarning from "@/components/modalWarning";
import { Trash2 } from "lucide-react";
import { LuSquarePen } from "react-icons/lu";
import EditCategorie from "./EditCategorie";
import AddCategory from "./AddCategory";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";
import { usePublishedArticles } from "@/hooks/usePublishedData";

const FormSchema = z.object({
    items: z.array(z.number()),
});

interface successRes {
    data: Category[];
    hb: string
}

function CategoryTable() {
    // const { deleteCategorie } = useStore();
    //Search value
    const [searchEntry, setSearchEntry] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rein, setRein] = useState(false);
    const [nbArt, setNbArt] = useState(0);
    const itemsPerPage = 15;
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig();



    const { categories } = usePublishedArticles()
    const sport = categories

    const { mutate: deleteCategory } = useMutation({
        mutationFn: async (categoryId: number) => {
            return axiosClient.delete(`/category/${categoryId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
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

    const filterData = useMemo(() => {
        if (!sport) {
            setRein(false);
            return [];
        }

        let filtered = sport;

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
    }, [rein, sport, searchEntry]);


    //Delete function
    function onDeleteArticle(id: number) {
        // deleteCategorie(id)
        queryClient.invalidateQueries({ queryKey: ["category"] })
        toast.success("Catégorie supprimée avec succès");
    }

    // Supposons que tu as un tableau de toutes les catégories
    function getArticleCountForParentCategory(
        parentId: number,
        allCategories: Category[]
    ): number {
        // Trouver les enfants de la catégorie parent
        const childCategories = allCategories.filter(
            (category) => category.parent === parentId
        );

        // Calculer la somme des articles des enfants
        const totalArticles = childCategories.reduce((sum, child) => {
            return sum + (child.articles?.length || 0);
        }, 0);

        return totalArticles;
    }

    // Get current items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filterData.slice(startIndex, startIndex + itemsPerPage)

    const totalPages = Math.ceil(filterData.length / itemsPerPage);

    return (
        <div className="w-full flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[40px]">{"Toutes Les Catégories"}</h1>
            <span className="flex flex-wrap items-center gap-5">
                <span className="relative max-w-sm w-full">
                    <Input
                        type="search"
                        onChange={handleInputChange}
                        value={searchEntry}
                        placeholder="Nom de la catégorie"
                        className="max-w-lg h-[40px] rounded-none"
                    />
                </span>
                <AddCategory>
                    <Button className="rounded-none">{"Ajouter une catégorie"}</Button>
                </AddCategory>

            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {filterData.length > 0 ? (
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
                                                        <TableHead>{"Nom"}</TableHead>
                                                        <TableHead>{"Nombre d'articles"}</TableHead>
                                                        <TableHead>{"Parent"}</TableHead>
                                                        <TableHead>{"Actions"}</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {currentItems.map((item, id) => {
                                                        const total = getArticleCountForParentCategory(item.id, currentItems);
                                                        const parent = item.parent ? sport?.find((x) => x.id === item.parent)?.title : "Aucun parent";
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
                                                                <TableCell className="border">{item.parent === null ? total : item.articles.length}</TableCell>
                                                                <TableCell className="border">{parent}</TableCell>
                                                                <TableCell className="flex gap-4 justify-center">
                                                                    <EditCategorie donnee={item} nom={item.title}>
                                                                        <LuSquarePen className="size-5 cursor-pointer" />
                                                                    </EditCategorie>
                                                                    <ModalWarning id={item.id} action={deleteCategory} name={item.title}>
                                                                        <Trash2 className="text-red-400 size-5 cursor-pointer" />
                                                                    </ModalWarning>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                    ) : filterData.length < 1 && sport?.length && sport?.length > 0 ? (
                        "Pas de résultat"
                    ) : sport?.length === 0 ? (
                        "Aucune catégorie"
                    ) : (
                        (
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

export default CategoryTable;
