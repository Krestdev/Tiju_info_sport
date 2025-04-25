'use client'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Link2, Share2 } from 'lucide-react'
import { SetImageUrl } from '@/lib/utils'

interface shareProps {
    article: Article;
    articleUrl: string;
}

function ShareArticle({article, articleUrl}:shareProps) {

    const [isCopied, setIsCopied] = React.useState<boolean>(false);

    const handleCopyLink = async () => {
        try {
          await navigator.clipboard.writeText(articleUrl);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset après 2s
        } catch (err) {
          console.error('Échec de la copie :', err);
          // Fallback pour les anciens navigateurs
          const textarea = document.createElement('textarea');
          textarea.value = articleUrl;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }
      };

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant={"outline"} size={"icon"}><Share2/></Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="uppercase text-xl text-center">{"Partager l'article"}</DialogTitle>
                <DialogDescription className='text-center'>{"Vous pouvez partager l'article sur les réseaux ou copier le lien"}</DialogDescription>
                <div className='py-6 min-h-72 flex flex-col gap-4 items-center justify-center'>
                    <img src={ article.imageurl ? SetImageUrl(article.imageurl) : article.images.length > 0 ? `${process.env.NEXT_PUBLIC_API}image/${article.images[0].id}`: "/images/no-image.jpg"} alt={article.title} className="w-full h-auto aspect-video max-w-80 object-cover rounded-md"/>
                    <Button variant={"outline"} className='w-full max-w-60' onClick={handleCopyLink}><Link2/>{isCopied ? "Lien copié" : "copier le lien"}</Button>
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default ShareArticle