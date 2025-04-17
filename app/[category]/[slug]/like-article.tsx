'use client'
import axiosConfig from '@/api/api';
import { Button } from '@/components/ui/button';
import useStore from '@/context/store';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
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
    const postLike = useMutation({
        mutationKey: ["like"],
        mutationFn: (url:string)=>{
            return axiosClient.patch(`articles/${url}/${article.id}`, {
                "user_id": activeUser?.id
            })
        },
        onSuccess: ()=>{
            setLiked(!liked);
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
    <Button variant={"outline"} size={"icon"} className={cn(liked && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")} onClick={updateLiked} disabled={postLike.isPending}>{postLike.isPending ? <Loader2 className='animate-spin'/> :<ThumbsUp/>}</Button>
  )
}

export default LikeArticle