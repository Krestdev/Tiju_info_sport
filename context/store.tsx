import { create } from "zustand";
import { persist } from "zustand/middleware";


interface store {
  settings: any;
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
  logout: () => void;
  logoutAdmin: () => void;
}

const initialData: store = {
  settings: {
    compagnyName: "Tyjuinfosports",
    logo: "/logo.png",
    email: "",
    phone: "",
    whatsapp: "",
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
  favorite: null,
  currentUser: null,
  currentAdmin: null,
  isFull: true,
  search: [],
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

      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, currentUser: null });
      },

      user: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logoutAdmin: () => set({ currentUser: null }),
    }),
    { name: "Tyju" }
  )
);

export default useStore;
