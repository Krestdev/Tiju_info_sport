import { articles, comment, publicites, users, Users } from "@/data/temps";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Article {
  id: number,
  type: string,
  titre: string,
  description: string,
  media?: string,
  ajouteLe: string,
  commentaire: comment[],
  like: Omit<Users, "password">[];
}
export interface Categorie {
  nom: string;
  donnees: Article[];
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
  dataArticles: Categorie[];
  dataPubs: Pubs[];
  dataUsers: Users[];
  currentUser: Users | null;
}

interface actions {
  addArticle: (article: Categorie) => void;
  registerUser: (user: Users) => void;
  login: (email: string, password: string) => Users | null;
  logout: () => void;
  addLike: (id: number, nom: Omit<Users, "password">) => void;
  addComment: (com: comment, id: number) => void;
  deleteComment: (id: number) => void;
  editComment: (id: number, message: string) => void;
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
  currentUser: null,
};

const useStore = create<store & actions>()(
  persist(
    (set, get) => ({
      ...initialData,

      addArticle: (article) =>
        set((state) => ({
          dataArticles: [...state.dataArticles, article],
        })),
      addComment: (com: comment, id: number) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) =>
              article.id === id
                ? {
                  ...article,
                  commentaire: [...article.commentaire, com],
                }
                : article
            ),
          })),
        })),
        
        deleteComment: (id: number) =>
          set((state) => ({
            dataArticles: state.dataArticles.map((categorie) => ({
              ...categorie,
              donnees: categorie.donnees.map((article) => ({
                ...article,
                commentaire: article.commentaire.filter((com) => com.id !== id),
              })),
            })),
          })),

          editComment: (id: number, message: string) =>
            set((state) => ({
              dataArticles: state.dataArticles.map((categorie) => ({
                ...categorie,
                donnees: categorie.donnees.map((article) => ({
                  ...article,
                  commentaire: article.commentaire.map((com) =>
                    com.id === id
                      ? { ...com, message: message } 
                      : com
                  ),
                })),
              })),
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
      addLike: (id: number, user: Omit<Users, "password">) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) =>
              article.id === id
                ? {
                    ...article,
                    like: article.like.some((u) => u.id === user.id)
                      ? article.like.filter((u) => u.id !== user.id) 
                      : [...article.like, user], 
                  }
                : article
            ),
          })),
        })),      
    }),
    { name: "Tyju" }
  )
);

export default useStore;
