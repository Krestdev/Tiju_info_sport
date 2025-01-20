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
  user: Users
  abonArticle: string
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
  currentAdmin: Users | null;
  isFull: boolean | undefined
  favorite: Categorie[]
  search: Article[]
}

interface actions {
  addArticle: (article: Categorie) => void;
  registerUser: (user: Users) => void;
  login: (email: string, password: string) => Users | null;
  logout: () => void;
  loginAdmin: (email: string, password: string) => Users | null;
  logoutAdmin: () => void;
  addLike: (id: number, nom: Omit<Users, "password">) => void;
  addSignals: (commentId: number, user: Omit<Users, "password">) => void;
  likeComment: (commentId: number, user: Omit<Users, "password">) => void;
  addComment: (com: comment, idA: number) => void;
  addResponse: (res: comment, id: number, idC: number) => void;
  deleteComment: (id: number) => void;
  deleteReponse: (idC: number, idR: number) => void;
  deleteUser: (id: number) => void;
  editUser: (user: any) => void;
  editComment: (id: number, message: string) => void;
  editReponse: (idC: number, idR: number, message: string) => void;
  setIsFull: () => void;
  setFavorite: (cate: Categorie[] | undefined) => void;
  addResponseLike: (idC: number, idR: number, user: Omit<Users, "password">) => void;
  addResponseSignals: (idC: number, idR: number, user: Omit<Users, "password">) => void;
  setSearch: (art: Article[] | undefined) => void
}

const initialData: store = {
  settings: {
    compagnyName: "Tyju Info Sport",
    logo: "/logo.png",
    email: "",
    phone: "",
    address: "",
    pub: "Tyju Publicité",
    noPhoto: "/images/no-user.jpg"
  },
  dataArticles: articles,
  dataPubs: publicites,
  dataUsers: users,
  currentUser: null,
  currentAdmin: null,
  isFull: true,
  favorite: articles,
  search: []
};

const useStore = create<store & actions>()(
  persist(
    (set, get) => ({
      ...initialData,

      setSearch: (art: Article[] | undefined) =>
        set((state) => ({
          ...state,
          search: art || state.search
        })),

      setFavorite: (cate: Categorie[] | undefined) =>
        set((state) => ({
          ...state,
          favorite: cate || state.favorite,
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

      deleteReponse: (_idC: number, idR: number) =>
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
      loginAdmin: (email, password) => {
        const foundUser = get().dataUsers.find(
          (user) => user.email === email && user.password === password && user.role === "admin"
        );
        if (foundUser) {
          set({ currentAdmin: foundUser });
        }
        return foundUser || null;
      },
      logoutAdmin: () => set({ currentAdmin: null }),
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

      addSignals: (commentId: number, user: Omit<Users, "password">) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) => ({
              ...article,
              commentaire: article.commentaire.map(function updateSignals(comment): comment {
                if (comment.id === commentId) {
                  const alreadySignaled = comment.signals.some((u) => u.id === user.id);
                  return {
                    ...comment,
                    signals: alreadySignaled
                      ? comment.signals.filter((u) => u.id !== user.id)
                      : [...comment.signals, user],
                    like: comment.like.filter((u) => u.id !== user.id),
                  };
                }
                return {
                  ...comment,
                  reponse: comment.reponse.map(updateSignals),
                };
              }),
            })),
          })),
        })),

      addResponseLike: (idC: number, idR: number, user: Omit<Users, "password">) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) => ({
              ...article,
              commentaire: article.commentaire.map((comment) =>
                comment.id === idC
                  ? {
                    ...comment,
                    reponse: comment.reponse.map((response) =>
                      response.id === idR
                        ? {
                          ...response,
                          like: response.like.some((u) => u.id === user.id)
                            ? response.like.filter((u) => u.id !== user.id)
                            : [...response.like, user],
                          signals: response.signals.filter((u) => u.id !== user.id),
                        }
                        : response
                    ),
                  }
                  : comment
              ),
            })),
          })),
        })),


      addResponseSignals: (idC: number, idR: number, user: Omit<Users, "password">) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) => ({
              ...article,
              commentaire: article.commentaire.map(function updateSignals(comment): comment {
                if (comment.id === idC) {
                  return {
                    ...comment,
                    reponse: comment.reponse.map((response) =>
                      response.id === idR
                        ? {
                          ...response,
                          signals: response.signals.some((u) => u.id === user.id)
                            ? response.signals.filter((u) => u.id !== user.id)
                            : [...response.signals, user],
                          like: response.like.filter((u) => u.id !== user.id),
                        }
                        : response
                    ),
                  };
                }
                return comment;
              }),
            })),
          })),
        })),

      likeComment: (commentId: number, user: Omit<Users, "password">) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((article) => ({
              ...article,
              commentaire: article.commentaire.map(function updateLike(comment): comment {
                if (comment.id === commentId) {
                  const alreadyLiked = comment.like.some((u) => u.id === user.id);
                  return {
                    ...comment,
                    like: alreadyLiked
                      ? comment.like.filter((u) => u.id !== user.id)
                      : [...comment.like, user],
                    signals: comment.signals.filter((u) => u.id !== user.id),
                  };
                }

                return {
                  ...comment,
                  reponse: comment.reponse.map(updateLike),
                };
              }),
            })),
          })),
        })),
    }),
    { name: "Tyju" }
  )
);

export default useStore;
