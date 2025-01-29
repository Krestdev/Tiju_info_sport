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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Ellipsis, Search, SquarePen, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
// import AddUserForm from "./addUserForm";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";
import ModalWarning from "@/components/modalWarning";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import EditUserForm from "./editUserForm";
import { FiEdit } from "react-icons/fi";
import AddPubsForm from "./addPubsForm";
import EditPubsForm from "./editPubsForm";
import FullScreen from "../FullScreen";
import Pagination from "../Pagination";


function PubsTable() {
    const { dataPubs, deletePub } = useStore();
    const queryClient = useQueryClient();
    const pubsData = useQuery({
        queryKey: ["pubs"],
        queryFn: async () => dataPubs,
    });

    //Search value
    const [searchEntry, setSearchEntry] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [full, setFull] = useState(false)
    const itemsPerPage = 10;

    //Update searchEntry while the user's typing
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    //Updated data with search implemented
    //to do: change data articles for data
    const filterData = useMemo(() => {
        if (!pubsData.data) return [];
        if (searchEntry === "") return pubsData.data;
        return pubsData.data.filter((el) =>
            Object.values(el).some((value) =>
                String(value)
                    .toLocaleLowerCase()
                    .includes(searchEntry.toLocaleLowerCase())
            )
        );
        //to do: complete this code
    }, [searchEntry, pubsData.data]);


    useEffect(() => {
        if (pubsData.isSuccess) {
            //console.log(data);
            //console.log(filterData);
        }
    }, [pubsData.isSuccess]);

    //Delete function
    function onDeletePub(id: number) {
        deletePub(id)
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
                <span className="relative max-w-sm w-full">
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
                </span>
                <AddPubsForm addButton={"Ajouter une publicité"} />
            </span>
            {pubsData.isLoading && "Loading"}
            {pubsData.isSuccess && filterData.length > 0 ? (
                <div className="min-h-[70vh] overflow-y-auto w-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="text-[18px]">
                                <TableHead>{"ID"}</TableHead>
                                <TableHead>{"Nom"}</TableHead>
                                <TableHead>{"Lien"}</TableHead>
                                <TableHead>{"Ajouté le"}</TableHead>
                                <TableHead>{"Image"}</TableHead>
                                <TableHead>{"Action"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((item, id) => {
                                return (
                                    <TableRow className="text-[16px]" key={id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.nom}</TableCell>
                                        <TableCell>{item.lien}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell onClick={() => setFull(!full)} className="cursor-pointer">
                                            <FullScreen image={item.image}>
                                                <img
                                                    src={item.image}
                                                    alt={item.nom}
                                                    className="size-12 object-cover"
                                                />
                                            </FullScreen>
                                        </TableCell>

                                        <TableCell className="flex gap-2 items-center">
                                            <ModalWarning id={item.id} action={onDeletePub} name={item.nom}>
                                                <Button
                                                    variant={"destructive"}
                                                    size={"icon"}
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </ModalWarning>
                                            <EditPubsForm selectedPubs={item}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm">
                                                    <FiEdit size={"20px"} />
                                                </Button>
                                            </EditPubsForm>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            )}
                        </TableBody>
                    </Table>
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
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            <ToastContainer />
        </div>
    );
}

export default PubsTable;
