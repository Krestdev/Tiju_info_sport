import { articles, publicites, users, Users } from "@/data/temps";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Article {
  id: number;
  titre: string;
  type: string;
  description: string;
  image?: string;
  ajouteLe: string;
}

interface Pubs {
  id: number;
  lien: string;
  description?: string;
  prix?: number;
  image: string;
}

interface store {
  settings: any;
  dataArticles: Article[];
  dataPubs: Pubs[];
  dataUsers: Users[];
  currentUser: Users | null; // Ajout de l'utilisateur connecté
}

interface actions {
  addArticle: (article: Article) => void;
  registerUser: (user: Users) => void;
  login: (email: string, password: string) => Users | null; // Action pour la connexion
  logout: () => void; // Action pour la déconnexion
}

const initialData: store = {
  settings: {
    compagnyName: "Tyju Info Sport",
    logo: "/logo.png",
    email: "",
    phone: "",
    address: "",
    pub: "Tyju Publicité",
  },
  dataArticles: articles,
  dataPubs: publicites,
  dataUsers: users,
  currentUser: null, // Initialisation de l'utilisateur connecté à null
};

const useStore = create<store & actions>()(
  persist(
    (set, get) => ({
      ...initialData,

      addArticle: (article) =>
        set((state) => ({
          dataArticles: [...state.dataArticles, article],
        })),
      registerUser: (user) =>
        set((state) => ({
          dataUsers: [...state.dataUsers, user],
        })),
      login: (email, password) => {
        const foundUser = get().dataUsers.find(
          (user) => user.email === email && user.password === password
        );
        if (foundUser) {
          set({ currentUser: foundUser });
        }
        return foundUser || null; 
      },
      logout: () => set({ currentUser: null }),
    }),
    { name: "Tyju" }
  )
);

export default useStore;
