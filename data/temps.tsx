export interface comment {
    id: number
    user: Users | null,
    message: string,
    reponse: comment | undefined
}

export interface Article {
    id: number,
    type: string,
    titre: string,
    description: string,
    media?: string,
    ajouteLe: string,
    commentaire: comment [],
    like: Omit<Users, "password">[];
}
export interface Categorie {
    nom: string; 
    donnees: Article[]; 
}

export interface Pubs {
    id: number,
    lien: string,
    description?: string,
    prix?: number,
    image: string
}

export interface Users {
    id: number,
    nom: string,
    email: string,
    phone: string,
    password: string
}


export const articles: Categorie[] = [
    {
      nom: "Football",
      donnees: [
        {
            id: 1,
            type: "football feminin",
            titre: "Grande complicité entre le DTN de la federation zambienne de football et les footballeuses camerounaises au Hilton de Yaoundé",
            description: "Un air de camaraderie et de convivialité a régné récemment...",
            ajouteLe: "il y'a 2h",
            commentaire: [],
            like: [
                {
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445"
                },
                {
                    id: 1,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445"
                }
            ]
        },
        {
            id: 2,
            type: "football masculin",
            titre: "Gigantesque complicité entre le DTN de la federation zambienne de football et les footballeuses camerounaises au Hilton de Yaoundé",
            description: "Un air de camaraderie et de convivialité a régné récemment...",
            media: "/images/lions.jpg",
            ajouteLe: "il y'a 2h",
            commentaire: [],
            like: []
        },
        {
            id: 5,
            type: "football feminin",
            titre: "Les nouvelles ambitions des équipes féminines en Afrique",
            description: "Les équipes féminines de football en Afrique connaissent une transformation...",
            media: "/images/Hero.jpg",
            ajouteLe: "il y'a 3j",
            commentaire: [
                {
                    id: 0,
                    message: "J'aime bien comment il s'entensent",
                    user: {
                        id: 0,
                        nom: "Etarcos Tech",
                        email: "etarcos@tyju.com",
                        phone: "654455455",
                        password: ""
                    },
                    reponse: undefined
                },
                {
                    id: 1,

                    message: "Vive le foot africain",
                    user: {
                        id: 3,
                        nom: "Etarcos Dev",
                        email: "etarcos@tyju.com",
                        phone: "654455455",
                        password: ""
                    },
                    reponse: undefined
                },
                {
                    id: 2,

                    message: "Courage aux filles",
                    user: {
                        id: 2,
                        nom: "Etarcos Dev Tech",
                        email: "etarcos@tyju.com",
                        phone: "654455455",
                        password: ""
                    },
                    reponse: undefined
                },
            ],
            like: []
        }
      ]
    },
    {
      nom: "Fecafoot",
      donnees: [
        {
            id: 3,
            type: "Fecafoot",
            titre: "La FECAFOOT annonce de nouvelles initiatives pour le développement du football au Cameroun",
            description: "La Fédération Camerounaise de Football (FECAFOOT) a lancé une série de nouvelles initiatives...",
            media: "/images/etoo.jpg",
            ajouteLe: "il y'a 1j",
            commentaire: [],
            like: [
                {
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445"
                },
                {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445"
                }
            ]
        },
        {
            id: 9,
            type: "Fecafoot",
            titre: "Samuel Eto'o, élu président de la Fédération Camerounaise de Football (FECAFOOT) en décembre 2021",
            description: "Depuis son élection à la présidence de la FECAFOOT en décembre 2021...",
            media: "/images/fecafoot.jpeg",
            ajouteLe: "il y'a 4j",
            commentaire: [],
            like: [
                {
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445"
                },
                {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445"
                }
            ]
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
            media: "/images/basket.jpg",
            ajouteLe: "il y'a 1j",
            commentaire: [],
            like: []
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
            media: "/images/hand.jpg",
            ajouteLe: "il y'a 4j",
            commentaire: [],
            like: [
                {
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445"
                },
                {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445"
                }
            ]
        },
        {
            id: 7,
            type: "Handball",
            titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
            description: "L’équipe nationale camerounaise de handball a remporté le tournoi africain...",
            media: "/images/handball1.jpeg",
            ajouteLe: "il y'a 4j",
            commentaire: [],
            like: [
                {
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445"
                },
                {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445"
                }
            ]
        },
        {
            id: 8,
            type: "Handball",
            titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
            description: "L’équipe nationale camerounaise de handball a remporté le tournoi africain...",
            media: "/images/handball2.jpg",
            ajouteLe: "il y'a 4j",
            commentaire: [],
            like: [{
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445"
                },
                {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445"
                }]
        }
      ]
    },
    {
      nom: "Lion indomptable",
      donnees: [
        {
            id: 10,
            type: "Lion indomptable",
            titre: "FECAFOOT met en place un programme d'accompagnement pour les arbitres de football",
            description: "Dans le cadre de son engagement pour le développement du football...",
            media: "/images/video.mp4",
            ajouteLe: "25/10/2024",
            commentaire: [],
            like: [{
                    id: 0,
                    nom: "Etarcos",
                    email: "etarcos@gmail.com",
                    phone: "654477445"
                },
                {
                    id: 0,
                    nom: "socrate",
                    email: "socrate@gmail.com",
                    phone: "654477445"
                }]
        }
      ]
    }
  ];
  
  


export const publicites: Pubs[] = [
    {
        id: 1,
        lien: "https://google.com",
        description: "Suivez le meilleur de l’actualité en vous abonnant dès maintenant à partir de ",
        prix: 1000,
        image: "/images/pub1.jpeg"
    },
    {
        id: 2,
        lien: "",
        image: "/images/pub.jpg"
    },
]

export const users: Users[] = [
    {
        id: 1,
        nom: "Etarcos Tech",
        email: "etarcos@gmail.com",
        phone: "654455225",
        password: "Etarcos123"
    },
    {
        id: 2,
        nom: "Dev Tech",
        email: "devTech@gmail.com",
        phone: "656633225",
        password: "DevTech123"
    },
]
