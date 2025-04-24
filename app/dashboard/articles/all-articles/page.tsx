'use client'
import axiosConfig from '@/api/api'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { usePublishedArticles } from '@/hooks/usePublishedData'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { addDays, format } from 'date-fns'
import { CalendarIcon, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { DateRange } from 'react-day-picker'
import ArticlesDataTable from './articles-table'
import { DataTableArticles } from './data-table-articles'
import { columnsArticles } from './columns'

function Page() {
    const { allArticles, isLoading, isSuccess } = usePublishedArticles();
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);
    const [searchByName, setSearchByName] = React.useState<string>("");
    const handleSearchByName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchByName(e.target.value);
    };
    const axiosClient = axiosConfig();
    const getAuthors = useQuery({
        queryKey: ["users"],
        queryFn: ()=>{
            return axiosClient.get<User[]>("/users")
        }
    });

    if(isLoading){
        return <div className='flex flex-col gap-5'>
            <Skeleton className='h-14 w-full max-w-lg'/>
            <div className='flex flex-wrap gap-4 items-center'>
                <Skeleton className='w-full max-w-sm h-10'/>
                <Skeleton className='w-44 h-10'/>
                <Skeleton className='w-44 h-10'/>
                <Skeleton className='w-44 h-10'/>
            </div>
            <div className='flex overflow-x-auto gap-3 items-center'>
                {Array.from({length: 4}).map((_, index) => (
                    <Skeleton key={index} className='w-20 h-10'/>
                ))}
            </div>
            <div className='flex flex-col'>
                {Array.from({length: 7}).map((_, index) => (
                    <Skeleton key={index} className='w-full h-9 max-w-5xl rounded-none'/>
                ))}
            </div>
        </div>
    }
    if(isSuccess){
        return (
          <div className='flex flex-col gap-5'>
              <div className="flex flex-wrap items-center gap-4">
                  <h1>{"Tous les articles"}</h1>
                  <Link href={"/dashboard/articles/add-article"}><Button family={"sans"}>{"Ajouter un article"}<PlusCircle/></Button></Link>
              </div>
              <div className='flex flex-wrap gap-4 items-center'>
                <Input type="search" placeholder={"Nom de l'article"} className='max-w-sm text-sm' value={searchByName} onChange={handleSearchByName}/>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button id="date" variant={"outline"} family={"sans"} className={cn("max-w-sm w-fit border-input", !date && "text-muted-foreground")}>
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>{"Filtrer par date"}</span>
                            )}
                            <CalendarIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}/>
                    </PopoverContent>
                </Popover>
                <Select>
                    <SelectTrigger className='max-w-sm min-w-32 w-fit bg-white' disabled={!getAuthors.isSuccess}>
                        <SelectValue placeholder="Auteur"/>
                    </SelectTrigger>
                    <SelectContent>
                        {getAuthors.isSuccess && getAuthors.data.data.filter(x=>x.role !== "user").map((author, index) => (
                            <SelectItem key={index} value={author.email}>
                                {author.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              {/**Table */}
              <DataTableArticles columns={columnsArticles} data={allArticles}/>
              {/* <ArticlesDataTable articles={allArticles} date={date} searchByName={searchByName}/> */}
          </div>
        )
    }
}

export default Page