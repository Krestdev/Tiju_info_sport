import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, isSameDay, parse } from 'date-fns';
import { LuCalendarDays, LuChevronDown } from 'react-icons/lu';
import useStore from '@/context/store';
import axiosConfig from '@/api/api';
import { AxiosResponse } from 'axios';
import { stat } from 'fs';
import DatePicker from 'react-datepicker';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    date: z.coerce.date(),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format invalide (HH:mm)"),
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

    function mergeDateAndTime(data: { date: Date; time: string }): string {
        const [hours, minutes] = data.time.split(':').map(Number);
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

        // On récupère l'time actuelle à Douala
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
            const [hours, mins] = data.time.split(":");
            const publishDate = data.date.setUTCHours(Number(hours), Number(mins));
            return axiosClient.patch(`/articles/${artId}`, {
                ...article,
                category_id: article?.catid,
                summary: article?.summery,
                user_id: idU,
                status: "draft",
                publish_on: new Date(publishDate).toISOString()
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
            time: format(new Date(), "HH:mm"),
        },
    });
    const parseTime = (timeStr: string) => {
        return parse(timeStr, "HH:mm", new Date());
    };

    const [times, setTimes] = useState<string>(format(new Date(), "HH:mm"));

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
                            {
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem className='flex flex-col gap-2'>
                                        <FormLabel>{"Date de publication"}</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} family={"sans"} className={cn("border-input justify-between")}>
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: fr })
                                                        ) : (
                                                            <span>{"Sélectionner une date"}</span>
                                                        )}
                                                        <CalendarIcon size={20} />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date <= new Date()} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )} />
                            }
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => {
                                    const selectedDate = useWatch({ control: form.control, name: "date" });
                                    const now = new Date();
                                    const isToday = selectedDate && isSameDay(selectedDate, now);

                                    return (
                                        <FormItem>
                                            <FormLabel>Heure de publication</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    min={isToday ? format(now, "HH:mm") : undefined}
                                                    {...field}
                                                    onChange={(val) => {
                                                        field.onChange(val.target.value);
                                                        setTimes(val.target.value);
                                                        
                                                    }}
                                                />
                                            </FormControl>
                                            {isToday && field.value && (
                                                <p className="text-sm text-red-500">
                                                    {isBefore(parseTime(field.value), now)
                                                        ? `L'heure doit être après ${format(now, "HH:mm")}`
                                                        : null}
                                                </p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                            <Button
                                variant={"outline"}
                                type="button"
                                className="rounded-none w-full mt-4"
                                onClick={form.handleSubmit(onSubmit2)}
                                isLoading={programArticle.isPending}
                                disabled={isBefore(parseTime(times), new Date())}
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