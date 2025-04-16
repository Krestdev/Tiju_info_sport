"use client"

import React, { use, useState } from 'react'
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { LuSend, LuX } from 'react-icons/lu';
import Comment from '../comment-display';

interface CommenterProps {
    currentArticle: Article;
}

const Commenter = ({
    currentArticle
}: CommenterProps) => {

    const [showComments, setShowComments] = useState(true);
    const [openCommenter, setOpenCommenter] = useState(false);
    const [commentaire, setCommentaire] = useState<string>("");
    const handleAddComment = async (id: string) => {
        if (commentaire.length > 0) { }
    }

    console.log(currentArticle.id);


    return (
        <>
            {/* <div className='sticky bottom-[2px] w-full'>
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
            </div> */}
            <div className='max-w-[804px] w-full flex flex-col gap-5'>
                {/* {openCommenter && ( */}
                <div className="w-full flex items-end justify-center z-50">
                    <div className="flex md:flex-col gap-2 items-center w-full rounded-[20px]">
                        {/* <div className='fixed bottom-[10px] w-full bg-white z-20 flex'>
                            <Input
                                className="flex md:hidden w-full border border-gray-300 rounded-[20px] resize-none"
                                placeholder="Tapez votre commentaire"
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                                autoFocus
                            />
                            <Button
                                onClick={() => { handleAddComment(currentArticle.id.toString()) }}
                                className='px-5 py-5 h-12 absolute right-0 rounded-full' variant={"ghost"}>
                                <LuSend />
                            </Button>
                        </div> */}

                        {/* <div className='flex justify-end md:justify-start md:gap-2 md:mt-1'>
                        <Button
                            className='flex md:hidden bg-transparent shadow-none text-[#012BAE]'
                            onClick={() => { setOpenCommenter(false); handleAddComment(currentArticle.id.toString()) }}
                        >
                            <LuSend />
                        </Button>
                        <Button
                            className='hidden md:flex'
                            onClick={() => { setOpenCommenter(false); handleAddComment(currentArticle.id.toString()) }}
                        >
                            {"COMMENTER"}
                        </Button>
                        <Button
                            variant={"ghost"}
                            className='hidden md:flex'
                            onClick={() => { setCommentaire(""); setOpenCommenter(false) }}
                        >
                            {"ANNULER"}
                        </Button>
                        <Button
                            variant={"ghost"}
                            className='flex md:hidden bg-transparent shadow-none text-black'
                            onClick={() => { setCommentaire(""); setOpenCommenter(false) }}
                        >
                            <LuX />
                        </Button>
                    </div> */}
                    </div>
                </div>
                {/* )} */}

                {currentArticle.comments.length > 0 &&
                    <div className='flex flex-col'>
                        {currentArticle.comments.map(x => <Comment key={x.id} comment={x} />)}
                    </div>
                }
            </div>
        </>
    )
}

export default Commenter
