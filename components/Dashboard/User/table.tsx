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
import { Article, Categorie, Pubs, Users } from "@/data/temps";
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
import { LuPlus } from "react-icons/lu";
import ModalWarning from "@/components/modalWarning";

const FormSchema = z.object({
    items: z.array(z.number()),
});

function UserTable() {
    const { dataUsers, deleteArticle } = useStore();
    const queryClient = useQueryClient();
    const userData = useQuery({
        queryKey: ["pubs"],
        queryFn: async () => dataUsers,
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
    const [user, setUser] = useState<Users[]>();

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("none");
    const [statut, setStatut] = useState<string[] | undefined>()
    const itemsPerPage = 15;

    useEffect(() => {
        if (userData.isSuccess) {
            setUser(userData.data)
            setStatut(userData.data.flatMap(x => x.statut))
        }
    }, [userData.data])

    //Update searchEntry while the user's typing
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    const toNormalDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

    const filterData = useMemo(() => {
        if (!user) {
            setRein(false);
            return [];
        }

        let filtered = user;

        // Filtrage par date
        if (!rein) {
            filtered = filtered.filter((item) => {
                if (!dateRange?.from) return true;
                const itemDate = toNormalDate(item.createdAt);
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

        //Filtrage par statut
        if (selectedStatus && selectedStatus !== "none") {
            filtered = filtered.filter((el) => el.statut === selectedStatus);
        }

        return filtered;
    }, [rein, user, dateRange, searchEntry, selectedStatus]);



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
    const action = ["Bannir", "Modifier"]

    return (
        <div className="w-full flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[40px]">{"Utilisauteurs"}</h1>
            <span className="flex flex-wrap items-center gap-5">
                <span className="relative max-w-sm w-full">
                    <Input
                        type="search"
                        onChange={handleInputChange}
                        value={searchEntry}
                        placeholder="Nom de l'utilisateur"
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
                <Select onValueChange={setSelectedStatus}>
                    <SelectTrigger className="border border-[#A1A1A1] max-w-[180px] w-full h-[40px] flex items-center p-2 rounded-none">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent className="border border-[#A1A1A1] w-fit flex items-center p-2">
                        <SelectItem value="none">{"Tous les statuts"}</SelectItem>
                        {[...new Set(statut)].map((x, i) => (
                            <SelectItem key={i} value={x}>
                                {x}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {userData.isLoading && "Loading"}
                    {userData.isSuccess && filterData.length > 0 ? (
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
                                                        <TableHead>{"Pseudonyme"}</TableHead>
                                                        <TableHead>{"Adresse email"}</TableHead>
                                                        <TableHead>{"Date d'inscription"}</TableHead>
                                                        {/* <TableHead>{"Statut"}</TableHead> */}
                                                        <TableHead>{"Dernière connexion"}</TableHead>
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
                                                                <TableCell className="border">{item.pseudo}</TableCell>
                                                                <TableCell className="border">{item.email}</TableCell>
                                                                <TableCell className="border">{item.createdAt}</TableCell>
                                                                {/* <TableCell className="border">{item.statut}</TableCell> */}
                                                                <TableCell className="border">28/06/2025</TableCell>
                                                                <TableCell className="border">
                                                                    <Select onValueChange={field.onChange} >
                                                                        <div className="w-full flex justify-center">
                                                                            <SelectTrigger className='border border-[#A1A1A1] h-7 flex items-center justify-center w-fit p-2'>
                                                                                <SelectValue
                                                                                    placeholder={
                                                                                        <div className='h-7 max-w-[78px] w-full flex px-2 gap-2 items-center justify-center'>
                                                                                            {"Actions"}
                                                                                        </div>
                                                                                    } />
                                                                            </SelectTrigger>
                                                                        </div>
                                                                        <SelectContent className='border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2'>
                                                                            <ModalWarning id={item.id} name={item.nom} action={() => console.log("")
                                                                            }>
                                                                                <Button variant={"ghost"} className="font-ubuntu h-8 relative flex w-full cursor-default select-none justify-start rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                                                    {"Bannir"}
                                                                                </Button>
                                                                            </ModalWarning>
                                                                            {/* <EditUser selectedUser={item}> */}
                                                                                <Button variant={"ghost"} className="font-ubuntu h-8 relative flex w-full cursor-default select-none justify-start rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                                                    {"Modifier"}
                                                                                </Button>
                                                                            {/* </EditUser> */}
                                                                        </SelectContent>
                                                                    </Select>
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
                    ) : userData.isSuccess && filterData.length < 1 && userData.data.length > 0 ? (
                        "No result"
                    ) : userData.isSuccess && userData.data.length === 0 ? (
                        "Empty table"
                    ) : (
                        userData.isError && (
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

export default UserTable;
