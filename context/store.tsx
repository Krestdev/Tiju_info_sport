import { articles, publicites } from "@/data/temps"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface Article {
    id: number,
    titre: string
    type: string,
    description: string,
    image?: string,
    ajouteLe: string
}

interface Pubs {
    id: number,
    lien: string,
    description?: string,
    prix?: number,
    image: string
}

interface store {
    settings: any
    dataArticles: Article[]
    dataPubs: Pubs[]
}

interface actions {
    addArticle: (article: any) => void;
}

const initialData: store = {
    settings: {
        compagnyName: "Tyju Info Sport",
        logo: "/logo.png",
        email: "",
        phone: "",
        address: "",
        pub: "Tyju Publicité"
    },
    dataArticles: articles,

    dataPubs: publicites
}

const useStore = create<store & actions>()(
  persist(
    (set, get) => ({

        ...initialData,

        addArticle: (article) => set((state) => ({ dataArticles: [...state.dataArticles, article] })),
    }),
    { name: "Tyju" }
));

export default useStore;