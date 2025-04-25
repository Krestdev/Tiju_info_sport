import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, isSameDay, addMinutes } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { fr } from 'date-fns/locale';
import useStore from '@/context/store';
import axiosConfig from '@/api/api';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    date: z.coerce.date().refine(date => !isBefore(date, new Date(new Date().setHours(0, 0, 0, 0))), {
        message: "La date ne peut pas être dans le passé",
    }),
    time: z.string(),
}).refine(data => {
    const current = new Date();
    const [hours, mins] = data.time.split(":");
    
    if (isSameDay(data.date, current)) {
        if (Number(hours) < current.getHours()) {
            return false;
        } else if (Number(hours) === current.getHours()) {
            return Number(mins) >= current.getMinutes() + 15;
        }
    }
    return true;
}, { 
    message: "L'heure doit être au moins 15 minutes dans le futur pour aujourd'hui", 
    path: ["time"] 
});

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    artId: number;
    article: Article | undefined;
    formId: string;
}

const DatePubli = ({ isOpen, onOpenChange, artId, article }: Props) => {
    const { token, currentUser } = useStore();
    const queryClient = useQueryClient();
    const [programmer, setProgrammer] = useState(false);

    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
    });

    const publishNow = useMutation({
        mutationKey: ["articles"],
        mutationFn: (id: number) => {
            return axiosClient.patch(`/articles/publish/${id}`, {
                user_id: currentUser?.id.toString(),
            });
        },
        onSuccess() {
            onOpenChange(false);
            toast.success("Article publié avec succès");
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
    });

    const programArticle = useMutation({
        mutationKey: ["articles"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const [hours, mins] = data.time.split(":");
            const publishDate = new Date(data.date);
            publishDate.setHours(Number(hours), Number(mins));
            
            return axiosClient.patch(`/articles/${artId}`, {
                ...article,
                category_id: article?.catid,
                summary: article?.summery,
                user_id: currentUser?.id.toString(),
                status: "draft",
                publish_on: publishDate.toISOString()
            });
        },
        onSuccess(response) {
            onOpenChange(false);
            toast.success(`Article programmé pour le ${format(new Date(response.data.publish_on), 'PPpp', { locale: fr })}`);
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(),
            time: format(addMinutes(new Date(), 5), "HH:mm"),
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[460px] w-full p-6 !rounded-none">
                <DialogHeader>
                    <DialogTitle className='w-full flex justify-center uppercase text-[40px] font-medium'>
                        Publier un article
                    </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                    <form className="flex flex-col gap-5 px-7 py-10">
                        <Button
                            type="button"
                            className='rounded-none'
                            onClick={() => publishNow.mutate(artId)}
                            isLoading={publishNow.isPending}
                        >
                            {publishNow.isPending ? "Publication..." : "Publier Maintenant"}
                        </Button>
                        
                        {!programmer ? (
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => setProgrammer(true)}
                            >
                                Programmer la publication
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <FormField 
                                    control={form.control} 
                                    name="date" 
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col gap-2'>
                                            <FormLabel>Date de publication</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("justify-between", !field.value && "text-muted-foreground")}>
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: fr })
                                                            ) : (
                                                                <span>Choisir une date</span>
                                                            )}
                                                            <CalendarIcon className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => 
                                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                                        }
                                                        initialFocus
                                                        locale={fr}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Heure de publication</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="time" 
                                                    {...field} 
                                                    min={isSameDay(form.watch("date"), new Date()) 
                                                        ? format(addMinutes(new Date(), 5), "HH:mm")
                                                        : undefined
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Button
                                    type="button"
                                    className="rounded-none w-full mt-4"
                                    onClick={form.handleSubmit((data) => programArticle.mutate(data))}
                                    isLoading={programArticle.isPending}
                                >
                                    {programArticle.isPending ? "En cours..." : "Programmer"}
                                </Button>
                            </div>
                        )}
                    </form>
                    <ToastContainer position="bottom-right" autoClose={3000} />
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default DatePubli;