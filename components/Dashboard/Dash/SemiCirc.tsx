"use client"

import { getDateRange } from "@/app/dashboard/page";
import { useEffect, useState } from "react"

interface Props {
    value: string
}

const SemiCirc = ({value}: Props) => {


    const [data, setData] = useState<number | null>(null);
    useEffect(() => {
        fetch(`/api/analytics?startDate=${getDateRange(value).startDate}&endDate=${getDateRange(value).endDate}`)
            .then((res) => res.json())
            .then((data) => {
                const users = data?.rows?.[0]?.metricValues?.[0]?.value ?? "0";
                setData(Number(users));
            })
            .catch((err) => console.error("Erreur API:", err));
    }, [value]);

    return (
        <div className="flex flex-col items-center justify-center h-[140px] gap-3 px-5 py-3">
            <p className="font-bold text-[40px] leading-[52px]">{data ?? "..."}</p>
            <p className="text-[16px] leading-[20.8px] text-[#545454]">{"visites"}</p>
        </div>
    )
}

export default SemiCirc