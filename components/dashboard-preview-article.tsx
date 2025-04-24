'use client'
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface Props {
    data: Article;
    full:boolean;
}

function ViewArticle({ data, full }: Props) {
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toLocaleDateString("fr-FR", { year: 'numeric', month: '2-digit', day: '2-digit' });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button size={ full ? "default" : "icon"} className={cn(full && "max-w-sm w-full")} variant={"outline"} family={"sans"}>{full ? "Prévisualiation" : <Eye/>}</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-2xl uppercase'>{"Prévisualisation de l'article"}</DialogTitle>
                <DialogDescription/>
            </DialogHeader>
            <div className='flex flex-col gap-4'>
                    <span className={"h-10 px-4 inline-flex items-center gap-2 border border-gray-200 uppercase font-mono text-[14px] leading-[130%] tracking-[-2%] shrink-0 w-fit"}><span className='w-2 h-2' style={{backgroundColor: "#0A0A0A"}}/> {data.title}</span>
                    <h1>{data.title}</h1>
                    <img src={data.imageurl ? `${process.env.NEXT_PUBLIC_API?.substring(0, process.env.NEXT_PUBLIC_API.length -4)}${data.imageurl.substring(1)}` : data.images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${data.images[0].id}`: "/images/no-image.jpg"} alt={data.title} className="w-full h-auto aspect-video object-cover rounded-md"/>
                    <p className='font-semibold italic'>{data.summery}</p>
                    <div className='flex flex-col gap-2'>
                        <span className='font-bold text-gray-900'>{data.author.name}</span>
                        <p className='text-gray-600'>{currentDate}</p>
                        {/**Display Update date if the article has been updated */}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: data.description }} />
                </div>
                <Button className='mt-3 sticky bottom-0' onClick={(e)=>{e.preventDefault(); setOpen(false)}}>{"Fermer"}</Button>
        </DialogContent>
    </Dialog>
  )
}

export default ViewArticle