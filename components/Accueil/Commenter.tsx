import React from 'react'
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { LuSend, LuX } from 'react-icons/lu';

interface CommenterProps {
    openCommenter: boolean;
    setOpenCommenter: (value: boolean) => void;
    commentaire: string;
    setCommentaire: (value: string) => void;
    handleAddComment: (id: string) => void;
    articleId: number;
}

const Commenter = ({
    openCommenter,
    setCommentaire,
    setOpenCommenter,
    handleAddComment,
    articleId,
    commentaire
}: CommenterProps) => {
    return (
        <div className='flex md:hidden justify-center items-center'>
            {openCommenter && (
                <div className="fixed inset-0 flex items-end justify-center z-50">
                    <div className="bg-white flex md:flex-col gap-2 items-center w-full max-w-md shadow-lg rounded-[20px]">
                        <Input
                            className="flex md:hidden w-full border border-gray-300 rounded-[20px] resize-none"
                            placeholder="Tapez votre commentaire"
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            autoFocus
                        />
                        <Textarea
                            rows={3}
                            className="hidden md:flex w-full border border-gray-300 resize-none"
                            placeholder="Tapez votre commentaire"
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            autoFocus
                        />
                        <div className='flex justify-end md:justify-start md:gap-2 md:mt-1'>
                            <Button
                                className='flex md:hidden bg-transparent shadow-none text-[#012BAE]'
                                onClick={() => { setOpenCommenter(false); handleAddComment(articleId.toString()) }}
                            >
                                <LuSend />
                            </Button>
                            <Button
                                className='hidden md:flex'
                                onClick={() => { setOpenCommenter(false); handleAddComment(articleId.toString()) }}
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Commenter
