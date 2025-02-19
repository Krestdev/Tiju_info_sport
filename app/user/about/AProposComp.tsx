import React from 'react'
import { IoMdArrowDropright } from "react-icons/io";

const AProposComp = () => {
    return (
        <div className='containerBloc flex flex-col gap-12 items-center'>
            <div className='text-center text-4xl font-bold pt-10 border-t'>
                <div className='inline-flex gap-2 items-center mb-3'>
                    <p className='text-gray-500'>À PROPOS<span className='text-gray-700 font-medium'> DE NOUS</span></p>
                    <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
                </div>
            </div>
            <div className='bg-blue-50 px-10 py-5 w-fit text-justify'>
                <p className='text-[20px]'>{
                    "Tyju Info Sport est bien plus qu’une simple plateforme d’actualités sportives ; c’est un véritable hub pour tous les passionnés de sport désireux de rester constamment informés des dernières nouvelles, analyses approfondies et événements majeurs du monde sportif. Qu’il s’agisse de compétitions locales ou internationales, nous nous engageons à fournir un contenu riche et varié, couvrant un large éventail de disciplines et offrant des perspectives uniques sur les performances des équipes et des athlètes. Tyju Info Sport permet aux utilisateurs de commenter les articles, d’aimer et de partager du contenu, contribuant ainsi à une communauté dynamique et engagée autour du sport."
                }</p>
            </div>
            <div className='max-w-4xl w-full flex flex-col md:flex-row gap-5 items-center justify-center text-[20px]'>
                <img src="/images/Contact.jpg" alt="image" className='max-w-[250px] w-full h-auto aspect-square object-cover' />
                <div className='flex flex-col gap-2'>
                    <div className='inline-flex gap-2 items-center mb-3 text-2xl'>
                        <p className='text-gray-500'>NOS<span className='text-gray-700 font-medium'> MISSION</span></p>
                        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p><strong className='flex items-center'><IoMdArrowDropright /> Fiabilité :</strong> Fournir des informations sportives fiables et actualisées.</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p><strong className='flex items-center'><IoMdArrowDropright /> Interactivité :</strong> Permettre aux utilisateurs de commenter et réagir aux articles.</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <p><strong className='flex items-center'><IoMdArrowDropright /> Communication :</strong> Créer une communauté interactive où les passionnés peuvent échanger sur leurs sports favoris.</p>
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-row justify-between gap-20'>
                <div className='bg-blue-50 px-10 py-5 w-fit text-justify'>
                    <div className='inline-flex gap-2 items-center mb-3 text-2xl'>
                        <p className='text-gray-500'>POURQUOI<span className='text-gray-700 font-medium'> NOUS ?</span></p>
                        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
                    </div>
                    <p>
                        <strong className='flex items-center'><IoMdArrowDropright /> Informations en temps réel :</strong> Des mises à jour régulières pour ne rien manquer.
                    </p>
                    <p>
                        <strong className='flex items-center'><IoMdArrowDropright /> Communauté engagée :</strong> Partagez votre avis avec d'autres passionnés.
                    </p>
                    <p>
                        <strong className='flex items-center'><IoMdArrowDropright /> Accessibilité :</strong> Disponible sur mobile et ordinateur pour une expérience fluide.
                    </p>
                </div>
                <div className='bg-blue-50 px-10 py-5 w-fit text-justify'>
                    <div className='inline-flex gap-2 items-center mb-3 text-2xl'>
                        <p className='text-gray-500'>NOS<span className='text-gray-700 font-medium'> ATOUTS</span></p>
                        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
                    </div>
                    <p>
                        <strong className='flex items-center'><IoMdArrowDropright /> Contenu varié :</strong> Articles, interviews, analyses et vidéos pour une couverture complète du sport.
                    </p>
                    <p>
                        <strong className='flex items-center'><IoMdArrowDropright /> Expertise :</strong> Des articles rédigés par des passionnés et des experts du domaine.
                    </p>
                    <p>
                        <strong className='flex items-center'><IoMdArrowDropright /> Personnalisation :</strong> Suivez vos sports et équipes préférés pour une expérience sur mesure.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AProposComp
