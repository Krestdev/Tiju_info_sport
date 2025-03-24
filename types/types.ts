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
    image: string | null;
    created_at: string;
    updated_at: string;
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
    user: User;
    content: string;
    created_at: string;
};

// Type pour la création d'un article
type ArticleCreation = {
    user_id: number;
    category_id: number;
    title: string;
    summary: string;
    description: string;
    type: string;
};

// Type pour un article existant
type Article = {
    id: number;
    type: string;
    title: string;
    summary: string;
    description: string;
    images: { url: string; alt?: string }[]; // Liste d'images
    author: User;
    comments: Comment[]; // Liste des commentaires
    likes: number;
    created_at: string;
    updated_at: string;
};

// Type pour la mise à jour d'un article (optionnel)
type ArticleUpdate = Partial<ArticleCreation>;

// Type pour un message utilisateur
type UserMessage = {
    user_id: number;
    message: string;
};
