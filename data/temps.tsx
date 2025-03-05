// Type de données

export interface Categories {
    id: number,
    nom: string,
    description: string,
    parent?: Categories
}

export interface Categorie {
    nom: string;
    donnees: Article[];
};

export interface Article {
    id: number,
    type: string,
    titre: string,
    extrait: string,
    description: string,
    media?: string[],
    ajouteLe: string,
    commentaire: comment[],
    like: Omit<Users, "password">[];
    user: Users,
    abonArticle: Abonnement,
    statut: string,
    auteur: Users | null 
};

export interface Pubs {
    id: number;
    nom: string;
    lien: string;
    image: string;
    date: string;
};

export interface Users {
    id: number,
    nom: string,
    email: string,
    pseudo: string,
    phone?: string,
    sexe?: string,
    ville?: string,
    pays?: string,
    photo?: string,
    password?: string,
    createdAt: string,
    role: string,
    abonnement?: Abonnement
};

export interface Abonnement {
    id: number,
    nom: string,
    cout: number,
    validite: number
    date: string
};

export interface comment {
    id: number
    user: Users | null,
    message: string,
    reponse: comment[]
    like: Omit<Users, "password">[];
    signals: Omit<Users, "password">[];
    date: string,
    delete: boolean
};


//Données temp

export const categories: Categories[] = [
    {
        nom: "Football",
        description: "",
        id: 0
    },
    {
        nom: "Handball",
        description: "",
        id: 1
    },
    {
        nom: "BasketBall",
        description: "",
        id: 2
    },
    {
        nom: "VolleyBall",
        description: "",
        id: 3
    },
    {
        nom: "Boxe",
        description: "",
        id: 4
    },
    {
        nom: "League 1",
        description: "",
        parent: {
            nom: "Football",
            description: "",
            id: 0
        },
        id: 5
    },
    {
        nom: "FecaHand",
        description: "",
        parent: {
            nom: "Handball",
            description: "",
            id: 1
        },
        id: 0
    },
    {
        nom: "MMA",
        description: "",
        parent: {
            nom: "Boxe",
            description: "",
            id: 4
        },
        id: 6
    },
]


export const articles: Categorie[] = [
    {
        nom: "Football",
        donnees: [
            {
                id: 1,
                type: "football feminin",
                titre: "Grande complicité entre le DTN de la federation zambienne de football et les footballeuses camerounaises au Hilton de Yaoundé",
                description: "Un air de camaraderie et de convivialité a régné récemment...",
                media: ["/images/feminin1.jpg", "/images/feminin.jpeg"],
                ajouteLe: "27/01/2025",
                commentaire: [
                    {
                        id: 96,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [
                    {
                        id: 0,
                        nom: "Etarcos",
                        email: "etarcos@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    },
                    {
                        id: 1,
                        nom: "socrate",
                        email: "socrate@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    }
                ],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "publie",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            },
            {
                id: 2,
                type: "football masculin",
                titre: "Gigantesque complicité entre le DTN de la federation zambienne de football et les footballeuses camerounaises au Hilton de Yaoundé",
                description: "Un air de camaraderie et de convivialité a régné récemment...",
                media: ["/images/video.mp4", "/images/lions.jpg", "/images/lion1.jpeg"],
                ajouteLe: "27/12/2024",
                commentaire: [
                    {
                        id: 60,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "publie",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            },
            {
                id: 5,
                type: "football feminin",
                titre: "Les nouvelles ambitions des équipes féminines en Afrique",
                description: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos recusandae modi atque optio eligendi commodi deleniti quae, natus quam sit possimus, aliquam totam. Aspernatur porro error temporibus nostrum, velit ipsa magni odio earum deleniti facere sint a voluptates dolorem repellat modi hic veniam nulla officiis incidunt, reprehenderit atque repudiandae? Ullam aut odit vitae quo voluptates repudiandae aliquam quod consequatur beatae ad. Tempore facere ullam nisi sint, debitis pariatur doloribus aliquam aspernatur sit beatae tenetur deserunt, illum libero earum temporibus porro corporis, cumque exercitationem cum ut! Ipsam ducimus et expedita repudiandae consequatur nam quos, quae velit aperiam, asperiores sint nisi corporis.",
                media: ["/images/feminin1.jpg", "/images/feminin.jpeg", "/images/feminin1.jpg", "/images/feminin.jpeg", "/images/feminin1.jpg", "/images/feminin.jpeg", "/images/feminin1.jpg", "/images/feminin.jpeg",],
                ajouteLe: "27/10/2024",
                commentaire: [
                    {
                        id: 0,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [
                            {
                                id: 20,
                                message: "Vive le foot africain",
                                user: {
                                    id: 20,
                                    nom: "Etarcos Dev",
                                    email: "etarcos@tyju.com",
                                    phone: "654455455",
                                    password: "",
                                    createdAt: "",
                                    role: "",
                                    abonnement: {
                                        id: 4,
                                        nom: "Bouquet normal",
                                        cout: 0,
                                        validite: 12,
                                        date: "28/01/2025"
                                    },
                                    photo: "/images/profil.jpg",
                                    pseudo: "",
                                    sexe: "",
                                    ville: "",
                                    pays: ""
                                },
                                reponse: [],
                                like: [],
                                signals: [],
                                date: "12-01-2024",
                                delete: true
                            },
                        ],
                        like: [],
                        signals: [],
                        date: "12-01-2024",
                        delete: false
                    },
                    {
                        id: 1,
                        message: "Vive le foot africain",
                        user: {
                            id: 3,
                            nom: "Etarcos Dev",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "12-01-2024",
                        delete: false
                    },
                    {
                        id: 2,
                        message: "Courage aux filles",
                        user: {
                            id: 2,
                            nom: "Etarcos Dev Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "12-01-2024",
                        delete: true
                    },
                ],
                like: [],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 0,
                    nom: "Bouquet Or",
                    cout: 20000,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "publie",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            }
        ]
    },
    {
        nom: "Hockey",
        donnees: [
            {
                id: 3,
                type: "Hockey",
                titre: "La FECAFOOT annonce de nouvelles initiatives pour le développement du football au Cameroun",
                description: "La Fédération Camerounaise de Football (FECAFOOT) a lancé une série de nouvelles initiatives...",
                media: ["/images/Hockey1.jpeg", "/images/Hockey2.jpeg"],
                ajouteLe: "28/10/2024",
                commentaire: [
                    {
                        id: 68,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 86,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    },
                    {
                        id: 69,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 85,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [
                    {
                        id: 9,
                        nom: "Etarcos",
                        email: "etarcos@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    },
                    {
                        id: 19,
                        nom: "socrate",
                        email: "socrate@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    }
                ],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "publie",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            },
            {
                id: 9,
                type: "Hockey",
                titre: "Samuel Eto'o, élu président de la Fédération Camerounaise de Football (FECAFOOT) en décembre 2021",
                description: "Depuis son élection à la présidence de la FECAFOOT en décembre 2021...",
                media: ["/images/Hockey1.jpeg", "/images/Hockey1.jpeg"],
                ajouteLe: "28/10/2024",
                commentaire: [
                    {
                        id: 64,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [
                    {
                        id: 0,
                        nom: "Etarcos",
                        email: "etarcos@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    },
                    {
                        id: 1,
                        nom: "socrate",
                        email: "socrate@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    }
                ],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "brouillon",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            }
        ]
    },

    {
        nom: "Boxe",
        donnees: [
            {
                id: 21,
                type: "MMA",
                titre: "La FECAFOOT annonce de nouvelles initiatives pour le développement du football au Cameroun",
                description: "La Fédération Camerounaise de Football (FECAFOOT) a lancé une série de nouvelles initiatives...",
                media: ["/images/Boxe1.jpeg"],
                ajouteLe: "28/10/2024",
                commentaire: [
                    {
                        id: 68,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    },
                    {
                        id: 69,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [
                    {
                        id: 0,
                        nom: "Etarcos",
                        email: "etarcos@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    },
                    {
                        id: 1,
                        nom: "socrate",
                        email: "socrate@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    }
                ],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "brouillon",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            },
            {
                id: 22,
                type: "Fecafoot",
                titre: "Samuel Eto'o, élu président de la Fédération Camerounaise de Football (FECAFOOT) en décembre 2021",
                description: "Depuis son élection à la présidence de la FECAFOOT en décembre 2021...",
                media: ["/images/fecafoot.jpeg"],
                ajouteLe: "28/10/2024",
                commentaire: [
                    {
                        id: 64,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [
                    {
                        id: 0,
                        nom: "Etarcos",
                        email: "etarcos@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    },
                    {
                        id: 1,
                        nom: "socrate",
                        email: "socrate@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    }
                ],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "publie",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            }
        ]
    },
    {
        nom: "Basketball",
        donnees: [
            {
                id: 4,
                type: "basketball",
                titre: "L’équipe nationale camerounaise de basketball se prépare pour les qualifications de la Coupe du Monde",
                description: "L'équipe nationale de basketball du Cameroun se prépare activement...",
                media: ["/images/basket.jpg"],
                ajouteLe: "28/01/2025",
                commentaire: [
                    {
                        id: 46,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "publie",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            }
        ]
    },
    {
        nom: "Handball",
        donnees: [
            {
                id: 6,
                type: "Handball",
                titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
                description: "L’équipe nationale camerounaise de handball a remporté le tournoi africain...",
                media: ["/images/hand.jpg"],
                ajouteLe: "28/01/2025",
                commentaire: [
                    {
                        id: 42,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [
                    {
                        id: 0,
                        nom: "Etarcos",
                        email: "etarcos@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    },
                    {
                        id: 1,
                        nom: "socrate",
                        email: "socrate@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    }
                ],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "brouillon",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            },
            {
                id: 7,
                type: "Handball",
                titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
                description: "L’équipe nationale camerounaise de handball a remporté le tournoi africain...",
                media: ["/images/handball1.jpeg"],
                ajouteLe: "28/11/2024",
                commentaire: [
                    {
                        id: 38,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [
                    {
                        id: 0,
                        nom: "Etarcos",
                        email: "etarcos@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    },
                    {
                        id: 1,
                        nom: "socrate",
                        email: "socrate@gmail.com",
                        phone: "654477445",
                        createdAt: "",
                        role: "",
                        abonnement: {
                            id: 4,
                            nom: "Bouquet normal",
                            cout: 0,
                            validite: 12,
                            date: "28/01/2025"
                        },
                        photo: "/images/profil.jpg",
                        pseudo: "",
                        sexe: "",
                        ville: "",
                        pays: ""
                    }
                ],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "corbeille",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            },
            {
                id: 8,
                type: "Handball",
                titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
                description: "L’équipe nationale camerounaise de handball a remporté le tournoi africain...",
                media: ["/images/handball2.jpg"],
                ajouteLe: "28/09/2024",
                commentaire: [
                    {
                        id: 25,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [{
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                {
                    id: 1,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                }],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "corbeille",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            }
        ]
    },
    {
        nom: "Volleyball",
        donnees: [
            {
                id: 10,
                type: "Lion indomptable",
                titre: "FECAFOOT met en place un programme d'accompagnement pour les arbitres de football",
                description: "Dans le cadre de son engagement pour le développement du football...",
                media: ["/images/Volley.jpeg"],
                ajouteLe: "25/11/2024",
                commentaire: [
                    {
                        id: 54,
                        message: "J'aime bien comment il s'entensent",
                        user: {
                            id: 0,
                            nom: "Etarcos Tech",
                            email: "etarcos@tyju.com",
                            phone: "654455455",
                            password: "",
                            createdAt: "",
                            role: "",
                            abonnement: {
                                id: 4,
                                nom: "Bouquet normal",
                                cout: 0,
                                validite: 12,
                                date: "28/01/2025"
                            },
                            photo: "/images/profil.jpg",
                            pseudo: "",
                            sexe: "",
                            ville: "",
                            pays: ""
                        },
                        reponse: [],
                        like: [],
                        signals: [],
                        date: "",
                        delete: false
                    }
                ],
                like: [{
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                {
                    id: 1,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                }],
                user: {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445",
                    createdAt: "",
                    role: "",
                    abonnement: {
                        id: 4,
                        nom: "Bouquet normal",
                        cout: 0,
                        validite: 12,
                        date: "28/01/2025"
                    },
                    photo: "/images/profil.jpg",
                    pseudo: "",
                    sexe: "",
                    ville: "",
                    pays: ""
                },
                extrait: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, nobis nostrum. Quam, cupiditate corrupti eaque sed pariatur facere aliquam repellendus culpa. Assumenda numquam doloribus laudantium sunt fugit nihil, voluptas quas.",
                abonArticle: {
                    id: 4,
                    nom: "Bouquet normal",
                    cout: 0,
                    validite: 12,
                    date: "28/01/2025"
                },
                statut: "corbeille",
                auteur: {
                    id: 0,
                    nom: "Admin",
                    email: "admin@tyju.com",
                    pseudo: "admin",
                    createdAt: "2021/12/02",
                    role: "admin"
                }
            }
        ]
    }
];

export const publicites: Pubs[] = [
    {
        id: 1,
        lien: "https://google.com",
        image: "/images/pub1.jpeg",
        date: "2024-12-12",
        nom: "Orange CM",
    },
    {
        id: 2,
        lien: "https://google.com",
        image: "/images/pub.jpg",
        date: "2025-01-12",
        nom: "Boutique Socrate",
    },
];

export const users: Users[] = [
    {
        id: 1,
        nom: "Etarcos Tech",
        email: "etarcos@gmail.com",
        phone: "654455225",
        password: "Etarcos123",
        createdAt: "2024-12-31",
        role: "admin",
        abonnement: {
            id: 0,
            nom: "Bouquet Or",
            cout: 20000,
            validite: 12,
            date: "28/01/2025"
        },
        photo: "",
        pseudo: "Etarcos",
        sexe: "Homme",
        ville: "Yaoundé",
        pays: "Cameroun"
    },
    {
        id: 2,
        nom: "Dev Tech",
        email: "devTech@gmail.com",
        phone: "656633225",
        password: "DevTech123",
        createdAt: "2024-12-31",
        role: "user",
        abonnement: {
            id: 4,
            nom: "Bouquet normal",
            cout: 0,
            validite: 12,
            date: "28/01/2025"
        },
        photo: "",
        pseudo: "DevTech",
        sexe: "Femme",
        ville: "Douala",
        pays: "Cameroun"
    },
];

export const abonnement: Abonnement[] = [
    {
        id: 0,
        nom: "Bouquet Or",
        cout: 20000,
        validite: 12,
        date: "28/01/2025"
    },
    {
        id: 1,
        nom: "Bouquet Diamant",
        cout: 10000,
        validite: 12,
        date: "28/01/2025"
    },
    {
        id: 2,
        nom: "Bouquet Argent",
        cout: 5000,
        validite: 12,
        date: "28/01/2025"
    },
    {
        id: 3,
        nom: "Bouquet Bronze",
        cout: 2500,
        validite: 12,
        date: "28/01/2025"
    },
    {
        id: 4,
        nom: "Bouquet normal",
        cout: 0,
        validite: 12,
        date: "28/01/2025"
    }
];