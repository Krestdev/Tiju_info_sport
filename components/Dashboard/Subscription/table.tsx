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
import { CalendarIcon, Search, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import ModalWarning from "@/components/modalWarning";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import EditUserForm from "./editUserForm";
// import AddPubsForm from "./addPubsForm";
// import EditPubsForm from "./editPubsForm";
import FullScreen from "../FullScreen";
import { Article } from "@/data/temps";
// import AddArticleForm from "./addArticleForm";
// import EditArticleForm from "./editArticleForm";
import { FiEdit } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { DateRange } from "react-day-picker";
import { DatePick } from "../DatePick";
import { SlRefresh } from "react-icons/sl";
import AddSubscriptionForm from "./addSubscriptionForm";
import EditSubscriptionForm from "./editSubscriptionForm";
import Pagination from "../Pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const FormSchema = z.object({
    items: z.array(z.number()).refine((value) => value.length > 0, {
        message: "You have to select at least one item.",
    }),
});

function SubscritionTable() {
    const { dataSubscription, deleteArticle } = useStore();
    const queryClient = useQueryClient();

    const subscritionData = useQuery({
        queryKey: ["subscriptions"],
        queryFn: async () => dataSubscription,
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
    const [full, setFull] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    useEffect(() => {
        if (dateRange) {
            console.log("Date range updated:", dateRange);
        }
    }, [dateRange]);



    const itemsPerPage = 20;


    //Update searchEntry while the user's typing
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    const toNormalDate = (dateStr: string): Date => {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

    // const filterData = useMemo(() => {
    //     if (!subscritionData.data) {
    //         return []
    //     };
    //     return subscritionData.data.filter((item) => {
    //         if (!dateRange?.from) return true;
    //         const itemDate = toNormalDate(item.ajouteLe);
    //         return (
    //             itemDate >= dateRange.from &&
    //             (dateRange.to ? itemDate <= dateRange.to : true)
    //         );
    //     });

    // }, [subscritionData.data, dateRange]);


    // Updated data with search implemented
    // to do: change data articles for data

    const filterData = useMemo(() => {
        if (!subscritionData.data) return [];
        if (searchEntry === "") return subscritionData.data;
        return subscritionData.data.filter((el) =>
            Object.values(el).some((value) =>
                String(value)
                    .toLocaleLowerCase()
                    .includes(searchEntry.toLocaleLowerCase())
            )
        );
        //to do: complete this code
    }, [searchEntry, subscritionData.data]);


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
            <h1 className="uppercase text-[40px]">{"Abonnements"}</h1>
            <span className="flex flex-wrap items-center justify-end gap-5 mb-10">
                {/* <span className="relative max-w-sm w-full">
                    <Input
                        type="search"
                        onChange={handleInputChange}
                        value={searchEntry}
                        placeholder="Rechercher un abonnement"
                        className="max-w-lg pr-3"
                    />
                    <Search
                        size={16}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 ${searchEntry != "" && "hidden"
                            }`}
                    />
                </span> */}
                <AddSubscriptionForm addButton={"Ajouter un abonnement"} />
            </span>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {subscritionData.isLoading && "Loading"}
                    {subscritionData.isSuccess && filterData.length > 0 ? (
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
                                                        <TableHead>{"Titre"}</TableHead>
                                                        <TableHead>{"Prix mois"}</TableHead>
                                                        <TableHead>{"Prix année"}</TableHead>
                                                        <TableHead>{"Nombre d'abonnés"}</TableHead>
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
                                                                <TableCell className="border">{item.coutMois}</TableCell>
                                                                <TableCell className="border">{item.coutAn}</TableCell>
                                                                {/* <TableCell className="border">{item.validite} Mois</TableCell> */}
                                                                <TableCell className="border">{"A compter"}</TableCell>
                                                                <TableCell className="border flex gap-2 items-center">
                                                                    <ModalWarning id={item.id} action={onDeleteArticle} name={item.nom}>
                                                                        <Button
                                                                            variant={"destructive"}
                                                                            size={"icon"}
                                                                        >
                                                                            <Trash2 size={20} />
                                                                        </Button>
                                                                    </ModalWarning>
                                                                    <EditSubscriptionForm selectedPubs={item}>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm">
                                                                            <FiEdit size={"20px"} />
                                                                        </Button>
                                                                    </EditSubscriptionForm>
                                                                    {/* <FaRegEye size={"20px"} /> */}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    ) : subscritionData.isSuccess && filterData.length < 1 && subscritionData.data.length > 0 ? (
                        "No result"
                    ) : subscritionData.isSuccess && subscritionData.data.length === 0 ? (
                        "Empty table"
                    ) : (
                        subscritionData.isError && (
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

export default SubscritionTable;
