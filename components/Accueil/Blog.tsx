import Link from "next/link";
import React from "react";

interface Blog {
    id: number;
    type: string;
    titre: string;
    media?: string; // Image ou vidéo
    ajouteLe: string; // Date au format ISO
}

const Blog = ({ id, type, titre, media, ajouteLe }: Blog) => {
    // Fonction pour vérifier si le fichier est une image
    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };

    // Formatage de la date
    const formatDate = (dateStr: string): string => {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateStr).toLocaleDateString("fr-FR", options);
    };

    return (
        <Link href={`/user/detail-article/${id}`} className="containerBloc py-10 flex items-center md:items-start flex-col lg:flex-row gap-5 lg:gap-12">
            {media && (
                isImage(media) ? (
                    <img
                        className="max-w-[640px] w-full h-auto aspect-video rounded-xl object-cover"
                        src={media}
                        alt={`${type} - ${titre}`}
                    />
                ) : (
                    <video
                        className="max-w-[640px] w-full h-auto aspect-video rounded-xl object-cover"
                        controls
                        autoPlay
                        muted
                        loop
                        src={media}
                    >
                        Votre navigateur ne supporte pas la lecture de cette vidéo.
                    </video>
                )
            )}
            <div className="flex flex-col gap-7">
                <div className="flex flex-row gap-2">
                    <p className="uppercase font-bold text-sm text-gray-500">{type}</p>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{titre}</h2>
                <p className="text-gray-500">{formatDate(ajouteLe)}</p>
            </div>
        </Link>
    );
};

export default Blog;
