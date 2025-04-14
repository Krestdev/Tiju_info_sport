'use client'
import axiosConfig from "@/api/api";
import useStore from "@/context/store";
import { useQuery } from "@tanstack/react-query";
import React from "react";


export default function UserSync(){
    const { activeUser, setActiveUser, setCurrentUser, logout } = useStore();
    const axiosClient = axiosConfig();

    const {isSuccess, data, isError} = useQuery({
        queryKey: ["user", activeUser?.id],
        queryFn: ()=>{
            return axiosClient.get<{user: User}>(`/profile/${activeUser?.id}`)
        },
        enabled: !!activeUser?.id,
        //staleTime: 15 * 60 * 1000, // 15 min
        
    });
    React.useEffect(()=>{
        if(isSuccess){
            setActiveUser(data.data.user);
            setCurrentUser(data.data.user);
        }else if(isError){
            setActiveUser();
            logout();
        }
    }, [isSuccess, isError]);
    return null
}