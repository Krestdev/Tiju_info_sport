"use client"

import React, { use, useState } from 'react'
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { LuSend, LuX } from 'react-icons/lu';
import Comment from '../comment-display';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useStore from '@/context/store';
import axiosConfig from '@/api/api';
import ShareArticle from '../shareArticle';
import { ThumbsUp } from 'lucide-react';

interface CommenterProps {
    currentArticle: Article;
    currentCategory: Category;
}

const Commenter = ({
    currentArticle,
    currentCategory
}: CommenterProps) => {

    const queryClient = useQueryClient();
    const { currentUser, token } = useStore()
    const axiosClient = axiosConfig({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
    });

    //commenter
    const commenter = useMutation({
        mutationKey: ["comment"],
        mutationFn: (id: string) => {
            const idU = currentUser && String(currentUser.id)
            return axiosClient.post(`/comments/${id}`,
                {
                    user_id: idU,
                    message: commentaire
                }
            )
        },
        onSuccess: (data) => {
            setCommentaire("");
            setOpenCommenter(false);
        }
    })

    const handleAddComment = (id: string) => {
        commenter.mutate(id);
    };

    const [showComments, setShowComments] = useState(true);
    const [openCommenter, setOpenCommenter] = useState(false);
    const [commentaire, setCommentaire] = useState<string>("");

    const likerA = useMutation({
            mutationKey: ["comment"],
            mutationFn: (id: string) => {
                const idU = currentUser && String(currentUser.id)
                return axiosClient.patch(`/articles/like/${id}`, {
                    user_id: idU
                });
            },
        });
    
        function handleLike(id: string) {
            likerA.mutate(id);
        }
    
        React.useEffect(() => {
            if (likerA.isSuccess) {
                queryClient.invalidateQueries({ queryKey: ["categories"] });
            } else if (likerA.isError) {
                console.log(likerA.error)
            }
        }, [likerA.isError, likerA.isSuccess, likerA.error])
    
        //Unliker un commentaire
    
        const unLikerA = useMutation({
            mutationKey: ["comment"],
            mutationFn: (id: string) => {
                const idU = currentUser && String(currentUser.id)
                return axiosClient.patch(`/articles/unlike/${id}`, {
                    user_id: idU
                });
            },
        });
    
        function handleUnLikeA(id: string) {
            unLikerA.mutate(id);
        }
    
        React.useEffect(() => {
            if (unLikerA.isSuccess) {
                queryClient.invalidateQueries({ queryKey: ["categories"] });
            } else if (unLikerA.isError) {
                console.log(unLikerA.error)
            }
        }, [unLikerA.isError, unLikerA.isSuccess, unLikerA.error])
    
        function handleClickLikeArticleButton(id: string) {
            if (currentArticle.likes.some(x => x === currentUser?.id)) {
                handleUnLikeA(id);
            } else {
                handleLike(id);
            }
        }


    return (
        <>
            {/**Share Comment Like */}
            <div className='flex flex-wrap justify-between gap-4 items-center'>
                <span className='inline-flex gap-4 items-center'>
                    <ShareArticle articleUrl={`${process.env.NEXT_PUBLIC_HOST}${currentCategory.slug}/${currentArticle.slug}`} article={currentArticle} />
                    {/* <Button variant={"outline"} size={"icon"}><ThumbsUp /></Button> */}
                    <Button onClick={() => handleClickLikeArticleButton(currentArticle.id.toString())} size={'icon'} variant={'outline'} className='size-10 rounded-none border-black'>
                        <ThumbsUp
                            style={{
                                color: currentArticle.likes.some(x => x === currentUser?.id) ? "#012BAE" : "#000000",
                                cursor: "pointer",
                            }}
                            size={30} />
                    </Button>
                    {/* <Button>{"commenter"}</Button> */}
                </span>
                <span className='leading-[130%] font-semibold text-black text-[16px] md:text-[18px]'>{currentArticle.comments.length > 1 ? `${currentArticle.comments.length} Commentaires` : currentArticle.comments.length === 1 ? "1 Commentaire" : "Aucun commentaire"}</span>
            </div>
            <div className='hidden md:flex sticky bottom-[2px] w-full'>
                <Textarea
                    autoFocus
                    rows={3}
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder='Laissez un commentaire'
                    className='w-full resize-none bg-white' />
                <Button
                    onClick={() => { handleAddComment(currentArticle.id.toString()) }}
                    className='px-5 py-5 h-12 absolute bottom-2 right-2 rounded-full' variant={"ghost"}>
                    <LuSend />
                </Button>
            </div>
            <div className='max-w-[804px] w-full flex flex-col gap-5'>
                {/* {openCommenter && ( */}
                <div className="w-full flex items-end justify-center z-50">
                    <div className="flex md:flex-col gap-2 items-center w-full rounded-[20px]">
                        <div className='fixed bottom-[10px] flex items-center w-full bg-white z-20'>
                            <Input
                                className="flex md:hidden w-full mr-10 border border-gray-300 rounded-[20px] resize-none"
                                placeholder="Tapez votre commentaire"
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                                autoFocus
                            />
                            <Button
                                onClick={() => { handleAddComment(currentArticle.id.toString()) }}
                                className='px-5 py-5 h-12 absolute right-10 rounded-full' variant={"ghost"}>
                                <LuSend />
                            </Button>
                        </div>
                    </div>
                </div>
                {/* )} */}

                {currentArticle.comments.length > 0 &&
                    <div className='flex flex-col divide-y divide-gray-100'>
                        {currentArticle.comments.filter(comment => !(currentArticle.comments.flatMap(comment => comment.response.map(rep => rep.id)).includes(comment.id))).map(x => <Comment key={x.id} comment={x} />)}
                    </div>
                }
            </div>
        </>
    )
}

export default Commenter
