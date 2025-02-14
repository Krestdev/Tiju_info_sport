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
import { Search, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import AddUserForm from "./addUserForm";
import ModalWarning from "@/components/modalWarning";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditUserForm from "./editUserForm";
import { FiEdit } from "react-icons/fi";
import Pagination from "../Pagination";


function UsersTable() {
  const { dataUsers, deleteUser } = useStore();
  const queryClient = useQueryClient();
  const usersData = useQuery({
    queryKey: ["users"],
    queryFn: async () => dataUsers,
  });

  //Search value
  const [searchEntry, setSearchEntry] = useState("");

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //Update searchEntry while the user's typing
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchEntry(event.target.value);
  }

  //Updated data with search implemented
  //to do: change data articles for data
  const filterData = useMemo(() => {
    if (!usersData.data) return [];
    if (searchEntry === "") return usersData.data;
    return usersData.data.filter((el) =>
      Object.values(el).some((value) =>
        String(value)
          .toLocaleLowerCase()
          .includes(searchEntry.toLocaleLowerCase())
      )
    );
    //to do: complete this code
  }, [searchEntry, usersData.data]);


  useEffect(() => {
    if (usersData.isSuccess) {
      //console.log(data);
      //console.log(filterData);
    }
  }, [usersData.isSuccess]);

  //Delete function
  function onDeleteUser(id: number) {
    deleteUser(id)
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
        <AddUserForm addButton={"Ajouter un utilisateur"} />
      </span>
      {usersData.isLoading && "Loading"}
      {usersData.isSuccess && filterData.length > 0 ? (
        <div className="min-h-[70vh] overflow-y-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="text-[18px]">
                <TableHead>{"ID"}</TableHead>
                <TableHead>{"Nom"}</TableHead>
                <TableHead>{"Pseudo"}</TableHead>
                <TableHead>{"Email"}</TableHead>
                <TableHead>{"Phone"}</TableHead>
                <TableHead>{"Inscrit le"}</TableHead>
                <TableHead>{"Role"}</TableHead>
                <TableHead>{"Password"}</TableHead>
                <TableHead>{"Abonnement"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item, id) => {
                return (
                  <TableRow className="text-[16px]" key={id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nom}</TableCell>
                    <TableCell>{item.pseudo}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.password}</TableCell>
                    <TableCell>
                      <Badge className={`${item.abonnement?.cout === 0 ? 'bg-gray-300 text-black' : 'bg-green-500 text-white'}`}>
                        {item.abonnement?.nom}
                      </Badge>
                    </TableCell>

                    <TableCell className="flex gap-2 items-center">
                      <ModalWarning id={item.id} action={onDeleteUser} name={item.nom}>
                        <Button
                          variant={"destructive"}
                          size={"icon"}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </ModalWarning>
                      <EditUserForm selectedUser={item}>
                        <Button
                          variant="ghost"
                          size="sm">
                          <FiEdit size={"20px"} />
                        </Button>
                      </EditUserForm>
                    </TableCell>
                  </TableRow>
                )
              }
              )}
            </TableBody>
          </Table>
        </div>
      ) : usersData.isSuccess && filterData.length < 1 && usersData.data.length > 0 ? (
        "No result"
      ) : usersData.isSuccess && usersData.data.length === 0 ? (
        "Empty table"
      ) : (
        usersData.isError && (
          "Some error occured"
        )
      )}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      <ToastContainer />
    </div>
  );
}

export default UsersTable;
