"use client"

import { getDateRange } from "@/lib/utils";
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker";

interface Props {
    value: string,
    dateRanges: {
        [key: string]: DateRange | undefined;
    },
    rangeKey: string
}

const SemiCirc = ({ value, dateRanges }: Props) => {


    const [data, setData] = useState<number | null>(null);

    useEffect(() => {
        const range = dateRanges["vuesSite"];

        const startDate = range?.from ? range.from.toISOString().split("T")[0] : getDateRange(value).startDate;
        const endDate = range?.to ? range.to.toISOString().split("T")[0] : getDateRange(value).endDate;

        fetch(`/api/analytics?startDate=${startDate}&endDate=${endDate}`)
            .then((res) => res.json())
            .then((data) => {
                const users = data?.rows?.[0]?.metricValues?.[0]?.value ?? "0";
                setData(Number(users));
            })
            .catch((err) => console.error("Erreur API:", err));
    }, [value, dateRanges]);


    return (
        <div className="flex flex-col items-center justify-center h-[140px] gap-3 px-5 py-3">
            <p className="font-bold text-[40px] leading-[52px]">{data ?? "..."}</p>
            <p className="text-[16px] leading-[20.8px] text-[#545454]">{"visites"}</p>
        </div>
    )
}

export default SemiCirc