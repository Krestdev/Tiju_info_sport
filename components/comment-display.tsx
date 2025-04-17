'use client'
import useStore from '@/context/store'
import { cn } from '@/lib/utils'
import { ThumbsUp } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

interface CommentData {
    comment: Comments
}

function Comment({ comment }: CommentData) {
    const { currentUser } = useStore()
    const [showResponses, setShowResponses] = React.useState(false)
    return (
        <div>
            <div className='inline-flex gap-4 py-3 items-start'>
                <img src={`${comment.author.image !== null && comment.author.image !== undefined ? "https://tiju.krestdev.com/api/image/" + comment.author.image.id : "/images/default-photo.webp"}`} alt={comment.author.name} className='size-10 rounded-full object-cover' />
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <span className='text-base leading-[130%]'>{comment.author.name}</span>
                        <p className='text-sm leading-[130%]'>{comment.message}</p>
                    </div>
                    {currentUser && (
                        <div className='flex items-center gap-4'>
                            <span className='inline-flex gap-2 items-center'>
                                <ThumbsUp size={12} className={cn(comment.likes.find(x => x === currentUser.id) && "text-primary")} />
                                <span className='text-xs leading-[130%]'>{comment.likes.length}</span>
                            </span>
                            <p className='text-xs leading-[130%]'>{"Répondre"}</p>
                            <p className='text-xs leading-[130%] text-destructive'>{"Signaler"}</p>
                            {/* Button to show or hide answers */}
                            {comment.response.length > 0 && (
                                <Button variant={"ghost"} onClick={() => setShowResponses(!showResponses)} className='text-xs leading-[130%] text-primary'>
                                    {showResponses ? "Masquer" : `${comment.response.length} Réponses`}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div>
                {/**Display the responses if they exist */}
                {showResponses && (
                    <div className='ml-10 flex flex-col divide-y divide-gray-200'>
                        {comment.response.map(x => <Comment key={x.id} comment={x} />)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment