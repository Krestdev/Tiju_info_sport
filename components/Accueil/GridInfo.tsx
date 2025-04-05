
import Link from 'next/link';
import { Button } from '../ui/button';
import Info from './Info';


interface Aff {
    gridAff: Category;
    couleur: string;
}
const GridInfo = ({ gridAff, couleur }: Aff) => {

    const isImage = (media: string | undefined): boolean => {
        if (!media) return false;
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(media);
    };
    const articles = gridAff.articles;

    return (
        <div className='containerBloc w-full hidden md:flex flex-col items-center py-[60px] gap-6'>
            <div className='w-full flex flex-wrap items-center justify-between gap-4'>
                        <h2 className="dashboard-heading">{gridAff.title}</h2>
                        <Link href={`/user/${gridAff.title}`}>
                        <Button>
                            {"Tout voir"}
                        </Button>
                        </Link>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                <Info article={articles[0]} couleur={couleur} />
                <div className='grid gap-5'>
                    {
                        articles.slice(1, 4).map((x, i) => {
                            return (

                                <Link href={`/user/detail-article/${x.id}`} key={i} className='flex flex-row gap-7'>
                                    {x.images && (
                                        // isImage(x?.images[0] ? x?.images[0] : settings.noImage) ? (
                                        <img
                                            className={`max-w-[160px] max-h-[97px] w-full h-full aspect-video rounded-[6px] object-cover`}
                                            src={x.images && x.images[0].id ? `https://tiju.krestdev.com/api/image/${x.images[0].id}` : "/images/no-image.jpg"}
                                            alt={`${x.images}`}
                                        />
                                        // ) : (
                                        //     <video
                                        //         className={`max-w-[160px] max-h-[90px] w-full h-full aspect-video rounded-[6px] object-cover`}
                                        //         controls
                                        //         muted
                                        //         loop
                                        //         src={x?.images[0] ? x?.images[0] : settings.noImage}
                                        //     >
                                        //         Votre navigateur ne supporte pas la lecture de cette vidéo.
                                        //     </video>
                                        // )
                                    )}
                                    <div className='flex flex-col gap-1'>
                                        <span className="uppercase font-oswald font-medium text-[16px] leading-[20.8px] text-gray-400">
                                            {x.type}
                                        </span>
                                        <h3 className="first-letter:uppercase line-clamp-2">{x.title}</h3>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default GridInfo
