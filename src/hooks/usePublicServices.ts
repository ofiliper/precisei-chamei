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

    const fetchCreateWhatsappContact = async (id_service: string) => {
        try {
            const request = await publicServicesService.createWhatsappContact(id_service);
            return request;
        } catch (error: any) {
            return { ok: false, message: error.message || error, data: null }
        }
    }

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
            publicService.fnOnChange("whatsapp", data.whatsapp.replace('(', '').replace(')', '').replace('-', '').replace(' ', ''));

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

    const fetchServices = async (queryParams?: {
        id_category?: string;
        id_subcategory?: string;
        page_size?: number;
        current_page?: number;
        append?: boolean;
    }) => {
        try {
            publicServiceList.fnOnChange("fetching", true);

            const latAndLng = localStorage.getItem('user_location_data');
            const latlgn = JSON.parse(latAndLng || '{}');

            const response = await publicServicesService.readAll({
                ...(latlgn.lat && latlgn.lng ? { lat: latlgn.lat, lng: latlgn.lng } : {}),
                ...queryParams
            });

            // Verifique se o caminho é realmente .data.data.data ou apenas .data.data
            const newServices = response.data.data.data;
            const meta = response.data.data.meta;

            if (queryParams?.append) {
                const currentServices = publicServiceList.data.services || [];
                const filteredNew = newServices.filter(
                    (ns: any) => !currentServices.some((cs: any) => cs.id === ns.id)
                );
                publicServiceList.fnOnChange("services", [...currentServices, ...filteredNew]);
            } else {
                publicServiceList.fnOnChange("services", newServices);
            }

            // Salva os metadados. IMPORTANTE: Garanta que o store aceite esse objeto
            publicServiceList.fnOnChange("meta", meta);
            publicServiceList.fnOnChange("fetching", false);

            return response;
        } catch (error) {
            publicServiceList.fnOnChange("fetching", false);
            console.error("Erro ao buscar serviços:", error);
        }
    };
    return {
        fetchServices,
        fetchOneService,
        fetchCreateWhatsappContact
    }
}

export default usePublicServices;