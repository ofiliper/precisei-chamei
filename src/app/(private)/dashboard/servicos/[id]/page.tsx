'use client';

import { useEffect } from "react";
import DashboardContainer from "@/components/shared/Dashboard/Dashboard";
import Servicos from "@/components/layout/servicos/Servicos";
import useServices from "@/hooks/useServices";
import { useParams } from "next/navigation";

// IMPORTANTE: Ajuste aqui a URL base se necessário
const BASE_IMAGE_URL = "";

// Interface compatível com o retorno da sua API
interface ImageItem {
    id: string;
    id_workspace?: string;
    name: string | null;
    path: string;
    createdAt: string;
    updatedAt: string;
}

export default function GalleryLayout() {

    const serviceHook = useServices();

    // 1. Pega os parâmetros da URL
    const params = useParams();

    // 2. Extrai o ID (certifique-se que sua pasta se chama [id])
    const id = params.id;

    useEffect(() => {
        // É importante verificar se o ID existe antes de chamar
        if (id) {
            // Provavelmente sua função precisa receber o ID como argumento

            //@ts-ignore
            serviceHook.fetchOneService(id);
        }
    }, [id])


    return (
        <DashboardContainer>
            <Servicos />
        </DashboardContainer>
    );
}