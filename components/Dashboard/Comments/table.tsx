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
import { comment } from "@/data/temps";
import Pagination from "../Pagination";


function CommentsTable() {
    const { dataArticles, deleteComment } = useStore();
    const queryClient = useQueryClient();

    const [commentsData, setCommentsData] = useState<comment[]>([])

    const articleData = useQuery({
        queryKey: ["articles"],
        queryFn: async () => dataArticles,
    });

    useEffect(() => {
        if (articleData.isSuccess) {
            const commentSignal = articleData.data.flatMap(x => x.donnees).flatMap(y => y.commentaire).filter(x => x.signals.length > 0)
            const respenseSignal = articleData.data.flatMap(x => x.donnees)
                .flatMap(x => x.commentaire && x.commentaire)
                .filter(x => x.reponse.length > 0)
                .flatMap(x => x.reponse)
                .filter(x => x.signals.length > 0)

            setCommentsData([...commentSignal, ...respenseSignal])
        }
    }, [articleData.data])


    //Search value
    const [searchEntry, setSearchEntry] = useState("");

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchEntry(event.target.value);
    }

    //Updated data with search implemented
    const filterData = useMemo(() => {
        if (!commentsData) return [];
        if (searchEntry === "") return commentsData;
        return commentsData.filter((el) =>
            Object.values(el).some((value) =>
                String(value)
                    .toLocaleLowerCase()
                    .includes(searchEntry.toLocaleLowerCase())
            )
        );
    }, [searchEntry, commentsData]);

    //Delete function
    function onDeleteComment(id: number) {
        deleteComment(id)
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
                {/* <AddPubsForm addButton={"Ajouter une publicité"} /> */}
            </span>
            {articleData.isLoading && "Loading"}
            {articleData.isSuccess && filterData.length > 0 ? (
                <div className="min-h-[70vh] overflow-y-auto w-full">
                    <Table>
                        <TableHeader>
                            <TableRow className="text-[18px]">
                                <TableHead>{"ID"}</TableHead>
                                <TableHead>{"User"}</TableHead>
                                <TableHead>{"Message"}</TableHead>
                                <TableHead>{"Nombre de Signalement"}</TableHead>
                                <TableHead>{"Ajouté le"}</TableHead>
                                <TableHead>{"Action"}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((item, id) => {
                                return (
                                    <TableRow className="text-[16px]" key={id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.user?.nom}</TableCell>
                                        <TableCell className="line-clamp-1">{item.message}</TableCell>
                                        <TableCell>{item.signals.length}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell className="flex gap-2 items-center">
                                            <ModalWarning id={item.id} action={onDeleteComment} name={item.id.toString()}>
                                                <Button
                                                    variant={"destructive"}
                                                    size={"icon"}
                                                >
                                                    <Trash2 size={20} />
                                                </Button>
                                            </ModalWarning>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            )}
                        </TableBody>
                    </Table>
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
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            <ToastContainer />
        </div>
    );
}

export default CommentsTable;
