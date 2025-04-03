// Type pour un utilisateur
type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    sex: string;
    town: string;
    country: string;
    role: string;
    liked: number;
    signals: number;
    created_at: string;
    updated_at: string;
    photo?: string
};

// Type pour un utilisateur avec API Key
type UserWithApiKey = {
    user: User;
    apiKey: string;
};

// Type pour l'inscription d'un utilisateur
type UserRegistration = {
    name: string;
    nick_name: string;
    email: string;
    phone: string;
    sex: string;
    town: string;
    country: string;
    photo: string;
    password: string;
    role: string;
};

// Type pour l'authentification d'un utilisateur
type UserLogin = {
    email: string;
    password: string;
};

// Type pour un auteur (même structure que User)
type Author = User;

// Type pour une catégorie
type Category = {
    id: number;
    title: string;
    author: Author;
    description: string;
    image: string;
    articles: Article[]; // Liste d'articles liés à la catégorie
    created_at: string;
    updated_at: string;
};

// Type pour une annonce publicitaire
type Advertisement = {
    id: number;
    author: Author;
    title: string;
    description: string;
    url: string;
    image: ImageA;
    createdAt: string;
    updatedAt: string;
};

// Type pour la création d'une annonce
type AdvertisementCreation = {
    user_id: number;
    title: string;
    description: string;
    image: string;
    url: string;
};

// Type pour un commentaire
type Comments = {
    id: number;
    author: User;
    article_id: number;
    message: string;
    likes: number;
    response: Comments[]; 
    signals: number;
    created_at: string;
    updated_at: string;
  };

// Type pour la création d'un article
type ArticleCreation = {
    user_id: number;
    category_id: number;
    title: string;
    summery: string;
    description: string;
    type: string;
};

// Type pour un article existant
type Article = {
    id: number;
    type: string;
    title: string;
    summery: string;
    description: string;
    images: ImageA[]; 
    author: User;
    comments: Comments[]; 
    likes: number;
    created_at: string;
    updated_at: string;
};

type ImageA = {
    id: number,
    size: number,
    created_at: string;
    updated_at: string;
}

// Type pour la mise à jour d'un article (optionnel)
type ArticleUpdate = Partial<ArticleCreation>;

// Type pour un message utilisateur
type UserMessage = {
    user_id: number;
    message: string;
};

type ImageUser = {
    user_id: number;
    file: File[]
}
