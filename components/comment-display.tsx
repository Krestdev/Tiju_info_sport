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
        <div className='py-3 inline-flex gap-4 items-start'>
            <img src={`${comment.author.image !== null && comment.author.image !== undefined ? "https://tiju.krestdev.com/api/image/" + comment.author.image.id : "/images/default-photo.webp"}`} alt={comment.author.name} className='size-10 rounded-full object-cover' />
            <div className='flex flex-col gap-2'>
                <span className='text-base leading-[130%]'>{comment.author.name}</span>
                <p className='text-sm leading-[130%]'>{comment.message}</p>
                {currentUser && (
                    <div className='mt-2 flex items-center gap-4'>
                        <span className='inline-flex gap-2 items-center'>
                            <ThumbsUp size={12} className={cn(comment.likes.find(x => x === currentUser.id) && "text-primary")} />
                            <span className='text-xs leading-[130%]'>{comment.likes.length}</span>
                        </span>
                        <p className='text-xs leading-[130%]'>{"Répondre"}</p>
                        <p className='text-xs leading-[130%] text-destructive'>{"Signaler"}</p>
                    </div>
                )}
            </div>
            {/* Button to show or hide answers */}
            {comment.response.length > 0 && (
                <Button onClick={() => setShowResponses(!showResponses)} className='text-xs leading-[130%] text-primary'>
                    {showResponses ? "Masquer les réponses" : `${comment.response.length} Réponses`}
                </Button>
            )}
            {/**Display the responses if they exist */}
            {showResponses && (
                <div className='ml-10 flex flex-col gap-4'>
                    {comment.response.map(x => <Comment key={x.id} comment={x} />)}
                </div>
            )}
        </div>
    )
}

export default Comment