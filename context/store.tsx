import { articles, comment, publicites, users, Users } from "@/data/temps";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Article {
  id: number,
  type: string,
  titre: string,
  extrait: string,
  description: string,
  media?: string,
  ajouteLe: string,
  commentaire: comment[],
  like: Omit<Users, "password">[];
  signals: Omit<Users, "password">[];
  user: Users
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
  isFull: boolean | undefined
  favorite: Categorie[] | undefined
}

interface actions {
  addArticle: (article: Categorie) => void;
  registerUser: (user: Users) => void;
  login: (email: string, password: string) => Users | null;
  logout: () => void;
  addLike: (id: number, nom: Omit<Users, "password">) => void;
  addSignals: (id: number, nom: Omit<Users, "password">) => void;
  addComment: (com: comment, idA: number) => void;
  addResponse: (res: comment, id: number, idC: number) => void;
  deleteComment: (id: number) => void;
  deleteReponse: (idC: number, idR: number) => void;
  deleteUser: (id: number) => void;
  editUser: (user: any) => void;
  editComment: (id: number, message: string) => void;
  editReponse: (idC: number, idR: number, message: string) => void;
  setIsFull: () => void;
  setFavorite: (cate: Categorie[] | []) => void;
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
  isFull: true,
  favorite: articles
};

const useStore = create<store & actions>()(
  persist(
    (set, get) => ({
      ...initialData,

      setFavorite: (cate: Categorie[] | undefined) =>
        set((state) => ({
          favorite: cate,
        })),

      setIsFull: () =>
        set((state) => ({
          isFull: !state.isFull,
        })),

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

      addResponse: (res: comment, id: number, idC: number) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) =>
              article.id === id
                ? {
                  ...article,
                  commentaire: article.commentaire.map((com) =>
                    com.id === idC
                      ? {
                        ...com,
                        reponse: [...(com.reponse ?? []), res],
                      }
                      : com
                  ),
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

      deleteReponse: (idC: number, idR: number) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) => ({
              ...article,
              commentaire: article.commentaire.map((com) =>
              ({
                ...com,
                reponse: com.reponse.filter((x) => x.id !== idR)
              })
              ),
            })),
          })),
        })),

      editReponse: (idC: number, idR: number, message: string) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) => ({
              ...article,
              commentaire: article.commentaire.map((com) =>
                com.id === idC
                  ? {
                    ...com,
                    reponse: com.reponse.map((rep) =>
                      rep.id === idR ?
                        {
                          ...rep,
                          message: message
                        } : rep
                    )
                  }
                  : com
              ),
            })),
          })),
        })),


      registerUser: (user) =>
        set((state) => ({
          dataUsers: [...state.dataUsers, user],
        })),
      editUser: (user) => set((state) => ({ dataUsers: state.dataUsers.map((el) => (el.id === user.id ? user : el)) })),
      deleteUser: (id) => set((state) => ({ dataUsers: state.dataUsers.filter((item) => item.id != id) })),
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
                  signals: article.signals.filter((u) => u.id !== user.id),
                }
                : article
            ),
          })),
        })),

      addSignals: (id: number, user: Omit<Users, "password">) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) =>
              article.id === id
                ? {
                  ...article,
                  signals: article.signals.some((u) => u.id === user.id)
                    ? article.signals.filter((u) => u.id !== user.id)
                    : [...article.signals, user],
                  like: article.like.filter((u) => u.id !== user.id),
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
