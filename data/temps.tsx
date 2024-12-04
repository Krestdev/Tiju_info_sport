export interface Article {
    id: number,
    type: string,
    titre: string,
    description: string,
    media?: string,
    ajouteLe: string
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


export const articles: Article[] = [
    {
        id: 1,
        type: "football feminin",
        titre: "Grande complicité entre le DTN de la federation zambienne de football et les footballeuses camerounaises au Hilton de Yaoundé",
        description: `Un air de camaraderie et de convivialité a régné récemment au Hilton de Yaoundé, où une rencontre inattendue a eu lieu entre le Directeur Technique National (DTN) de la Fédération Zambienne de Football et l'équipe nationale féminine de football du Cameroun...`,
        ajouteLe: "il y'a 2h"
    },
    {
        id: 2,
        type: "football masculin",
        titre: "Gigantesque complicité entre le DTN de la federation zambienne de football et les footballeuses camerounaises au Hilton de Yaoundé",
        description: `Un air de camaraderie et de convivialité a régné récemment au Hilton de Yaoundé, où une rencontre inattendue a eu lieu entre le Directeur Technique National (DTN) de la Fédération Zambienne de Football et l'équipe nationale féminine de football du Cameroun...`,
        media: "/images/lions.jpg",
        ajouteLe: "il y'a 2h"
    },
    {
        id: 3,
        type: "Fecafoot",
        titre: "La FECAFOOT annonce de nouvelles initiatives pour le développement du football au Cameroun",
        description: `La Fédération Camerounaise de Football (FECAFOOT) a lancé une série de nouvelles initiatives pour promouvoir le football au Cameroun, avec un focus particulier sur les programmes pour les jeunes joueurs et le développement des infrastructures...`,
        media: "/images/etoo.jpg",
        ajouteLe: "il y'a 1j"
    },
    {
        id: 4,
        type: "basketball",
        titre: "L’équipe nationale camerounaise de basketball se prépare pour les qualifications de la Coupe du Monde",
        description: `L'équipe nationale de basketball du Cameroun se prépare activement pour les prochaines qualifications de la Coupe du Monde, avec des sessions d'entraînement intensives et des matches amicaux pour se préparer aux défis à venir...`,
        media: "/images/basket.jpg",
        ajouteLe: "il y'a 1j"
    },
    {
        id: 5,
        type: "football feminin",
        titre: "Les nouvelles ambitions des équipes féminines en Afrique",
        description: `Les équipes féminines de football en Afrique connaissent une transformation radicale, avec des performances et une visibilité accrues, marquant un tournant majeur dans le développement du football féminin sur le continent...`,
        media: "/images/Hero.jpg",
        ajouteLe: "il y'a 3j"
    },
    {
        id: 6,
        type: "Handball",
        titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
        description: `L’équipe nationale camerounaise de handball a remporté le tournoi africain, prouvant ainsi leur maîtrise du sport et leur potentiel sur la scène continentale...`,
        media: "/images/hand.jpg",
        ajouteLe: "il y'a 4j"
    },
    {
        id: 7,
        type: "Handball",
        titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
        description: `L’équipe nationale camerounaise de handball a remporté le tournoi africain, prouvant ainsi leur maîtrise du sport et leur potentiel sur la scène continentale...`,
        media: "/images/handball1.jpeg",
        ajouteLe: "il y'a 4j"
    },
    {
        id: 8,
        type: "Handball",
        titre: "La victoire éclatante du Cameroun lors du tournoi africain de handball",
        description: `L’équipe nationale camerounaise de handball a remporté le tournoi africain, prouvant ainsi leur maîtrise du sport et leur potentiel sur la scène continentale...`,
        media: "/images/handball2.jpg",
        ajouteLe: "il y'a 4j"
    },
    {
        id: 9,
        type: "Fecafoot",
        titre: "Samuel Eto'o, élu président de la Fédération Camerounaise de Football (FECAFOOT) en décembre 2021",
        description: `Depuis son élection à la présidence de la FECAFOOT en décembre 2021, Samuel Eto'o s'est fixé pour ambition de transformer en profondeur le football camerounais. Il vise la professionnalisation des championnats locaux en améliorant les infrastructures, en augmentant les salaires des joueurs et en assurant une gestion financière transparente. Le développement du football de base est également au cœur de ses priorités, avec des programmes dédiés à la formation des jeunes talents et au soutien des académies.

Eto'o s'engage à moderniser les infrastructures sportives à travers la construction et la rénovation des stades, en collaboration avec le gouvernement et les sponsors. Le football féminin occupe une place importante dans ses projets, avec des initiatives visant à revaloriser les primes et à promouvoir la visibilité des joueuses.`,
        media: "/images/fecafoot.jpeg",
        ajouteLe: "il y'a 4j"
    },
    {
        id: 10,
        type: "Lion indomptable",
        titre: "FECAFOOT met en place un programme d'accompagnement pour les arbitres de football",
        description: `Dans le cadre de son engagement pour le développement du football, la Fédération Camerounaise de Football (FECAFOOT) a lancé un programme de formation et d'accompagnement destiné aux arbitres du pays...`,
        media: "/images/video.mp4",
        ajouteLe: "25/10/2024"
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
