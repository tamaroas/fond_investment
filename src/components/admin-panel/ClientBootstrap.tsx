"use client";

import { useBootstrapStore } from "@/store/zustandStores/useBootstrapStore ";
import { userBootstrap } from "@/utils/services/userServices";
import { useEffect, useState } from "react";
import * as React from 'react';

export default function ClientBootstrap({children}: {children: React.ReactNode}){
    const { bootstrap, setBootstrap } = useBootstrapStore();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if(!bootstrap){
            userBootstrap((response:any) => {
            setBootstrap(response.datas);
            setIsLoading(false);
        })
        }else{
            setIsLoading(false);
        }
        
    }, [bootstrap, setBootstrap]);

    if(isLoading){
        return <div>Chargement...</div>
    }

    return <>{children}</>
}