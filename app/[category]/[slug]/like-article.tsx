'use client'
import axiosConfig from '@/api/api';
import { Button } from '@/components/ui/button';
import useStore from '@/context/store';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, ThumbsUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

interface Props {
    article: Article; //Article Id
}

function LikeArticle({article}:Props) {
    const { activeUser } = useStore();
    const axiosClient = axiosConfig();
    const router = useRouter();
    const queryClient = useQueryClient();
    const postLike = useMutation({
        mutationKey: ["like"],
        mutationFn: (url:string)=>{
            return axiosClient.patch(`articles/${url}/${article.id}`, {
                "user_id": activeUser?.id
            })
        },
        onSuccess: ()=>{
            setLiked(!liked);
            queryClient.invalidateQueries({queryKey: ["categories"]});
            router.refresh();
        },
        onError: ()=>{
            toast({
                variant: "warning",
                title: "Erreur",
                description: "Une erreur a été rencontrée"
            })
        }
    })
    const [liked, setLiked] = React.useState(!activeUser ? false : article.likes.findIndex(x=>x===activeUser.id) === -1 ? false : true);
    const updateLiked = ()=>{
        if(!activeUser){
            router.push("/connexion");
            toast({
                variant: "warning",
                title: "Connexion requise",
                description: "Pour aimer une publication vous devez être connecté."
            });
        } else {
            if(liked){
                postLike.mutate("unlike");
            } else {
                postLike.mutate("like");
            }
        }
    }
  return (
    <Button variant={"outline"} size={"icon"} 
    className={cn("relative",liked && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")} 
    onClick={updateLiked} disabled={postLike.isPending}
    >
        {postLike.isPending ? <Loader2 className='animate-spin'/> :<ThumbsUp/>}
        {article.likes.length > 0 && <span className='absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 border border-white w-5 h-5 rounded-full inline-flex items-center justify-center bg-primary text-primary-foreground text-xs'>{article.likes.length}</span>}
    </Button>
  )
}

export default LikeArticle