import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { LuCalendarDays, LuChevronDown } from 'react-icons/lu';
import useStore from '@/context/store';
import axiosConfig from '@/api/api';
import { AxiosResponse } from 'axios';
import { stat } from 'fs';
import DatePicker from 'react-datepicker';

const formSchema = z.object({
    date: z.coerce.date(),
    heure: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format invalide (HH:mm)"),
});

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    artId: number;
    article: Article | undefined;
    formId: string;
}

const DatePubli = ({ isOpen, onOpenChange, artId, article, formId }: Props) => {

    const { token, currentUser } = useStore();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState<number | null>(null);
    const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
    const [submitFunction, setSubmitFunction] = useState(() => onSubmit2);
    const [programmer, setProgrammer] = useState(false);

    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
    });

    function getDoualaDate(programed: Date) {
        ;

        // Obtenir les composants de la date à Douala
        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Douala',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const parts = formatter.formatToParts(programed).reduce((acc: any, part) => {
            if (part.type !== 'literal') acc[part.type] = part.value;
            return acc;
        }, {});


        // Reconstruire une date ISO depuis les composants
        const isoString = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+01:00`;

        // console.log(isoString);
        // return new Date(isoString); // Objet Date réel à Douala
        return isoString
    }

    function mergeDateAndTime(data: { date: Date; heure: string }): string {
        const [hours, minutes] = data.heure.split(':').map(Number);
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Africa/Douala',
            dateStyle: 'full',
            timeStyle: 'long',
        });

        let merged = new Date(data.date);
        merged.setHours(hours);
        merged.setMinutes(minutes);
        merged.setSeconds(0);
        merged.setMilliseconds(0);

        // On récupère l'heure actuelle à Douala
        const doualaTime = getDoualaDate(merged);
        return doualaTime;
    }

    const publishNow = useMutation({
        mutationKey: ["articles"],
        mutationFn: (id: number) => {
            const idU = currentUser && String(currentUser.id)
            return axiosClient.patch(`/articles/publish/${id}`, {
                user_id: idU,
            });
        },
        onSuccess() {
            onOpenChange(false);
            toast.success("Article publié avec succès");
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        retry: 5,
        retryDelay: 5000
    });

    const programArticle = useMutation({
        mutationKey: ["articles"],
        mutationFn: (data: z.infer<typeof formSchema>) => {
            const idU = currentUser && String(currentUser.id)
            return axiosClient.patch(`/articles/${artId}`, {
                ...article,
                summary: article?.summery,
                user_id: idU,
                status: "draft",
                publish_on: mergeDateAndTime(data)
            });
        },
        onSuccess(response) {
            onOpenChange(false);
            toast.success(`Article programmé le: ${response.data.publish_on}`);
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        retry: 5,
        retryDelay: 5000
    });


    function onSubmit3() {
        publishNow.mutate(artId);
    }

    function onSubmit2(data: z.infer<typeof formSchema>) {
        programArticle.mutate(data);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: new Date(),
            heure: "00:00",
        },
    });

    function handleTimeChange(hour: number, minute: number) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
        form.setValue("heure", `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
        setOpen(false);
    }
    const [startDate, setStartDate] = useState<Date | null>(new Date());


    const heure = Array.from({ length: 24 }, (_, i) => i)
    const minute = Array.from({ length: 60 }, (_, i) => i)

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[460px] w-full p-6 !rounded-none">
                <DialogHeader>
                    <DialogTitle className='w-full flex justify-center uppercase text-[40px] font-medium !font-oswald'>{"Publier un article"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id={`form-datepubli-${artId}`} className="flex flex-col gap-5 px-7 py-10">
                        <Button
                            type="button"
                            className='rounded-none'
                            onClick={onSubmit3}
                            isLoading={publishNow.isPending}
                        >
                            {publishNow.isPending ? "Chargement..." : "Publier Maintenant"}
                        </Button>
                        {!programmer && <Button
                            type='button'
                            variant='outline'
                            onClick={() => setProgrammer(true)}
                            isLoading={publishNow.isPending}
                        >
                            {"Programmer la publication"}
                        </Button>}
                        {programmer && <div>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{"Date de publication"}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-full h-[40px] text-left font-normal rounded-none"
                                                    >
                                                        {field.value ? format(field.value, "PPP") : "Choisir une date"}
                                                        <LuCalendarDays className="ml-auto h-4 w-4" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                    disabled={{ before: new Date() }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="heure"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>{"Heure"}</FormLabel>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className="w-full h-[40px] text-left font-normal rounded-none"
                                                >
                                                    {field.value || "Choisir une heure"}
                                                    <LuChevronDown className="ml-auto h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-2 bg-white">
                                                <div className="flex">
                                                    <div className="h-[200px] w-1/2 flex flex-col gap-1 overflow-auto">
                                                        {heure.map((hour) => (
                                                            <Button
                                                                key={hour}
                                                                variant={selectedHour === hour ? "default" : "ghost"}
                                                                className="w-full rounded-none"
                                                                onClick={() => handleTimeChange(hour, selectedMinute ?? 0)}
                                                            >
                                                                {hour.toString().padStart(2, "0")}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    <div className="h-[200px] w-1/2 flex flex-col gap-1 overflow-auto">
                                                        {minute.map((minute) => (
                                                            <Button
                                                                key={minute}
                                                                variant={selectedMinute === minute ? "default" : "ghost"}
                                                                className="w-full rounded-none"
                                                                onClick={() => handleTimeChange(selectedHour ?? 0, minute)}
                                                            >
                                                                {minute.toString().padStart(2, "0")}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                variant={"outline"}
                                type="button"
                                className='rounded-none w-full mt-4'
                                onClick={form.handleSubmit(onSubmit2)}
                                isLoading={programArticle.isPending}
                            >
                                {programArticle.isPending ? "Chargement..." : "Valider"}
                            </Button>
                        </div>}
                    </form>
                    <ToastContainer />
                </Form>
            </DialogContent>
        </Dialog >
    );
}

export default DatePubli;