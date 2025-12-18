import { toast } from '@/hooks/use-toast'
import { PublicServiceService } from '@/services/api/public-service.service';
import { publicServiceListStore } from '@/store/services/public-service-list.store';
// import { ServicesService } from '@/services/api/services.service' // Parece não ser usado aqui, comentei
import { publicServiceStore } from '@/store/services/public-service.store';
import { useStore } from 'zustand';

const usePublicServices = () => {

    const publicServicesService = new PublicServiceService();

    // Instâncias dos stores
    const publicService = useStore(publicServiceStore);
    const publicServiceList = useStore(publicServiceListStore);

    // 1. Buscar um serviço (readOne)
    const fetchOneService = async (id: string) => {
        try {
            const request = await publicServicesService.readOne(id);
            const data = request.data.data;

            // Se você implementou o fnSetData no store (sugerido anteriormente), use assim:
            // publicService.fnSetData(data);

            // OU continue usando fnOnChange campo a campo (Corrigido para usar 'publicService'):
            publicService.fnOnChange("id", data.id || null);
            publicService.fnOnChange("id_workspace", data.id_workspace);
            publicService.fnOnChange("id_category", data.id_category);
            publicService.fnOnChange("name", data.name);
            publicService.fnOnChange("logo_image", data.logo_image);
            publicService.fnOnChange("cover_image", data.cover_image);
            publicService.fnOnChange("content", data.content);
            publicService.fnOnChange("gallery", data.gallery);

            // Correção: A API retorna 'Address' (maiúsculo), o store espera 'address'
            publicService.fnOnChange("address", data.Address || data.address);

            // Se houver categoria
            publicService.fnOnChange("category", data.Category || data.category);

            publicService.fnOnChange("fetching", false);
            return request;

        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar serviço',
                description: 'Não foi possível buscar os detalhes do serviço.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }

    // 2. Listar todos os serviços (readAll)
    const fetchServices = async () => {
        try {
            const request = await publicServicesService.readAll();

            // Corrigido para usar 'publicServiceList'
            // Se você usou o store de lista sugerido anteriormente:
            publicServiceList.fnOnChange("services", request.data.data);
            publicServiceList.fnOnChange("fetching", false);

            return request;

        } catch (error: any) {
            console.log(error)
            toast({
                title: 'Erro ao carregar serviços',
                description: 'Não foi possível buscar a lista de serviços.',
                variant: 'destructive',
            })

            return { ok: false, message: error.message || error, data: null }
        }
    }

    return {
        fetchServices,
        fetchOneService,
    }
}

export default usePublicServices;