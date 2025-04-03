import {
  abonnement,
  Abonnement,
  articles,
  Categorie,
  categories,
  Categories,
  comment,
  publicites,
  Pubs,
  users,
  Users
} from "@/data/temps";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface store {
  settings: any;
  dataCategorie: Categories[]
  dataArticles: Categorie[];
  dataPubs: Pubs[];
  dataUsers: Users[];
  dataSubscription: Abonnement[]
  currentUser: any | null;
  currentAdmin: any | null;
  isFull: boolean | undefined
  favorite: Category[] | null
  search: Article[]
  token: string | null;
}

interface actions {

  editSettings: (newSettings: Partial<typeof initialData.settings>) => void;

  setIsFull: (prev: boolean) => void;
  setSearch: (art: Article[] | undefined) => void
  setFavorite: (cate: Category[] | undefined) => void;

  setCurrentUser: (user: any) => void;

  addCategorie: (categorie: Categories, parentId?: number) => void,
  editCategorie: (id: number, updatedCategory: Partial<Categories>, parentId?: number) => void,
  deleteCategorie: (id: number) => void;

  addCategory: (category: Categorie) => void;
  // addArticle: (article: Article) => void;
  editArticle: (article: Article) => void;
  deleteArticle: (id: number) => void;

  registerUser: (user: Users) => void;
  deleteUser: (id: number) => void;
  editUser: (user: any) => void;
  login: (email: string, password: string) => Users | null;
  logout: () => void;
  loginAdmin: (email: string, password: string) => Users | null;
  logoutAdmin: () => void;

  addLike: (id: number, nom: Omit<Users, "password">) => void;
  addSignals: (commentId: number, user: Omit<Users, "password">) => void;
  likeComment: (commentId: number, user: Omit<Users, "password">) => void;
  addComment: (com: comment, idA: number) => void;
  deleteComment: (id: number) => void;
  editComment: (id: number, message: string) => void;

  addResponse: (res: comment, id: number, idC: number) => void;
  editReponse: (idC: number, idR: number, message: string) => void;
  deleteReponse: (idC: number, idR: number) => void;
  addResponseLike: (idC: number, idR: number, user: Omit<Users, "password">) => void;
  addResponseSignals: (idC: number, idR: number, user: Omit<Users, "password">) => void;

  addPub: (pub: Pubs) => void
  editPub: (pub: any) => void
  deletePub: (id: number) => void;
  setClick: (pub: Pubs) => void;

  addSubscription: (subscription: Abonnement) => void
  editSubscription: (subscription: any) => void
  deleteSubscription: (id: number) => void;
}

const initialData: store = {
  settings: {
    compagnyName: "Tyju Info Sports",
    logo: "/logo.png",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    x: "",
    pub: "Tyju Publicité",
    noPhoto: "/images/no-user.jpg",
    noImage: "/images/no-image.jpg",
    description: "Tyju Info sport est un journal sportif"
  },



  //données initiales
  dataArticles: articles,
  favorite: null,
  dataPubs: publicites,
  dataUsers: users,
  dataSubscription: abonnement,
  currentUser: null,
  currentAdmin: null,
  isFull: true,
  search: [],
  dataCategorie: categories,
  token: null
};

const useStore = create<store & actions>()(
  persist(
    (set, get) => ({
      ...initialData,

      editSettings: (newSettings: Partial<typeof initialData.settings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },


      setSearch: (art: Article[] | undefined) =>
        set((state) => ({
          ...state,
          search: art || state.search
        })),

      setFavorite: (cate: Category[] | undefined) =>
        set((state) => ({
          ...state,
          favorite: cate || state.favorite,
        })),

        setIsFull: (open) => set({ isFull: open }),

      addCategorie: (category: Categories, parentId?: number) =>
        set((state) => ({
          dataCategorie: [
            ...state.dataCategorie,
            { ...category, parent: parentId ? state.dataCategorie.find(cat => cat.id === parentId) || undefined : undefined }
          ]
        })),

      editCategorie: (id: number, updatedCategory: Partial<Categories>, parentId?: number) =>
        set((state) => ({
          dataCategorie: state.dataCategorie.map(cat =>
            cat.id === id
              ? {
                ...cat,
                ...updatedCategory,
                parent: parentId ? state.dataCategorie.find(c => c.id === parentId) || undefined : undefined
              }
              : cat
          )
        })),

      deleteCategorie: (id: number) =>
        set((state) => ({
          dataCategorie: state.dataCategorie
            .filter((cat) => cat.id !== id)
            .map((cat) =>
              cat.parent?.id === id ? { ...cat, parent: undefined } : cat
            ),
        })),


      addCategory: (category: Categorie) =>
        set((state) => {
          const existingCategory = state.dataArticles.find(
            (cat: Categorie) => cat.nom.toLowerCase() === category.nom.toLowerCase()
          );
          if (existingCategory) {
            return {
              dataArticles: state.dataArticles.map((cat: Categorie) =>
                cat.nom.toLowerCase() === category.nom.toLowerCase()
                  ? {
                    ...cat,
                    donnees: [...cat.donnees, ...category.donnees],
                  }
                  : cat
              ),
            };
          } else {
            return {
              dataArticles: [...state.dataArticles, category],
            };
          }
        }),

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

      deleteArticle: (id: number) =>
        set((state) => ({
          dataArticles: state.dataArticles.flatMap((article) =>
          ({
            ...article,
            donnees: article.donnees.filter((art) => art.id !== id)
          })),
        })),
      // addArticle: (article: Article) =>
      //   set((state) => ({
      //     dataArticles: state.dataArticles.map((categorie) =>
      //       categorie.nom === article.type
      //         ? { ...categorie, donnees: [...categorie.donnees, article] }
      //         : categorie
      //     ),
      //   })),
      editArticle: (article: Article) =>
        set((state) => ({
          dataArticles: state.dataArticles.map((categorie) => ({
            ...categorie,
            donnees: categorie.donnees.map((el) =>
              el.id === article.id ? { ...el, ...article } : el
            ),
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

      editUser: (user) =>
        set((state) => ({
          dataUsers: state.dataUsers.map((el) => (el.id === user.id ? user : el))
        })),

      deleteUser: (id) =>
        set((state) => ({
          dataUsers: state.dataUsers.filter((item) => item.id != id)
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

      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, currentUser: null });
      },

      user: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      loginAdmin: (email, password) => {
        const foundUser = get().dataUsers.find(
          (user) => user.email === email && user.password === password && user.role === "admin"
        );
        if (foundUser) {
          set({ currentAdmin: foundUser });
        }
        return foundUser || null;
      },
      logoutAdmin: () => set({ currentUser: null }),

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

      addPub: (pub) =>
        set((state) => ({
          dataPubs: [...state.dataPubs, pub],
        })),

      editPub: (pub) =>
        set((state) => ({
          dataPubs: state.dataPubs.map((el) => (el.id === pub.id ? pub : el))
        })),

      setClick: (updatedPub) =>
        set((state) => ({
          dataPubs: state.dataPubs.map((el) =>
            el.id === updatedPub.id
              ? { ...el, nbClick: (el.nbClick || 0) + 1 }
              : el
          ),
        })),


      deletePub: (id) =>
        set((state) => ({
          dataPubs: state.dataPubs.filter((item) => item.id != id)
        })),

      addSubscription: (subscription) =>
        set((state) => ({
          dataSubscription: [...state.dataSubscription, subscription]
        })),

      editSubscription: (subscription) =>
        set((state) => ({
          dataSubscription: state.dataSubscription.map((el) => (el.id === subscription.id ? subscription : el))
        })),

      deleteSubscription: (id) =>
        set((state) => ({
          dataSubscription: state.dataSubscription.filter((item) => item.id != id)
        })),
    }),
    { name: "Tyju" }
  )
);

export default useStore;
