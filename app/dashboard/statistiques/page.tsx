"use client";

import withAdminAuth from "@/lib/whithAdminAuth";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useStore from "@/context/store";
import GridDash from "@/components/Dashboard/Dash/GridDash";
import { useQuery } from "@tanstack/react-query";
import Compo from "@/components/Dashboard/Dash/Compo";
import SemiCirc from "@/components/Dashboard/Dash/SemiCirc";
import { CircChar } from "@/components/Dashboard/Dash/CircChar";
import LineChar from "@/components/Dashboard/Stats/LineChart";
import BarChar from "@/components/Dashboard/Stats/BarChart";
import MostPopular from "@/components/Dashboard/Stats/MostPopular";
import { DateRange } from "react-day-picker";
import axiosConfig from "@/api/api";
import { AxiosResponse } from "axios";

const DashbordPage = () => {
    const { logoutAdmin } = useStore()
    const pathname = usePathname();
    const [art, setArt] = useState<Article[]>()
    const [comment, setComment] = useState<number>()
    const [likes, setLikes] = useState<number>(0)
    const [dateRanges, setDateRanges] = useState<{ [key: string]: DateRange | undefined }>({
        publication: undefined,
        vuesSite: undefined,
        vuesPeriode: undefined,
        vuesCategorie: undefined,
    });

    const axiosClient = axiosConfig();

    const handleChange = (key: string, newValue: string) => {
        setValues((prev) => ({ ...prev, [key]: newValue }));
    };

    const articleData = useQuery({
        queryKey: ["categoryv"],
        queryFn: () => {
            return axiosClient.get<any, AxiosResponse<Category[]>>(
                `/category`
            );
        },
    });



    const countTotalLikes = (articles: Article[]): number => {
        return articles.reduce((totalLikes, article) => {
            return totalLikes + article.likes;
        }, 0);
    };

    useEffect(() => {
        if (articleData.isSuccess) {
            setArt(articleData.data.data.flatMap(x => x.articles))
        }
    }, [articleData.data])

    useEffect(() => {
        if (art) {
            setComment((art || []).reduce((total, article) => total + article.comments.length, 0))
            setLikes(countTotalLikes(art))
        }
    }, [art])


    useEffect(() => {
        const handleRouteChange = () => {
            if (!window.location.pathname.startsWith("/dashboard")) {
                // Déconnecter l'utilisateur
                logoutAdmin();
            }
        };

        // Ajouter un écouteur sur les changements de l'historique
        window.addEventListener("popstate", handleRouteChange);

        return () => {
            window.removeEventListener("popstate", handleRouteChange);
        };
    }, [pathname]);

    const grid = [
        {
            value: art ? art?.length : 0,
            category: "Articles publiés",
            bgColor: "bg-[#0128AE]/10",
            color: "text-[#182067]"
        },
        {
            value: likes,
            category: "Likes",
            bgColor: "bg-[#FF0068]/10",
            color: "text-[#FF0068]"
        },
        {
            value: comment,
            category: "Tous Les Commentaires",
            bgColor: "bg-[#01AE35]/10",
            color: "text-[#01AE35]"
        },
        // {
        //     value: comment,
        //     category: "Commentaires Signalés",
        //     bgColor: "bg-[#FFA500]/10",
        //     color: "text-[#FFA500]"
        // }
    ]

    const [values, setValues] = useState<{ [key: string]: string }>({
        publication: "semaine",
        vuesSite: "semaine",
        vuesPeriode: "semaine",
        vuesPlateforme: "semaine",
        plusVues: "semaine",
        vues: "semaine",
        vuesCategorie: "semaine",
    });

    return (
        <div className="flex flex-col gap-5 px-7 py-10">
            <h1 className="uppercase text-[40px]">{"Statistiques"}</h1>
            <div className="flex flex-row gap-5">
                <Compo
                    texte={"Publication"}
                    page={"Tous les articles"}
                    width={"w-full"}
                    value={values.publication}
                    setValue={(val) => handleChange("publication", val)}
                    isLink={false}
                    link={""}
                    setDateRanges={setDateRanges}
                    dateRanges={dateRanges.publication}
                    rangeKey={"publication"}                >
                    <GridDash tableau={grid} value={values.publication} dateRanges={dateRanges} rangeKey={"publication"} />
                </Compo>
                <Compo
                    texte={"Vues sur le site"}
                    page={"Statistiques"}
                    width={"max-w-[340px] w-full"}
                    value={values.vuesSite}
                    setValue={(val) => handleChange("vuesSite", val)}
                    isLink={false}
                    link={""}
                    setDateRanges={setDateRanges}
                    dateRanges={dateRanges.vuesSite}
                    rangeKey={"vuesSite"}                >
                    <SemiCirc value={values.vuesSite} dateRanges={dateRanges} rangeKey={"vuesSite"} />
                </Compo>
            </div>
            <div className="grid grid-cols-3 gap-5">
                <Compo
                    texte={"Vues"}
                    page={"Tous les articles"}
                    width={"max-w-[400px] w-full"}
                    value={values.vuesPeriode}
                    setValue={(val) => handleChange("vuesPeriode", val)}
                    isLink={false}
                    link={""}
                    setDateRanges={setDateRanges}
                    dateRanges={dateRanges.vuesPeriode}
                    rangeKey={"vuesPeriode"}                >
                    <LineChar value={values.vuesPeriode} dateRanges={dateRanges} rangeKey={"vuesPeriode"} />
                </Compo>
                <Compo
                    texte={"Vues par plateforme"}
                    page={"Tous les articles"}
                    width={"max-w-[400px] w-full"}
                    value={values.vuesPlateforme}
                    setValue={(val) => handleChange("vuesPlateforme", val)}
                    isLink={false}
                    link={""}
                    setDateRanges={setDateRanges}
                    dateRanges={dateRanges.vuesPlateforme}
                    rangeKey={"vuesPlateforme"}                >
                    <BarChar value={values.vuesPlateforme} dateRanges={dateRanges} rangeKey={"vuesPlateforme"} />
                </Compo>
                <Compo
                    texte={"Les plus vues"}
                    page={"Tous les articles"}
                    width={"max-w-[400px] w-full"}
                    value={values.plusVues}
                    setValue={(val) => handleChange("plusVues}", val)}
                    isLink={false}
                    link={""}
                    setDateRanges={setDateRanges}
                    dateRanges={dateRanges.plusVues}
                    rangeKey={"plusVues"}                >
                    <MostPopular value={values.plusVues} dateRanges={dateRanges} rangeKey={"plusVues"} />
                </Compo>
            </div>
            <div className="flex flex-row gap-5">

                {/* <Compo
                    texte={"Vues par période"}
                    page={"Tous les articles"}
                    width={"max-w-[400px] w-full"}
                    value={values.vues}
                    setValue={(val) => handleChange("vues}", val)}
                    isLink={false}
                    link={""}
                    setDateRanges={setDateRanges}
                    dateRanges={dateRanges.vues}
                    rangeKey={"vues"}                >
                    <LineChar value={values.vuesPeriode} dateRanges={dateRanges} rangeKey={"vuesPeriode"} />
                </Compo> */}
                <Compo
                    texte={"Vues par catégorie"}
                    page={"Tous les articles"}
                    width={"w-full"}
                    value={values.vuesCategorie}
                    setValue={(val) => handleChange("vuesCategorie}", val)}
                    isLink={false}
                    link={""}
                    setDateRanges={setDateRanges}
                    dateRanges={dateRanges.vuesCategorie}
                    rangeKey={"vuesCategorie"}                >
                    <CircChar value={values.vuesCategorie} dateRanges={dateRanges} rangeKey={"vuesCategorie"} />
                </Compo>
            </div>
        </div>
    );
};

export default withAdminAuth(DashbordPage);
