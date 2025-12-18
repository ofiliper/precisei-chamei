import { toast } from '@/hooks/use-toast'
import { PublicServiceService } from '@/services/api/public-service.service';
import { ServicesService } from '@/services/api/services.service' // Ajuste o caminho se necessário
import { serviceListStore } from '@/store/services/service-list-store';
import { serviceStore } from '@/store/services/services-store';
import { useStore } from 'zustand';

const usePublicServices = () => {

    const publicServicesService = new PublicServiceService();
    const servicesList = useStore(serviceListStore);
    const service = useStore(serviceStore);

    // 1. Listar todos os serviços (readAll)
    const fetchOneService = async (id: string) => {
        try {
            const request = await publicServicesService.readOne(id);
            console.log(request)
            console.log(request)
            service.fnOnChange("id", request.data.data?.id || null);
            service.fnOnChange("id_workspace", request.data.data.id_workspace);
            service.fnOnChange("id_category", request.data.data.id_category);
            service.fnOnChange("name", request.data.data.name);
            service.fnOnChange("logo_image", request.data.data.logo_image);
            service.fnOnChange("cover_image", request.data.data.cover_image);
            service.fnOnChange("content", request.data.data.content);
            service.fnOnChange("gallery", request.data.data.gallery);
            service.fnOnChange("address", request.data.data.Address);
            service.fnOnChange("fetching", false);
            return request
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

    const fetchServices = async () => {
        try {
            const request = await publicServicesService.readAll();
            console.log(request)
            servicesList.fnOnChange("services", request.data.data);
            servicesList.fnOnChange("fetching", false);
            return request
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

    // 2. Criar serviço (create)
    // Notei que seu service pede { image: any }, mantive a tipagem.
  

    return {
        fetchServices,
        fetchOneService,
     
    }
}

export default usePublicServices