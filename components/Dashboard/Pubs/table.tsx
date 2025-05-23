"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import { LuSquarePen } from "react-icons/lu";
import AddPubsForm from "./addPubsForm";
import EditPubsForm from "./editPubsForm";
import ModalWarning from "@/components/modalWarning";
import { Trash2 } from "lucide-react";
import { AxiosResponse } from "axios";
import axiosConfig from "@/api/api";

const FormSchema = z.object({
    items: z.array(z.number()),
});

function PubsTable() {
    const queryClient = useQueryClient();
    const axiosClient = axiosConfig();

    const pubsData = useQuery({
        queryKey: ["advertisement"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Advertisement[]>>(
                `/advertisement`
            );
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

    //Search value
    const [searchEntry, setSearchEntry] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [sport, setSport] = useState<Advertisement[]>();
    const [selectedType, setSelectedType] = useState("none");
    const [type, setType] = useState<string[] | undefined>()
    const [selectedStatut, setSelectedStatut] = useState("none");

    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [rein, setRein] = useState(false)
    const itemsPerPage = 15;

    useEffect(() => {
        if (pubsData.isSuccess) {
            setSport(pubsData.data.data)
            // setType(pubsData.data.flatMap(x => x.type))
        }
    }, [pubsData.data])

    //Update searchEntry while the user's typing
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    function toNormalDate(dateString: string): Date {
        return new Date(dateString.replace(" ", "T"));
    }

    const statut = ["Active", "Expiré"]

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

                const itemDebut = new Date(toNormalDate(item.createdAt)).setHours(0, 0, 0, 0);
                const itemFin = new Date(toNormalDate(item.createdAt)).setHours(23, 59, 59, 999);
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

        //Filtrage par type
        // if (selectedType && selectedType !== "none") {
        //     filtered = filtered.filter((el) => el.type === selectedType);
        // }

        //Filtrage par statut
        if (selectedStatut && selectedStatut !== "none") {
            selectedStatut === "Active" ?
                filtered = filtered.filter((el) => (new Date(365 - Number(el.createdAt)).getTime()) > Date.now()) :
                filtered = filtered.filter((el) => (new Date(365 - Number(el.createdAt)).getTime()) <= Date.now())
        }
        return filtered;
    }, [rein, sport, dateRange, searchEntry, selectedType, selectedStatut]);


    const { mutate: deletePubs } = useMutation({
        mutationFn: async (categoryId: number) => {
            return axiosClient.delete(`/advertisement/${categoryId}`);
        },
        onSuccess: () => {
            toast.success("Publicité supprimée avec succès")
            queryClient.invalidateQueries({ queryKey: ["advertisement"] });
        },
    });

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
                        placeholder="Titre de la Publicité"
                        className="max-w-lg h-[40px] rounded-none"
                    />
                </span>
                <AddPubsForm addButton={"Ajouter"} />
                <div className="flex gap-2 items-center">
                    <SlRefresh className="cursor-pointer size-5"
                        onClick={() => {
                            setDateRange(undefined);
                            setRein(true);
                        }} />
                    <DatePick onChange={(range) => setDateRange(range)} show={true} />
                </div>
                <Select onValueChange={setSelectedType}>
                    <SelectTrigger className="border border-[#A1A1A1] max-w-[180px] w-full h-[40px] flex items-center p-2 rounded-none">
                        <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent className="border border-[#A1A1A1] w-fit flex items-center p-2">
                        <SelectItem value="none">{"Tous les types"}</SelectItem>
                        {[...new Set(type)].map((x, i) => (
                            <SelectItem key={i} value={x}>
                                {x}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select onValueChange={setSelectedStatut}>
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
                    {pubsData.isLoading && <h3>{"Chargement..."}</h3>}
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
                                                        <TableHead>{"Statuts"}</TableHead>
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
                                                                <TableCell className="border">{item.title}</TableCell>
                                                                {/* <TableCell className="border">{item.type}</TableCell> */}
                                                                <TableCell className="border">{item.description}</TableCell>
                                                                <TableCell className="border">{item.createdAt}</TableCell>
                                                                <TableCell className="border">{"Date fin"}</TableCell>
                                                                <TableCell className="border">{"Nombres Clicks"}</TableCell>
                                                                <TableCell className="border">{"Statuts"}</TableCell>
                                                                {/* <TableCell className="border">{item.nbClick}</TableCell> */}
                                                                {/* <TableCell className="border">{
                                                                item.statut === "active" ? "Active" : "Expirée"
                                                                }</TableCell> */}
                                                                <TableCell className="flex gap-4 justify-center">
                                                                    <EditPubsForm selectedPubs={item} >
                                                                        <LuSquarePen className="size-5 cursor-pointer" />
                                                                    </EditPubsForm>
                                                                    <ModalWarning id={item.id} action={deletePubs} name={item.title}>
                                                                        <Trash2 className="text-red-400 size-5 cursor-pointer" />
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
                    ) : pubsData.isSuccess && filterData.length < 1 && sport && sport?.length > 0 ? (
                        "Pas de résultat"
                    ) : pubsData.isSuccess && sport?.length === 0 ? (
                        "Aucune publicité"
                    ) : (
                        pubsData.isError && (
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

export default PubsTable;