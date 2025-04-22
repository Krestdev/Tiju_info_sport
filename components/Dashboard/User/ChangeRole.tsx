
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useStore from "@/context/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { abonnement, Abonnement, Users } from "@/data/temps";
import axiosConfig from "@/api/api";
import { useRouter } from "next/navigation";

const formSchema = z
    .object({
        role: z.string({ message: "You must select a country" }),
    });


type Props = {
    children: ReactNode;
    selectedUser: User;
};

function ChangeRole({ children, selectedUser }: Props) {
    const { token } = useStore();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [abon, setAbon] = useState<Abonnement[]>()

    const queryClient = useQueryClient();
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json"
    });
    const router = useRouter();

    const changeRoles = useMutation({
        mutationKey: ["user"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const idU = String(selectedUser.id)
            return axiosClient.patch(`/users/changerole/${idU}`,
                {
                    target_user_id: selectedUser.id,
                    from_role: selectedUser.role,
                    to_role: data.role
                }
            );
        },
    });

    useEffect(() => {
        if (changeRoles.isSuccess) {
            toast.success("Role modifié avec succès");
            queryClient.invalidateQueries({ queryKey: ["user"] });
            setDialogOpen(false);
            form.reset();
        }
    }, [changeRoles.data])

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: selectedUser.role,
        },
    });

    //Submit function
    function onSubmit(values: z.infer<typeof formSchema>) {
        changeRoles.mutate(values);
    }

    const role = ["admin", "editor", "user"]

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Changer le role"}</DialogTitle>
                    <DialogDescription>
                        {"Remplissez le formulaire pour changer le role"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 px-7 py-10'>
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{"Nouveau Role"}</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2 rounded-none">
                                                <SelectValue placeholder="Déffinissez un role" />
                                            </SelectTrigger>
                                            <SelectContent className="border border-[#A1A1A1] max-w-[384px] w-full flex items-center p-2 rounded-none">
                                                {role.map((role, index) => (
                                                    <SelectItem key={index} value={role}>
                                                        {role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='rounded-none max-w-[384px] font-ubuntu w-fit'>{"Changer le role"}</Button>

                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ChangeRole;
