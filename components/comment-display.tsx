'use client'
import axiosConfig from '@/api/api'
import RespondOrEditComment from '@/app/[category]/[slug]/respond-comment'
import useStore from '@/context/store'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ThumbsUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

interface CommentData {
    comment: Comments;
    articleId:number;
}

function Comment({comment, articleId}:CommentData) {
    const { activeUser } = useStore();
    const axiosClient = axiosConfig();
    const queryClient = useQueryClient();
    const router = useRouter();
    //delete comment
    const deleteComment = useMutation({
        mutationKey: ["comment"],
        mutationFn: ()=>{
            return axiosClient.delete(`comments/${comment.id}`);
        },
        onSuccess: ()=>{
            toast({
                title: "Commentaire supprimé"
            });
            queryClient.invalidateQueries({queryKey: ["categories"]});
            router.refresh();
        }
    });
    //like comment
    const likeComment = useMutation({
        mutationFn: ()=>{
            const url = comment.likes.find(x=>x===activeUser?.id) ? "unlike" : "like";
            return axiosClient.patch(`comments/${url}/${comment.id}`, {
                "user_id": activeUser?.id
            })
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["categories"]});
            router.refresh();
        },
        onError: ()=>{
            toast({
                variant: "warning",
                title: "Erreur",
                description: "Nous avons rencontré une erreur lors de l'exécution de cette action. Veuillez réessayer."
            })
        }
    });
    //signal comment
    const signalComment = useMutation({
        mutationFn: ()=>{
            return axiosClient.patch(`comments/signal/${comment.id}`, {
                "user_id": activeUser?.id
            });
        }
    })
  return (
    <div className={cn('py-3 inline-flex gap-4 items-start', comment.parent && "pl-8")}>
        <img src={`${comment.author.image !== null && comment.author.image !== undefined ? "https://tiju.krestdev.com/api/image/"+comment.author.image.id : "/images/default-photo.webp"}`} 
        alt={comment.author.name} 
        className='size-10 rounded-full object-cover' 
        />
        <div className='flex flex-col gap-2'>
            <span className='text-base leading-[130%]'>{comment.author.name}</span>
            <p className='text-sm leading-[130%]'>{comment.message}</p>
            { activeUser && (
                <div className='mt-2 flex items-center gap-4'>
                    <span className='inline-flex gap-2 items-center'>
                        <Button size={"mini"} variant={"ghost"} className={cn(comment.likes.find(x=>x === activeUser.id) && "text-primary")} onClick={()=>likeComment.mutate()} disabled={deleteComment.isPending || likeComment.isPending}><ThumbsUp size={12}/></Button>
                        {comment.likes.length > 0 && <span className='text-xs leading-[130%]'>{comment.likes.length}</span>}
                    </span>
                    <RespondOrEditComment articleId={articleId} commentId={comment.id}>
                        <Button size={"mini"} variant={"link"} family={"sans"} className='text-paragraph'>
                            {"Répondre"}
                        </Button>
                    </RespondOrEditComment>
                    {comment.author.id !== activeUser.id && 
                    <Button size={"mini"} variant={"link"} family={"sans"} className='text-paragraph'
                    onClick={()=>signalComment.mutate()}
                    disabled={signalComment.isPending || comment.signals.findIndex(x=>x===activeUser.id)>-1}>
                        {"Signaler"}
                    </Button>}
                    {comment.author.id === activeUser.id && 
                    <RespondOrEditComment articleId={articleId} commentId={comment.id} message={comment.message}>
                        <Button size={"mini"} variant={"link"} family={"sans"} className='text-paragraph'>
                            {"Modifier"}
                        </Button>
                    </RespondOrEditComment>
                    }
                    {comment.author.id === activeUser.id && 
                    <Button size={"mini"} variant={"link"} family={"sans"} className='text-destructive' 
                    onClick={()=>deleteComment.mutate()} 
                    disabled={deleteComment.isPending}>
                        {"Supprimer"}
                    </Button>}
                </div>
            ) }
        </div>
    </div>
  )
}

export default Comment